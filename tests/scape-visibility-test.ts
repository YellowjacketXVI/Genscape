/**
 * Test script to verify scape visibility and dead-end fixes
 * Run this after applying the database migration
 */

import { supabase } from '@/lib/supabase';
import { saveScape, publishScape, fetchFeed, getUserScapes } from '@/services/scapeService';
import { ScapeEditorState } from '@/types/scape-editor';

// Mock user ID for testing
const TEST_USER_ID = 'test-user-123';

// Test data
const createTestScape = (title: string, isDraft: boolean = true): ScapeEditorState => ({
  id: 'new',
  title,
  description: `Test description for ${title}`,
  banner: null,
  bannerStatic: false,
  widgets: [
    {
      id: 'widget-1',
      type: 'text',
      variant: 'default',
      channel: null,
      data: { content: 'Test content' },
      position: 0,
    },
    {
      id: 'widget-2', 
      type: 'image',
      variant: 'default',
      channel: null,
      data: { mediaIds: ['test-image-1'] },
      position: 1,
    }
  ],
  featureWidgetId: 'widget-2', // Feature the image widget
  tagline: 'Test tagline for featured content',
  isDraft,
  visibility: 'public',
});

async function runTests() {
  console.log('🧪 Starting Scape Visibility Tests...\n');

  try {
    // Test 1: Save a draft scape
    console.log('📝 Test 1: Saving draft scape...');
    const draftScape = createTestScape('Test Draft Scape', true);
    const draftId = await saveScape(draftScape, TEST_USER_ID);
    console.log(`✅ Draft saved with ID: ${draftId}`);

    // Verify draft is not in public feed
    const feedBeforePublish = await fetchFeed('explore');
    const draftInFeed = feedBeforePublish.find(s => s.id === draftId);
    console.log(`✅ Draft not in public feed: ${!draftInFeed ? 'PASS' : 'FAIL'}`);

    // Test 2: Publish the scape
    console.log('\n📢 Test 2: Publishing scape...');
    const publishedScape = { ...draftScape, id: draftId, isDraft: false };
    await saveScape(publishedScape, TEST_USER_ID);
    console.log('✅ Scape published successfully');

    // Verify published scape appears in feed
    const feedAfterPublish = await fetchFeed('explore');
    const publishedInFeed = feedAfterPublish.find(s => s.id === draftId);
    console.log(`✅ Published scape in feed: ${publishedInFeed ? 'PASS' : 'FAIL'}`);

    // Test 3: Verify feature widget ID is preserved
    console.log('\n🎯 Test 3: Checking feature widget preservation...');
    const { data: scapeData } = await supabase
      .from('scapes')
      .select('feature_widget_id')
      .eq('id', draftId)
      .single();
    
    console.log(`✅ Feature widget ID preserved: ${scapeData?.feature_widget_id === 'widget-2' ? 'PASS' : 'FAIL'}`);

    // Test 4: Verify widgets have correct IDs
    console.log('\n🔧 Test 4: Checking widget ID preservation...');
    const { data: widgets } = await supabase
      .from('widgets')
      .select('id, type')
      .eq('scape_id', draftId)
      .order('position');

    const hasCorrectIds = widgets?.some(w => w.id === 'widget-1') && 
                         widgets?.some(w => w.id === 'widget-2');
    console.log(`✅ Widget IDs preserved: ${hasCorrectIds ? 'PASS' : 'FAIL'}`);

    // Test 5: Test getUserScapes includes drafts
    console.log('\n👤 Test 5: Checking user scapes includes drafts...');
    const userScapes = await getUserScapes(TEST_USER_ID);
    const hasDrafts = userScapes.some(s => !s.is_published);
    console.log(`✅ User scapes includes drafts: ${hasDrafts ? 'PASS' : 'FAIL'}`);

    // Test 6: Create and test private scape
    console.log('\n🔒 Test 6: Testing private scape visibility...');
    const privateScape = createTestScape('Private Test Scape', false);
    privateScape.visibility = 'private';
    const privateId = await saveScape(privateScape, TEST_USER_ID);
    
    // Verify private scape not in public feed
    const feedWithPrivate = await fetchFeed('explore');
    const privateInFeed = feedWithPrivate.find(s => s.id === privateId);
    console.log(`✅ Private scape not in public feed: ${!privateInFeed ? 'PASS' : 'FAIL'}`);

    // Test 7: Test updating published scape preserves state
    console.log('\n🔄 Test 7: Testing published scape updates...');
    const updatedScape = { ...publishedScape, title: 'Updated Published Scape' };
    await saveScape(updatedScape, TEST_USER_ID, true); // preservePublishedState = true
    
    const { data: updatedData } = await supabase
      .from('scapes')
      .select('name, is_published')
      .eq('id', draftId)
      .single();
    
    const statePreserved = updatedData?.is_published === true && 
                          updatedData?.name === 'Updated Published Scape';
    console.log(`✅ Published state preserved on update: ${statePreserved ? 'PASS' : 'FAIL'}`);

    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await supabase.from('widgets').delete().in('scape_id', [draftId, privateId]);
    await supabase.from('scapes').delete().in('id', [draftId, privateId]);
    console.log('✅ Cleanup completed');

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Export for use in test runner
export { runTests };

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}
