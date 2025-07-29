import { supabase } from '@/lib/supabase';
import { ScapeEditorState, ScapeEditorWidget } from '@/types/scape-editor';

export interface FeedScape {
  id: string;
  title: string;
  description: string;
  tagline: string;
  cover_image_path: string | null;
  creator_id: string;
  creator_username: string;
  creator_name: string;
  creator_avatar: string;
  like_count: number;
  save_count: number;
  comment_count: number;
  view_count: number;
  has_shop: boolean;
  is_gen_id: boolean;
  created_at: string;
}

export interface DetailedScape {
  id: string;
  title: string;
  description: string;
  tagline: string;
  banner_image_id: string | null;
  banner_static: boolean;
  feature_widget_id: string | null;
  is_published: boolean;
  creator: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
  };
  stats: {
    likes: number;
    saves: number;
    comments: number;
    views: number;
  };
  widgets: ScapeEditorWidget[];
  created_at: string;
  updated_at: string;
}

export interface UserInteractions {
  isLiked: boolean;
  isSaved: boolean;
  isFollowing: boolean;
}

// Fetch scapes for the home feed
export async function fetchFeed(
  segment: 'explore' | 'followed' | 'shop' | 'genId' = 'explore',
  query: string = '',
  userId?: string
): Promise<FeedScape[]> {
  let request = supabase
    .from('scapes_feed_view')
    .select('*');
    // Note: Only filtering by is_published since scapes_feed_view may not include visibility column
    // .eq('is_published', true) - Assuming the view already filters for published scapes

  // Apply segment filters
  switch (segment) {
    case 'followed':
      if (userId) {
        // Get scapes from users that the current user follows
        const { data: followedUsers } = await supabase
          .from('user_follows')
          .select('following_id')
          .eq('follower_id', userId);
        
        if (followedUsers && followedUsers.length > 0) {
          const followedIds = followedUsers.map(f => f.following_id);
          request = request.in('creator_id', followedIds);
        } else {
          // No followed users, return empty array
          return [];
        }
      }
      break;
    case 'shop':
      request = request.eq('has_shop', true);
      break;
    case 'genId':
      request = request.eq('is_gen_id', true);
      break;
    default: // explore
      break;
  }

  // Apply search filter
  if (query.trim()) {
    const searchQuery = `%${query.trim()}%`;
    request = request.or(
      `title.ilike.${searchQuery},description.ilike.${searchQuery},creator_username.ilike.${searchQuery}`
    );
  }

  const { data, error } = await request
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching feed:', error);
    throw error;
  }

  return data || [];
}

// Get a single scape by ID with full details
export async function getScapeById(id: string, userId?: string): Promise<DetailedScape | null> {
  const { data: scape, error: scapeError } = await supabase
    .from('scapes')
    .select(`
      *,
      creator:profiles(id, username, full_name, avatar_url),
      widgets(*)
    `)
    .eq('id', id)
    .single();

  if (scapeError) {
    console.error('Error fetching scape:', scapeError);
    throw scapeError;
  }

  if (!scape) return null;

  // Transform to match our interface
  const detailedScape: DetailedScape = {
    id: scape.id,
    title: scape.name,
    description: scape.description || '',
    tagline: scape.tagline || '',
    banner_image_id: scape.banner_image_id,
    banner_static: scape.banner_static || false,
    feature_widget_id: scape.feature_widget_id,
    is_published: scape.is_published,
    creator: {
      id: scape.creator.id,
      username: scape.creator.username || '',
      full_name: scape.creator.full_name || '',
      avatar_url: scape.creator.avatar_url || '',
    },
    stats: {
      likes: scape.like_count || 0,
      saves: scape.save_count || 0,
      comments: scape.comment_count || 0,
      views: scape.view_count || 0,
    },
    widgets: scape.widgets.map((w: any) => ({
      id: w.id,
      type: w.type,
      variant: w.variant || 'default',
      channel: w.channel || null,
      data: w.content || {},
      position: w.position,
    })),
    created_at: scape.created_at,
    updated_at: scape.updated_at,
  };

  return detailedScape;
}

