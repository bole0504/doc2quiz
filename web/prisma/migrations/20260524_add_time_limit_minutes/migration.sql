-- Add time limit (minutes) per exam
ALTER TABLE "Exam" ADD COLUMN IF NOT EXISTS "timeLimitMinutes" INTEGER;

