-- Run this in your Supabase SQL editor
-- Adds the 'grupo' column to the modelos table
-- This enables grouping models (e.g. "iPhone 15" → "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro Max")

ALTER TABLE modelos ADD COLUMN IF NOT EXISTS grupo TEXT DEFAULT NULL;

-- Optional: create an index for faster GROUP BY queries
CREATE INDEX IF NOT EXISTS idx_modelos_grupo ON modelos (produto_id, grupo);
