import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  wins: integer("wins").notNull().default(0),
  losses: integer("losses").notNull().default(0),
  draws: integer("draws").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Games table
export const games = pgTable("games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  player1Id: varchar("player1_id").references(() => users.id),
  player2Id: varchar("player2_id").references(() => users.id),
  mode: text("mode").notNull(), // "ai", "online", "friendly"
  difficulty: text("difficulty"), // for AI mode: "easy", "medium", "hard"
  gameCode: text("game_code"), // for friendly matches
  fen: text("fen").notNull().default("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"), // current position
  pgn: text("pgn").notNull().default(""), // move history
  result: text("result"), // "white", "black", "draw", null (ongoing)
  winnerId: varchar("winner_id").references(() => users.id),
  currentTurn: text("current_turn").notNull().default("white"),
  status: text("status").notNull().default("waiting"), // "waiting", "active", "finished"
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Chat messages table
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameId: varchar("game_id").notNull().references(() => games.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  gamesAsPlayer1: many(games, { relationName: "player1" }),
  gamesAsPlayer2: many(games, { relationName: "player2" }),
  wonGames: many(games, { relationName: "winner" }),
  chatMessages: many(chatMessages),
}));

export const gamesRelations = relations(games, ({ one, many }) => ({
  player1: one(users, {
    fields: [games.player1Id],
    references: [users.id],
    relationName: "player1",
  }),
  player2: one(users, {
    fields: [games.player2Id],
    references: [users.id],
    relationName: "player2",
  }),
  winner: one(users, {
    fields: [games.winnerId],
    references: [users.id],
    relationName: "winner",
  }),
  chatMessages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  game: one(games, {
    fields: [chatMessages.gameId],
    references: [games.id],
  }),
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGameSchema = createInsertSchema(games).pick({
  mode: true,
  difficulty: true,
  gameCode: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  gameId: true,
  message: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Extended types for API responses
export type UserProfile = Omit<User, "password">;
export type GameWithPlayers = Game & {
  player1?: UserProfile;
  player2?: UserProfile;
  winner?: UserProfile;
};
export type ChatMessageWithUser = ChatMessage & {
  user: UserProfile;
};
