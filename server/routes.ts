import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Chess } from "chess.js";
import { nanoid } from "nanoid";
import { storage } from "./storage";
import { insertUserSchema, insertGameSchema, insertChatMessageSchema } from "@shared/schema";

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable must be set for JWT authentication");
}

const JWT_SECRET = process.env.SESSION_SECRET;

interface AuthRequest extends express.Request {
  userId?: string;
}

const authMiddleware = async (
  req: AuthRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const gameConnections = new Map<string, Set<WebSocket>>();

async function getAIMove(fen: string, difficulty: string): Promise<{ from: string; to: string; promotion?: string } | null> {
  const game = new Chess(fen);
  const moves = game.moves({ verbose: true });
  
  if (moves.length === 0) return null;

  const scoredMoves = moves.map(move => {
    let score = 0;
    
    const pieceValues: Record<string, number> = {
      'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0
    };
    
    if (move.captured) {
      score += pieceValues[move.captured] * 10;
    }
    if (move.san.includes('+')) {
      score += 5;
    }
    if (move.san.includes('#')) {
      score += 1000;
    }
    if (['e4', 'e5', 'd4', 'd5'].includes(move.to)) {
      score += 2;
    }
    if (move.flags.includes('p')) {
      score += 8;
    }
    if (move.flags.includes('k') || move.flags.includes('q')) {
      score += 3;
    }
    const moveCount = game.history().length;
    if ((move.piece === 'n' || move.piece === 'b') && moveCount < 20) {
      score += 1;
    }
    
    return { move, score };
  });

  scoredMoves.sort((a, b) => b.score - a.score);

  let selectedMove;
  
  if (difficulty === "easy") {
    const weakMoves = scoredMoves.slice(Math.floor(scoredMoves.length * 0.6));
    selectedMove = weakMoves.length > 0 
      ? weakMoves[Math.floor(Math.random() * weakMoves.length)].move
      : scoredMoves[scoredMoves.length - 1].move;
  } else if (difficulty === "medium") {
    const goodMoves = scoredMoves.slice(0, Math.ceil(scoredMoves.length * 0.6));
    selectedMove = goodMoves[Math.floor(Math.random() * goodMoves.length)].move;
  } else {
    const bestMoves = scoredMoves.slice(0, Math.max(1, Math.ceil(scoredMoves.length * 0.3)));
    selectedMove = bestMoves[Math.floor(Math.random() * bestMoves.length)].move;
  }
  
  const result: { from: string; to: string; promotion?: string } = { 
    from: selectedMove.from, 
    to: selectedMove.to 
  };
  
  if (selectedMove.flags.includes('p')) {
    result.promotion = 'q';
  }
  
  return result;
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { username, password } = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({ username, password: hashedPassword });

      const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET);
      res.json({ token });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Signup failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = insertUserSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET);
      res.json({ token });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Login failed" });
    }
  });

  app.get("/api/auth/profile", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const profile = await storage.getUserProfile(req.userId!);
      if (!profile) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/game/create", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { mode, difficulty, gameCode } = req.body;
      
      if (mode === "online") {
        const waitingGame = await storage.findWaitingOnlineGame(req.userId!);
        if (waitingGame) {
          await storage.joinGame(waitingGame.id, req.userId!);
          return res.json({ gameId: waitingGame.id });
        }
      }

      let code = gameCode;
      if (mode === "friendly" && !code) {
        code = nanoid(6).toUpperCase();
      }

      if (mode === "friendly" && code) {
        const existingGame = await storage.getGameByCode(code);
        if (existingGame) {
          if (existingGame.player2Id) {
            return res.status(400).json({ message: "Game is already full" });
          }
          await storage.joinGame(existingGame.id, req.userId!);
          return res.json({ gameId: existingGame.id });
        }
      }

      const game = await storage.createGame({
        player1Id: req.userId!,
        mode,
        difficulty: mode === "ai" ? difficulty : undefined,
        gameCode: mode === "friendly" ? code : undefined,
        status: mode === "ai" ? "active" : "waiting",
      });

      res.json({ gameId: game.id, gameCode: code });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/game/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const game = await storage.getGameWithPlayers(req.params.id);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      res.json(game);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/game/move", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { gameId, from, to, promotion } = req.body;
      
      const game = await storage.getGame(gameId);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      const chess = new Chess(game.fen);
      const move = chess.move({ from, to, promotion });
      
      if (!move) {
        return res.status(400).json({ message: "Invalid move" });
      }

      await storage.updateGameFen(gameId, chess.fen(), chess.pgn());

      if (chess.isGameOver()) {
        let result = "draw";
        let winnerId: string | undefined;

        if (chess.isCheckmate()) {
          result = chess.turn() === "w" ? "black" : "white";
          winnerId = chess.turn() === "w" ? game.player2Id || undefined : game.player1Id;
        }

        await storage.finishGame(gameId, result, winnerId);

        if (winnerId) {
          const winner = await storage.getUser(winnerId);
          const loser = await storage.getUser(winnerId === game.player1Id ? game.player2Id! : game.player1Id);
          
          if (winner) {
            await storage.updateUserStats(winnerId, winner.wins + 1, winner.losses, winner.draws);
          }
          if (loser) {
            await storage.updateUserStats(loser.id, loser.wins, loser.losses + 1, loser.draws);
          }
        } else {
          if (game.player1Id) {
            const player1 = await storage.getUser(game.player1Id);
            if (player1) await storage.updateUserStats(game.player1Id, player1.wins, player1.losses, player1.draws + 1);
          }
          if (game.player2Id) {
            const player2 = await storage.getUser(game.player2Id);
            if (player2) await storage.updateUserStats(game.player2Id, player2.wins, player2.losses, player2.draws + 1);
          }
        }
      }

      let aiMove = null;
      if (game.mode === "ai" && !chess.isGameOver()) {
        aiMove = await getAIMove(chess.fen(), game.difficulty || "medium");
        if (aiMove) {
          const aiMoveResult = chess.move({ 
            from: aiMove.from, 
            to: aiMove.to,
            promotion: aiMove.promotion as any
          });
          
          if (!aiMoveResult) {
            console.error("AI move failed:", aiMove);
            return res.json({ fen: chess.fen(), pgn: chess.pgn() });
          }
          await storage.updateGameFen(gameId, chess.fen(), chess.pgn());

          if (chess.isGameOver()) {
            let result = "draw";
            let winnerId: string | undefined;

            if (chess.isCheckmate()) {
              result = chess.turn() === "w" ? "black" : "white";
              winnerId = chess.turn() === "b" ? game.player1Id : undefined;
            }

            await storage.finishGame(gameId, result, winnerId);

            if (winnerId) {
              const winner = await storage.getUser(winnerId);
              if (winner) await storage.updateUserStats(winnerId, winner.wins + 1, winner.losses, winner.draws);
            } else {
              if (game.player1Id) {
                const player1 = await storage.getUser(game.player1Id);
                if (player1) await storage.updateUserStats(game.player1Id, player1.wins, player1.losses, player1.draws + 1);
              }
            }
          }
        }
      }

      res.json({ fen: chess.fen(), pgn: chess.pgn(), aiMove });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/game/resign", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { gameId } = req.body;
      
      const game = await storage.getGame(gameId);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      const winnerId = req.userId === game.player1Id ? game.player2Id : game.player1Id;
      const result = winnerId === game.player1Id ? "white" : "black";

      await storage.finishGame(gameId, result, winnerId || undefined);

      if (winnerId) {
        const winner = await storage.getUser(winnerId);
        if (winner) await storage.updateUserStats(winnerId, winner.wins + 1, winner.losses, winner.draws);
      }
      
      const loser = await storage.getUser(req.userId!);
      if (loser) await storage.updateUserStats(req.userId!, loser.wins, loser.losses + 1, loser.draws);

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/game/recent", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const games = await storage.getUserGames(req.userId!, 5);
      res.json(games);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/game/history", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const games = await storage.getUserGames(req.userId!, 50);
      res.json(games);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/game/chat", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { gameId, message } = req.body;
      
      const chatMessage = await storage.createChatMessage({
        gameId,
        userId: req.userId!,
        message,
      });

      const connections = gameConnections.get(gameId);
      if (connections) {
        const user = await storage.getUserProfile(req.userId!);
        const messageWithUser = { ...chatMessage, user };
        
        connections.forEach((ws) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "chat", message: messageWithUser }));
          }
        });
      }

      res.json(chatMessage);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/game/chat/:gameId", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const messages = await storage.getGameChatMessages(req.params.gameId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on("connection", (ws: WebSocket) => {
    let currentGameId: string | null = null;

    ws.on("message", async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === "join") {
          currentGameId = message.gameId;
          
          if (!gameConnections.has(currentGameId)) {
            gameConnections.set(currentGameId, new Set());
          }
          gameConnections.get(currentGameId)!.add(ws);
        }

        if (message.type === "move" && currentGameId) {
          const connections = gameConnections.get(currentGameId);
          if (connections) {
            connections.forEach((clientWs) => {
              if (clientWs !== ws && clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({
                  type: "move",
                  from: message.from,
                  to: message.to,
                  promotion: message.promotion,
                }));
              }
            });
          }
        }
      } catch (error) {
        console.error("WebSocket error:", error);
      }
    });

    ws.on("close", () => {
      if (currentGameId) {
        const connections = gameConnections.get(currentGameId);
        if (connections) {
          connections.delete(ws);
          if (connections.size === 0) {
            gameConnections.delete(currentGameId);
          }
        }
      }
    });
  });

  return httpServer;
}
