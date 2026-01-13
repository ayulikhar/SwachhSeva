import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

// Export Auth and Chat models
export * from "./models/auth";
export * from "./models/chat";

// Reports Table
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id), // users.id is varchar in auth model
  imageUrl: text("image_url").notNull(),
  location: text("location").notNull(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  category: text("category").notNull(),
  severity: text("severity").notNull(),
  description: text("description"),
  status: text("status").default('pending'),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReportSchema = createInsertSchema(reports).omit({ id: true, createdAt: true });

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

export type AnalyzeResponse = {
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
};
