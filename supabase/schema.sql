-- DAYSPACE Database Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notepad table (single row for the scratchpad)
CREATE TABLE IF NOT EXISTS notepads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  pages JSONB NOT NULL DEFAULT '["Start writing..."]'::jsonb,
  current_page INT NOT NULL DEFAULT 0,
  color TEXT NOT NULL DEFAULT '#3d5a80',
  height INT NOT NULL DEFAULT 160,
  width INT NOT NULL DEFAULT 26,
  on_shelf BOOLEAN NOT NULL DEFAULT true,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Disable RLS for single-user mode (no auth needed)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notepads ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anon key (single-user app)
CREATE POLICY "Allow all for anon" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON notepads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON books FOR ALL USING (true) WITH CHECK (true);

-- Seed a default notepad row
INSERT INTO notepads (content) VALUES ('') ON CONFLICT DO NOTHING;
