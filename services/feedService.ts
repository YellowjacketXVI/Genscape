import { supabase } from '@/lib/supabase';

// Toggle like on a scape
export async function toggleLike(scapeId: string, userId: string): Promise<boolean> {
  try {
    // Check if already liked
    const { data: existingLike, error: checkError } = await supabase
      .from('scape_likes')
      .select('id')
      .eq('scape_id', scapeId)
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingLike) {
      // Unlike: remove the like
      const { error: deleteError } = await supabase
        .from('scape_likes')
        .delete()
        .eq('id', existingLike.id);

      if (deleteError) throw deleteError;

      // Decrement like count
      const { error: updateError } = await supabase
        .from('scapes')
        .update({ like_count: supabase.sql`like_count - 1` })
        .eq('id', scapeId);

      if (updateError) throw updateError;

      return false; // Now unliked
    } else {
      // Like: add the like
      const { error: insertError } = await supabase
        .from('scape_likes')
        .insert({ scape_id: scapeId, user_id: userId });

      if (insertError) throw insertError;

      // Increment like count
      const { error: updateError } = await supabase
        .from('scapes')
        .update({ like_count: supabase.sql`like_count + 1` })
        .eq('id', scapeId);

      if (updateError) throw updateError;

      return true; // Now liked
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
}

// Toggle save on a scape
export async function toggleSave(scapeId: string, userId: string): Promise<boolean> {
  try {
    // Check if already saved
    const { data: existingSave, error: checkError } = await supabase
      .from('scape_saves')
      .select('id')
      .eq('scape_id', scapeId)
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingSave) {
      // Unsave: remove the save
      const { error: deleteError } = await supabase
        .from('scape_saves')
        .delete()
        .eq('id', existingSave.id);

      if (deleteError) throw deleteError;

      // Decrement save count
      const { error: updateError } = await supabase
        .from('scapes')
        .update({ save_count: supabase.sql`save_count - 1` })
        .eq('id', scapeId);

      if (updateError) throw updateError;

      return false; // Now unsaved
    } else {
      // Save: add the save
      const { error: insertError } = await supabase
        .from('scape_saves')
        .insert({ scape_id: scapeId, user_id: userId });

      if (insertError) throw insertError;

      // Increment save count
      const { error: updateError } = await supabase
        .from('scapes')
        .update({ save_count: supabase.sql`save_count + 1` })
        .eq('id', scapeId);

      if (updateError) throw updateError;

      return true; // Now saved
    }
  } catch (error) {
    console.error('Error toggling save:', error);
    throw error;
  }
}

// Toggle follow on a user
export async function toggleFollow(targetUserId: string, currentUserId: string): Promise<boolean> {
  try {
    if (targetUserId === currentUserId) {
      throw new Error('Cannot follow yourself');
    }

    // Check if already following
    const { data: existingFollow, error: checkError } = await supabase
      .from('user_follows')
      .select('id')
      .eq('follower_id', currentUserId)
      .eq('following_id', targetUserId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingFollow) {
      // Unfollow: remove the follow
      const { error: deleteError } = await supabase
        .from('user_follows')
        .delete()
        .eq('id', existingFollow.id);

      if (deleteError) throw deleteError;

      return false; // Now unfollowing
    } else {
      // Follow: add the follow
      const { error: insertError } = await supabase
        .from('user_follows')
        .insert({ 
          follower_id: currentUserId, 
          following_id: targetUserId 
        });

      if (insertError) throw insertError;

      return true; // Now following
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
    throw error;
  }
}

// Increment view count for a scape
export async function incrementViewCount(scapeId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('scapes')
      .update({ view_count: supabase.sql`view_count + 1` })
      .eq('id', scapeId);

    if (error) throw error;
  } catch (error) {
    console.error('Error incrementing view count:', error);
    // Don't throw error for view count failures
  }
}

// Get user's saved scapes
export async function getSavedScapes(userId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('scape_saves')
      .select(`
        scape_id,
        created_at,
        scape:scapes_feed_view(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(save => save.scape).filter(Boolean) || [];
  } catch (error) {
    console.error('Error fetching saved scapes:', error);
    throw error;
  }
}

// Get user's liked scapes
export async function getLikedScapes(userId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('scape_likes')
      .select(`
        scape_id,
        created_at,
        scape:scapes_feed_view(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(like => like.scape).filter(Boolean) || [];
  } catch (error) {
    console.error('Error fetching liked scapes:', error);
    throw error;
  }
}

// Get users that the current user follows
export async function getFollowing(userId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('user_follows')
      .select(`
        following_id,
        created_at,
        following:profiles(id, username, full_name, avatar_url)
      `)
      .eq('follower_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(follow => follow.following).filter(Boolean) || [];
  } catch (error) {
    console.error('Error fetching following:', error);
    throw error;
  }
}

// Get users that follow the current user
export async function getFollowers(userId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('user_follows')
      .select(`
        follower_id,
        created_at,
        follower:profiles(id, username, full_name, avatar_url)
      `)
      .eq('following_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(follow => follow.follower).filter(Boolean) || [];
  } catch (error) {
    console.error('Error fetching followers:', error);
    throw error;
  }
}

// Check if a scape name is unique for a user
export async function checkScapeNameUnique(name: string, userId: string, excludeId?: string): Promise<boolean> {
  try {
    let query = supabase
      .from('scapes')
      .select('id')
      .eq('user_id', userId)
      .eq('name', name);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return !data || data.length === 0;
  } catch (error) {
    console.error('Error checking scape name uniqueness:', error);
    throw error;
  }
}
