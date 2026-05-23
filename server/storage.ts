import { 
  users, 
  games, 
  chatMessages,
  type User, 
  type InsertUser,
  type Game,
  type InsertGame,
  type ChatMessage,
  type InsertChatMessage,
  type UserProfile,
  type GameWithPlayers,
  type ChatMessageWithUser,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, or, and, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserProfile(id: string): Promise<UserProfile | undefined>;
  updateUserStats(id: string, wins: number, losses: number, draws: number): Promise<void>;
  
  createGame(game: Partial<InsertGame> & { player1Id: string }): Promise<Game>;
  getGame(id: string): Promise<Game | undefined>;
  getGameWithPlayers(id: string): Promise<GameWithPlayers | undefined>;
  updateGameFen(id: string, fen: string, pgn: string): Promise<void>;
  finishGame(id: string, result: string, winnerId?: string): Promise<void>;
  getUserGames(userId: string, limit?: number): Promise<GameWithPlayers[]>;
  getGameByCode(code: string): Promise<Game | undefined>;
  joinGame(gameId: string, player2Id: string): Promise<void>;
  findWaitingOnlineGame(excludeUserId: string): Promise<Game | undefined>;
  
  createChatMessage(message: InsertChatMessage & { userId: string }): Promise<ChatMessage>;
  getGameChatMessages(gameId: string): Promise<ChatMessageWithUser[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getUserProfile(id: string): Promise<UserProfile | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const { password, ...profile } = user;
    return profile;
  }

  async updateUserStats(id: string, wins: number, losses: number, draws: number): Promise<void> {
    await db
      .update(users)
      .set({ wins, losses, draws })
      .where(eq(users.id, id));
  }

  async createGame(game: Partial<InsertGame> & { player1Id: string }): Promise<Game> {
    const [newGame] = await db
      .insert(games)
      .values(game as any)
      .returning();
    return newGame;
  }

  async getGame(id: string): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game || undefined;
  }

  async getGameWithPlayers(id: string): Promise<GameWithPlayers | undefined> {
    const game = await this.getGame(id);
    if (!game) return undefined;

    const player1 = game.player1Id ? await this.getUserProfile(game.player1Id) : undefined;
    const player2 = game.player2Id ? await this.getUserProfile(game.player2Id) : undefined;
    const winner = game.winnerId ? await this.getUserProfile(game.winnerId) : undefined;

    return {
      ...game,
      player1,
      player2,
      winner,
    };
  }

  async updateGameFen(id: string, fen: string, pgn: string): Promise<void> {
    await db
      .update(games)
      .set({ fen, pgn, updatedAt: new Date() })
      .where(eq(games.id, id));
  }

  async finishGame(id: string, result: string, winnerId?: string): Promise<void> {
    await db
      .update(games)
      .set({ 
        status: "finished", 
        result, 
        winnerId,
        updatedAt: new Date() 
      })
      .where(eq(games.id, id));
  }

  async getUserGames(userId: string, limit: number = 10): Promise<GameWithPlayers[]> {
    const userGames = await db
      .select()
      .from(games)
      .where(
        or(
          eq(games.player1Id, userId),
          eq(games.player2Id, userId)
        )
      )
      .orderBy(desc(games.createdAt))
      .limit(limit);

    const gamesWithPlayers = await Promise.all(
      userGames.map(async (game) => {
        const player1 = game.player1Id ? await this.getUserProfile(game.player1Id) : undefined;
        const player2 = game.player2Id ? await this.getUserProfile(game.player2Id) : undefined;
        const winner = game.winnerId ? await this.getUserProfile(game.winnerId) : undefined;
        
        return {
          ...game,
          player1,
          player2,
          winner,
        };
      })
    );

    return gamesWithPlayers;
  }

  async getGameByCode(code: string): Promise<Game | undefined> {
    const [game] = await db
      .select()
      .from(games)
      .where(eq(games.gameCode, code));
    return game || undefined;
  }

  async joinGame(gameId: string, player2Id: string): Promise<void> {
    await db
      .update(games)
      .set({ 
        player2Id, 
        status: "active",
        updatedAt: new Date() 
      })
      .where(eq(games.id, gameId));
  }

  async findWaitingOnlineGame(excludeUserId: string): Promise<Game | undefined> {
    const [game] = await db
      .select()
      .from(games)
      .where(
        and(
          eq(games.mode, "online"),
          eq(games.status, "waiting"),
          sql`${games.player1Id} != ${excludeUserId}`
        )
      )
      .limit(1);
    return game || undefined;
  }

  async createChatMessage(message: InsertChatMessage & { userId: string }): Promise<ChatMessage> {
    const [newMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getGameChatMessages(gameId: string): Promise<ChatMessageWithUser[]> {
    const messages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.gameId, gameId))
      .orderBy(chatMessages.createdAt);

    const messagesWithUsers = await Promise.all(
      messages.map(async (msg) => {
        const user = await this.getUserProfile(msg.userId);
        return {
          ...msg,
          user: user!,
        };
      })
    );

    return messagesWithUsers;
  }
}

export const storage = new DatabaseStorage();