// Get user interactions for a scape
export async function getUserInteractions(scapeId: string, userId: string): Promise<UserInteractions> {
  const [likeResult, saveResult, followResult] = await Promise.all([
    supabase
      .from('scape_likes')
      .select('id')
      .eq('scape_id', scapeId)
      .eq('user_id', userId)
      .single(),
    supabase
      .from('scape_saves')
      .select('id')
      .eq('scape_id', scapeId)
      .eq('user_id', userId)
      .single(),
    // Get the creator of the scape first, then check if following
    supabase
      .from('scapes')
      .select('user_id')
      .eq('id', scapeId)
      .single()
      .then(async ({ data: scapeData }) => {
        if (!scapeData) return { data: null, error: null };
        return supabase
          .from('user_follows')
          .select('id')
          .eq('follower_id', userId)
          .eq('following_id', scapeData.user_id)
          .single();
      })
  ]);

  return {
    isLiked: !likeResult.error && !!likeResult.data,
    isSaved: !saveResult.error && !!saveResult.data,
    isFollowing: !followResult.error && !!followResult.data,
  };
}

// Save or update a scape
export async function saveScape(scapeState: ScapeEditorState, userId: string, preservePublishedState: boolean = false): Promise<string> {
  const isNew = scapeState.id === 'new';

  try {
    // Prepare scape data (excluding columns that may not exist in the database yet)
    const scapeData: any = {
      user_id: userId,
      name: scapeState.title,
      description: scapeState.description || null,
      banner_image_id: scapeState.banner,
      banner_static: scapeState.bannerStatic,
      feature_widget_id: scapeState.featureWidgetId, // Use the actual feature widget ID
      layout: 'default', // TODO: Add layout selection
      updated_at: new Date().toISOString(),
    };

    // Only set is_published if not preserving state
    if (!preservePublishedState) {
      scapeData.is_published = !scapeState.isDraft;
    }

    // Add optional columns if they exist in the database
    if (scapeState.tagline) {
      scapeData.tagline = scapeState.tagline;
    }
    if (scapeState.visibility) {
      scapeData.visibility = scapeState.visibility;
    }

    let scapeId: string;

    if (isNew) {
      // Create new scape
      const { data: newScape, error: scapeError } = await supabase
        .from('scapes')
        .insert(scapeData)
        .select('id')
        .single();

      if (scapeError) throw scapeError;
      scapeId = newScape.id;
    } else {
      // Update existing scape
      const { error: scapeError } = await supabase
        .from('scapes')
        .update(scapeData)
        .eq('id', scapeState.id);

      if (scapeError) throw scapeError;
      scapeId = scapeState.id;
    }

    // Handle widgets
    if (scapeState.widgets.length > 0) {
      // Delete existing widgets if updating
      if (!isNew) {
        await supabase
          .from('widgets')
          .delete()
          .eq('scape_id', scapeId);
      }

      // Insert new widgets with their original IDs preserved
      const widgetData = scapeState.widgets.map((widget, index) => ({
        id: widget.id, // Preserve the widget ID from the editor
        scape_id: scapeId,
        type: widget.type,
        variant: widget.variant,
        channel: widget.channel,
        position: index,
        size_width: 1, // TODO: Add size configuration
        size_height: 1,
        content: widget.data,
      }));

      const { error: widgetsError } = await supabase
        .from('widgets')
        .insert(widgetData);

      if (widgetsError) throw widgetsError;
    }

    return scapeId;
  } catch (error) {
    console.error('Error saving scape:', error);
    throw error;
  }
}

// Publish a scape with permissions (simplified - just use saveScape with isDraft: false)
export async function publishScape(scapeId: string, options: {
  visibility?: 'public' | 'private';
  permissions?: any;
} = {}): Promise<void> {
  try {
    const updateData: any = {
      is_published: true,
      updated_at: new Date().toISOString(),
    };

    // Only add optional columns if they might exist
    if (options.visibility) {
      updateData.visibility = options.visibility;
    }
    if (options.permissions) {
      Object.assign(updateData, options.permissions);
    }

    const { error } = await supabase
      .from('scapes')
      .update(updateData)
      .eq('id', scapeId);

    if (error) throw error;
  } catch (error) {
    console.error('Error publishing scape:', error);
    throw error;
  }
}


// Delete a scape
export async function deleteScape(scapeId: string, userId: string): Promise<void> {
  // Verify ownership
  const { data: scape, error: verifyError } = await supabase
    .from('scapes')
    .select('user_id')
    .eq('id', scapeId)
    .single();

  if (verifyError) throw verifyError;
  if (scape.user_id !== userId) {
    throw new Error('Unauthorized: You can only delete your own scapes');
  }

  // Delete scape (widgets will be deleted via cascade)
  const { error } = await supabase
    .from('scapes')
    .delete()
    .eq('id', scapeId);

  if (error) throw error;
}

// Get user's scapes (including drafts)
export async function getUserScapes(userId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('scapes')
    .select(`
      id,
      name as title,
      description,
      banner_image_id,
      is_published,
      view_count,
      like_count,
      created_at,
      updated_at
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user scapes:', error);
    throw error;
  }

  return data || [];
}
