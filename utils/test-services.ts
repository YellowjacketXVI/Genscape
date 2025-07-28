import { fetchFeed } from '@/services/scapeService';
import { toggleLike, toggleSave, toggleFollow } from '@/services/feedService';

// Simple test function to verify our services work
export async function testServices(userId: string) {
  try {
    console.log('Testing feed service...');
    
    // Test fetching feed
    const feedData = await fetchFeed('explore', '', userId);
    console.log('Feed data:', feedData.length, 'scapes found');
    
    if (feedData.length > 0) {
      const firstScape = feedData[0];
      console.log('First scape:', firstScape.title);
      
      // Test like toggle (if user is provided)
      if (userId) {
        console.log('Testing like toggle...');
        const likeResult = await toggleLike(firstScape.id, userId);
        console.log('Like result:', likeResult);
        
        // Toggle back
        const unlikeResult = await toggleLike(firstScape.id, userId);
        console.log('Unlike result:', unlikeResult);
      }
    }
    
    console.log('All tests passed!');
    return true;
  } catch (error) {
    console.error('Test failed:', error);
    return false;
  }
}
