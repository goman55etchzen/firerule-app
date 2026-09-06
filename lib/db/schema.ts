import { pgTable, serial, text, doublePrecision, integer, timestamp } from 'drizzle-orm/pg-core';

// 1. 感知器マスターテーブル
export const detectors = pgTable('detectors', {
  id: serial('id').primaryKey(),
  modelNumber: text('model_number').notNull(),
  maker: text('maker').notNull(),
  type: text('type').notNull(),
  maxHeight: doublePrecision('max_height').notNull(),
  coverageFireproof: doublePrecision('coverage_fireproof').notNull(),
  coverageNonFireproof: doublePrecision('coverage_non_fireproof').notNull(),
});

// 2. 計算・判定履歴テーブル
export const calculationLogs = pgTable('calculation_logs', {
  id: serial('id').primaryKey(),
  projectName: text('project_name').notNull(),
  roomName: text('room_name').notNull(),
  area: doublePrecision('area').notNull(),
  ceilingHeight: doublePrecision('ceiling_height').notNull(),
  recommendedDetector: text('recommended_detector').notNull(),
  requiredCount: integer('required_count').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});