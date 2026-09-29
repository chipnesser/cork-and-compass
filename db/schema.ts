import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
export const lessonProgress=sqliteTable('lesson_progress',{learner:text('learner').notNull(),lesson:text('lesson').notNull(),answers:text('answers').notNull().default('[]')},table=>[primaryKey({columns:[table.learner,table.lesson]})]);
