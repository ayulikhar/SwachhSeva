import { db } from "./db";
import {
  reports,
  type Report, type InsertReport
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Reports
  createReport(report: InsertReport): Promise<Report>;
  getReports(): Promise<Report[]>;
  getUserReports(userId: string): Promise<Report[]>;
}

export class DatabaseStorage implements IStorage {
  // Note: User storage is handled by Auth integration's storage.ts

  async createReport(report: InsertReport): Promise<Report> {
    const [newReport] = await db.insert(reports).values(report).returning();
    return newReport;
  }

  async getReports(): Promise<Report[]> {
    return await db.select().from(reports).orderBy(desc(reports.createdAt));
  }

  async getUserReports(userId: string): Promise<Report[]> {
    return await db.select().from(reports).where(eq(reports.userId, userId)).orderBy(desc(reports.createdAt));
  }
}

export const storage = new DatabaseStorage();
