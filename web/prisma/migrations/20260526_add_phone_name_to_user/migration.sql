-- Migration: add phone + name to User, make email optional
-- Run manually if prisma migrate dev hangs (DIRECT_URL must point to port 5432)

-- Add name column with default
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "name" TEXT NOT NULL DEFAULT '';

-- Add phone column (nullable, unique)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phone" TEXT;

-- Create unique index on phone (only for non-null values)
CREATE UNIQUE INDEX IF NOT EXISTS "User_phone_key" ON "User"("phone");

-- Make email nullable (existing rows keep their values)
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;
