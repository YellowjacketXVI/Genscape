-- Simplified migration to add essential missing columns to scapes and widgets tables
-- Run this in your Supabase SQL editor

-- Add essential missing columns to scapes table
ALTER TABLE scapes
ADD COLUMN IF NOT EXISTS tagline TEXT,
ADD COLUMN IF NOT EXISTS feature_widget_id UUID,
ADD COLUMN IF NOT EXISTS banner_static BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS save_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0;

-- Add missing columns to widgets table
ALTER TABLE widgets
ADD COLUMN IF NOT EXISTS variant TEXT,
ADD COLUMN IF NOT EXISTS channel TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_scapes_published ON scapes(is_published);
CREATE INDEX IF NOT EXISTS idx_scapes_visibility ON scapes(visibility);
CREATE INDEX IF NOT EXISTS idx_scapes_user_published ON scapes(user_id, is_published);
CREATE INDEX IF NOT EXISTS idx_scapes_feature_widget ON scapes(feature_widget_id);
CREATE INDEX IF NOT EXISTS idx_widgets_scape_position ON widgets(scape_id, position);

-- Update the scapes_feed_view to include new columns
-- Note: You may need to recreate this view in Supabase to include the new columns
-- This is a template - adjust based on your actual view definition

/*
CREATE OR REPLACE VIEW scapes_feed_view AS
SELECT 
  s.id,
  s.name as title,
  s.description,
  s.tagline,
  s.banner_image_id,
  s.user_id as creator_id,
  p.username as creator_username,
  p.full_name as creator_name,
  p.avatar_url as creator_avatar,
  s.like_count,
  s.save_count,
  s.comment_count,
  s.view_count,
  s.is_published,
  s.visibility,
  s.created_at,
  -- Check if scape has shop widgets
  CASE WHEN EXISTS (
    SELECT 1 FROM widgets w 
    WHERE w.scape_id = s.id AND w.type = 'shop'
  ) THEN true ELSE false END as has_shop,
  -- Check if scape is gen_id (you may need to adjust this logic)
  false as is_gen_id,
  -- Get cover image path from banner or first image widget
  COALESCE(
    mi.file_path,
    (SELECT (w.content->>'mediaIds')::text 
     FROM widgets w 
     WHERE w.scape_id = s.id 
     AND w.type IN ('image', 'gallery') 
     AND w.content->>'mediaIds' IS NOT NULL 
     ORDER BY w.position LIMIT 1)
  ) as cover_image_path
FROM scapes s
LEFT JOIN profiles p ON s.user_id = p.id
LEFT JOIN media_items mi ON s.banner_image_id = mi.id
WHERE s.is_published = true AND s.visibility = 'public';
*/

-- Add RLS policies for new columns if needed
-- These are examples - adjust based on your security requirements

-- Allow users to read their own scapes regardless of visibility
CREATE POLICY IF NOT EXISTS "Users can read own scapes" ON scapes
FOR SELECT USING (auth.uid() = user_id);

-- Allow users to read public published scapes
CREATE POLICY IF NOT EXISTS "Users can read public scapes" ON scapes
FOR SELECT USING (is_published = true AND visibility = 'public');

-- Update existing policies to handle new columns
-- You may need to review and update existing RLS policies

-- Example: Update insert policy to handle new columns
-- DROP POLICY IF EXISTS "Users can insert own scapes" ON scapes;
-- CREATE POLICY "Users can insert own scapes" ON scapes
-- FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Example: Update update policy to handle new columns  
-- DROP POLICY IF EXISTS "Users can update own scapes" ON scapes;
-- CREATE POLICY "Users can update own scapes" ON scapes
-- FOR UPDATE USING (auth.uid() = user_id);
