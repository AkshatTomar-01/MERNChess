import { useState, useEffect, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Chess, Square } from "chess.js";
import Chessboard from "@/components/Chessboard";
import MoveList from "@/components/MoveList";
import GameControls from "@/components/GameControls";
import ChatPanel from "@/components/ChatPanel";
import DifficultySelector from "@/components/DifficultySelector";
import GameCodeModal from "@/components/GameCodeModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Crown } from "lucide-react";
import { getCurrentUserId, getCurrentUsername } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { GameWithPlayers } from "@shared/schema";

export default function Game() {
  const [, params] = useRoute("/game/:mode");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const mode = params?.mode as "ai" | "online" | "friendly" | string;
  const isViewMode = mode && !["ai", "online", "friendly"].includes(mode);
  const gameId = isViewMode ? mode : null;
  
  const [game, setGame] = useState(new Chess());
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [showDifficultySelector, setShowDifficultySelector] = useState(mode === "ai");
  const [showGameCodeModal, setShowGameCodeModal] = useState(mode === "friendly");
  const [currentGameId, setCurrentGameId] = useState<string | null>(gameId);
  const [playerColor, setPlayerColor] = useState<"white" | "black">("white");
  const wsRef = useRef<WebSocket | null>(null);

  const currentUserId = getCurrentUserId();
  const currentUsername = getCurrentUsername();

  const { data: gameData, isLoading: gameLoading } = useQuery<GameWithPlayers>({
    queryKey: ["/api/game", currentGameId],
    enabled: !!currentGameId,
  });

  useEffect(() => {
    if (gameData) {
      const chess = new Chess();
      if (gameData.fen) {
        chess.load(gameData.fen);
      }
      setGame(chess);
      
      if (gameData.player2Id === currentUserId) {
        setPlayerColor("black");
      }
    }
  }, [gameData, currentUserId]);

  useEffect(() => {
    if (currentGameId && (mode === "online" || mode === "friendly")) {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: "join", gameId: currentGameId, userId: currentUserId }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === "move") {
          setGame(prevGame => {
            const newGame = new Chess(prevGame.fen());
            newGame.move({ from: data.from, to: data.to, promotion: data.promotion });
            return newGame;
          });
          queryClient.invalidateQueries({ queryKey: ["/api/game", currentGameId] });
        } else if (data.type === "chat") {
          queryClient.invalidateQueries({ queryKey: [`/api/game/chat/${currentGameId}`] });
        } else if (data.type === "gameOver") {
          toast({
            title: "Game Over",
            description: data.result === "draw" ? "The game ended in a draw" : `${data.winner} wins!`,
          });
          queryClient.invalidateQueries({ queryKey: ["/api/game", currentGameId] });
        }
      };

      wsRef.current = ws;

      return () => {
        ws.close();
      };
    }
  }, [currentGameId, mode, currentUserId, toast]);

  const createGameMutation = useMutation({
    mutationFn: async (data: { mode: string; difficulty?: string; gameCode?: string }) => {
      return await apiRequest("POST", "/api/game/create", data);
    },
    onSuccess: (data: { gameId: string; gameCode?: string }) => {
      setCurrentGameId(data.gameId);
      setShowDifficultySelector(false);
      setShowGameCodeModal(false);
      
      if (data.gameCode) {
        toast({
          title: "Game created!",
          description: `Game code: ${data.gameCode}`,
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/game", data.gameId] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to create game",
        description: error.message,
      });
    },
  });

  const makeMoveMutation = useMutation({
    mutationFn: async (moveData: { gameId: string; from: string; to: string; promotion?: string }) => {
      return await apiRequest("POST", "/api/game/move", moveData);
    },
    onSuccess: (data: { fen: string; pgn: string; aiMove?: { from: string; to: string } }) => {
      // Update game state with authoritative server FEN
      const newGame = new Chess();
      newGame.loadPgn(data.pgn);
      setGame(newGame);
      queryClient.invalidateQueries({ queryKey: ["/api/game", currentGameId] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Invalid move",
        description: error.message,
      });
    },
  });

  const handleMove = (from: Square, to: Square, promotion?: string) => {
    if (!currentGameId) return;
    if (gameData?.status === "finished") return;
    
    const move = game.move({ from, to, promotion: promotion as any });
    if (!move) return;

    setGame(new Chess(game.fen()));

    if (mode === "online" || mode === "friendly") {
      wsRef.current?.send(JSON.stringify({
        type: "move",
        gameId: currentGameId,
        from,
        to,
        promotion,
      }));
    }

    makeMoveMutation.mutate({
      gameId: currentGameId,
      from,
      to,
      promotion,
    });
  };

  const handleDifficultySelect = (difficulty: "easy" | "medium" | "hard") => {
    setSelectedDifficulty(difficulty);
    createGameMutation.mutate({ mode: "ai", difficulty });
  };

  const handleGameCodeSubmit = (code?: string) => {
    if (code) {
      createGameMutation.mutate({ mode: "friendly", gameCode: code });
    } else {
      createGameMutation.mutate({ mode: "friendly" });
    }
  };

  const handleResign = async () => {
    if (!currentGameId) return;
    try {
      await apiRequest("POST", "/api/game/resign", { gameId: currentGameId });
      toast({
        title: "Game resigned",
        description: "You have resigned from the game.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/game", currentGameId] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleOfferDraw = async () => {
    toast({
      title: "Draw offered",
      description: "Your opponent will be notified.",
    });
  };

  const getInitials = (username?: string) => {
    if (!username) return "?";
    return username.substring(0, 2).toUpperCase();
  };

  const getOpponentName = () => {
    if (!gameData) return "Opponent";
    if (gameData.mode === "ai") return `Stockfish (${gameData.difficulty || "medium"})`;
    if (gameData.player1Id === currentUserId) return gameData.player2?.username || "Waiting...";
    return gameData.player1?.username || "Waiting...";
  };

  if (showDifficultySelector) {
    return <DifficultySelector onSelect={handleDifficultySelect} onCancel={() => setLocation("/dashboard")} />;
  }

  if (showGameCodeModal) {
    return <GameCodeModal onSubmit={handleGameCodeSubmit} onCancel={() => setLocation("/dashboard")} />;
  }

  // Auto-create online game when mode is online and no game exists
  useEffect(() => {
    if (!currentGameId && mode === "online" && !createGameMutation.isPending) {
      createGameMutation.mutate({ mode: "online" });
    }
  }, [mode, currentGameId]);

  // Show loading while creating/joining online game
  if (!currentGameId && mode === "online") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-12 text-center">
            <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Finding opponent...</h2>
            <p className="text-muted-foreground">Searching for available players or creating a new game</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show waiting for opponent if game is in waiting status
  if (gameData?.status === "waiting" && (mode === "online" || mode === "friendly")) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Waiting for opponent...</h2>
            <p className="text-muted-foreground mb-4">
              {mode === "friendly" && gameData.gameCode 
                ? `Share game code: ${gameData.gameCode}`
                : "Waiting for another player to join"}
            </p>
            <Button onClick={() => setLocation("/dashboard")} variant="outline" data-testid="button-cancel">
              Cancel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setLocation("/dashboard")}
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">ChessMaster</span>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[300px_1fr_320px] gap-6 items-start">
          {/* Left Panel - Move History */}
          <div className="hidden lg:block">
            <MoveList game={game} />
          </div>

          {/* Center - Chessboard */}
          <div className="space-y-6">
            {/* Opponent Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-muted">
                        {getInitials(getOpponentName())}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{getOpponentName()}</div>
                      <div className="text-sm text-muted-foreground">
                        {gameData?.mode === "ai" ? "Computer" : "Online Player"}
                      </div>
                    </div>
                  </div>
                  {gameData?.status === "finished" && gameData.winnerId !== currentUserId && (
                    <Badge variant="destructive">Winner</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Chessboard */}
            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                <Chessboard
                  game={game}
                  onMove={handleMove}
                  disabled={gameData?.status === "finished" || gameLoading}
                  orientation={playerColor}
                  data-testid="chessboard"
                />
              </div>
            </div>

            {/* Player Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(currentUsername || undefined)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{currentUsername}</div>
                      <div className="text-sm text-muted-foreground">You</div>
                    </div>
                  </div>
                  {gameData?.status === "finished" && gameData.winnerId === currentUserId && (
                    <Badge className="bg-chart-2 text-chart-2-foreground">Winner</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Mobile Move List */}
            <div className="lg:hidden">
              <MoveList game={game} />
            </div>
          </div>

          {/* Right Panel - Controls & Chat */}
          <div className="space-y-6">
            <GameControls
              gameStatus={gameData?.status || "active"}
              onResign={handleResign}
              onOfferDraw={handleOfferDraw}
              gameResult={gameData?.result || null}
            />
            
            {currentGameId && (mode === "online" || mode === "friendly") && (
              <ChatPanel gameId={currentGameId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
