# Supabase Configuration for Content Manager

## Overview
This document outlines the Supabase configuration for the Genscape.art content manager, ensuring proper user profile uploaded content handling with appropriate read and edit abilities.

## ✅ Database Configuration

### Media Items Table
The `media_items` table is properly configured with the following structure:

```sql
CREATE TABLE media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT NOT NULL,
  media_type TEXT NOT NULL,
  thumbnail_path TEXT,
  width INTEGER,
  height INTEGER,
  duration REAL,
  tags TEXT[],
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Indexes
Optimized indexes are in place for performance:
- `idx_media_items_user_id` - For user-specific queries
- `idx_media_items_created_at` - For chronological ordering
- `idx_media_items_media_type` - For filtering by media type
- `idx_media_items_public` - For public media queries

## ✅ Row Level Security (RLS)

RLS is **enabled** on the `media_items` table with the following policies:

### SELECT Policies
1. **Users can view their own media**
   ```sql
   CREATE POLICY "Users can view their own media" ON media_items
   FOR SELECT USING (auth.uid() = user_id);
   ```

2. **Users can view public media**
   ```sql
   CREATE POLICY "Users can view public media" ON media_items
   FOR SELECT USING (is_public = true);
   ```

### INSERT Policy
```sql
CREATE POLICY "Users can insert their own media" ON media_items
FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### UPDATE Policy
```sql
CREATE POLICY "Users can update their own media" ON media_items
FOR UPDATE USING (auth.uid() = user_id);
```

### DELETE Policy
```sql
CREATE POLICY "Users can delete their own media" ON media_items
FOR DELETE USING (auth.uid() = user_id);
```

## ✅ Storage Configuration

### Media Bucket
- **Name**: `media`
- **Public**: `false` (private bucket for security)
- **File Size Limit**: 50MB (52,428,800 bytes)
- **Allowed MIME Types**:
  - `image/jpeg`
  - `image/png`
  - `image/gif`
  - `image/webp`
  - `video/mp4`
  - `video/webm`
  - `audio/mpeg`
  - `audio/wav`
  - `audio/ogg`

### Storage Policies
Storage policies are configured to match the database RLS policies:

1. **Users can upload their own media**
   ```sql
   CREATE POLICY "Users can upload their own media" ON storage.objects
   FOR INSERT WITH CHECK (
     bucket_id = 'media' AND 
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

2. **Users can view their own media**
   ```sql
   CREATE POLICY "Users can view their own media" ON storage.objects
   FOR SELECT USING (
     bucket_id = 'media' AND 
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

3. **Users can view public media**
   ```sql
   CREATE POLICY "Users can view public media" ON storage.objects
   FOR SELECT USING (
     bucket_id = 'media' AND 
     EXISTS (
       SELECT 1 FROM media_items 
       WHERE media_items.file_path = media_items.name 
       AND media_items.is_public = true
     )
   );
   ```

4. **Users can update their own media**
   ```sql
   CREATE POLICY "Users can update their own media" ON storage.objects
   FOR UPDATE USING (
     bucket_id = 'media' AND 
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

5. **Users can delete their own media**
   ```sql
   CREATE POLICY "Users can delete their own media" ON storage.objects
   FOR DELETE USING (
     bucket_id = 'media' AND 
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

## ✅ Authentication Configuration

- **Email Authentication**: Enabled
- **Signup**: Enabled
- **JWT Expiry**: 1 hour (3600 seconds)
- **Site URL**: Configured for development

## 🔧 Implementation Details

### File Path Structure
Files are stored using the pattern: `{user_id}/{filename}`
- Example: `123e4567-e89b-12d3-a456-426614174000/1640995200000-abc123.jpg`

### URL Generation
- **Private Bucket**: Uses signed URLs with 1-hour expiry
- **Fallback**: Public URLs for compatibility
- **Refresh**: URLs can be refreshed when they expire

### Upload Flow
1. User selects files via ImagePicker
2. Files are uploaded to `media` bucket under user's folder
3. Database record is created in `media_items` table
4. Signed URLs are generated for access
5. Error handling includes cleanup of orphaned files

## 🧪 Testing

### Test Suite
A comprehensive test suite is available at `utils/supabase-test.ts` that verifies:
- Database connectivity
- Authentication status
- Media table access
- Storage bucket access
- RLS policy enforcement
- Complete upload flow

### Test Component
Use `components/debug/SupabaseTestPanel.tsx` to run tests from within the app.

## 🔒 Security Features

1. **Row Level Security**: Ensures users can only access their own content
2. **Private Storage**: Files are not publicly accessible without authentication
3. **Signed URLs**: Temporary access with expiration
4. **MIME Type Validation**: Only allowed file types can be uploaded
5. **File Size Limits**: Prevents abuse with 50MB limit
6. **User Isolation**: File paths include user ID for separation

## 📊 Performance Optimizations

1. **Database Indexes**: Optimized for common query patterns
2. **Efficient Queries**: Uses specific filters and limits
3. **Batch Operations**: Multiple files can be uploaded efficiently
4. **URL Caching**: Signed URLs are cached to reduce API calls

## ✅ Status Summary

**All systems are properly configured and ready for production use:**

- ✅ Database schema and indexes
- ✅ Row Level Security policies
- ✅ Storage bucket and policies
- ✅ Authentication configuration
- ✅ File upload and management
- ✅ Security and access controls
- ✅ Performance optimizations
- ✅ Error handling and cleanup
- ✅ Testing infrastructure

The content manager is fully configured to handle user profile uploaded content with appropriate read and edit abilities while maintaining security and performance standards.
