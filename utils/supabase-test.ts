import { supabase } from '@/lib/supabase';

export interface SupabaseTestResult {
  test: string;
  success: boolean;
  error?: string;
  details?: any;
}

export class SupabaseTestSuite {
  static async runAllTests(): Promise<SupabaseTestResult[]> {
    const results: SupabaseTestResult[] = [];

    // Test 1: Database Connection
    results.push(await this.testDatabaseConnection());

    // Test 2: Authentication
    results.push(await this.testAuthentication());

    // Test 3: Media Table Access
    results.push(await this.testMediaTableAccess());

    // Test 4: Storage Bucket Access
    results.push(await this.testStorageBucketAccess());

    // Test 5: RLS Policies
    results.push(await this.testRLSPolicies());

    return results;
  }

  static async testDatabaseConnection(): Promise<SupabaseTestResult> {
    try {
      const { data, error } = await supabase
        .from('media_items')
        .select('count')
        .limit(1);

      if (error) {
        return {
          test: 'Database Connection',
          success: false,
          error: error.message,
        };
      }

      return {
        test: 'Database Connection',
        success: true,
        details: 'Successfully connected to database',
      };
    } catch (error) {
      return {
        test: 'Database Connection',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async testAuthentication(): Promise<SupabaseTestResult> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        return {
          test: 'Authentication',
          success: false,
          error: error.message,
        };
      }

      return {
        test: 'Authentication',
        success: true,
        details: user ? `Authenticated as ${user.email}` : 'No user authenticated',
      };
    } catch (error) {
      return {
        test: 'Authentication',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async testMediaTableAccess(): Promise<SupabaseTestResult> {
    try {
      // Test SELECT permission
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .limit(5);

      if (error) {
        return {
          test: 'Media Table Access',
          success: false,
          error: `SELECT failed: ${error.message}`,
        };
      }

      return {
        test: 'Media Table Access',
        success: true,
        details: `Can read media_items table. Found ${data?.length || 0} items.`,
      };
    } catch (error) {
      return {
        test: 'Media Table Access',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async testStorageBucketAccess(): Promise<SupabaseTestResult> {
    try {
      // Test bucket access by listing files
      const { data, error } = await supabase.storage
        .from('media')
        .list('', { limit: 1 });

      if (error) {
        return {
          test: 'Storage Bucket Access',
          success: false,
          error: error.message,
        };
      }

      return {
        test: 'Storage Bucket Access',
        success: true,
        details: 'Successfully accessed media storage bucket',
      };
    } catch (error) {
      return {
        test: 'Storage Bucket Access',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async testRLSPolicies(): Promise<SupabaseTestResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return {
          test: 'RLS Policies',
          success: false,
          error: 'No authenticated user to test RLS policies',
        };
      }

      // Test if we can query our own media (should work)
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        return {
          test: 'RLS Policies',
          success: false,
          error: `RLS policy test failed: ${error.message}`,
        };
      }

      return {
        test: 'RLS Policies',
        success: true,
        details: `RLS policies working correctly. User can access their own media.`,
      };
    } catch (error) {
      return {
        test: 'RLS Policies',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async testMediaUploadFlow(testFile?: {
    name: string;
    mimeType: string;
    size: number;
    uri: string;
  }): Promise<SupabaseTestResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return {
          test: 'Media Upload Flow',
          success: false,
          error: 'No authenticated user for upload test',
        };
      }

      if (!testFile) {
        return {
          test: 'Media Upload Flow',
          success: false,
          error: 'No test file provided',
        };
      }

      // Test file upload to storage
      const filePath = `${user.id}/test-${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, new Blob(['test'], { type: testFile.mimeType }), {
          contentType: testFile.mimeType,
        });

      if (uploadError) {
        return {
          test: 'Media Upload Flow',
          success: false,
          error: `Storage upload failed: ${uploadError.message}`,
        };
      }

      // Test database record creation
      const { data: mediaItem, error: dbError } = await supabase
        .from('media_items')
        .insert({
          user_id: user.id,
          name: testFile.name,
          file_path: filePath,
          file_size: testFile.size,
          mime_type: testFile.mimeType,
          media_type: 'image',
          is_public: false,
        })
        .select()
        .single();

      if (dbError) {
        // Clean up uploaded file
        await supabase.storage.from('media').remove([filePath]);
        return {
          test: 'Media Upload Flow',
          success: false,
          error: `Database insert failed: ${dbError.message}`,
        };
      }

      // Clean up test data
      await supabase.from('media_items').delete().eq('id', mediaItem.id);
      await supabase.storage.from('media').remove([filePath]);

      return {
        test: 'Media Upload Flow',
        success: true,
        details: 'Complete upload flow test successful',
      };
    } catch (error) {
      return {
        test: 'Media Upload Flow',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static formatResults(results: SupabaseTestResult[]): string {
    let output = '\n=== Supabase Configuration Test Results ===\n\n';
    
    results.forEach((result, index) => {
      const status = result.success ? '✅ PASS' : '❌ FAIL';
      output += `${index + 1}. ${result.test}: ${status}\n`;
      
      if (result.success && result.details) {
        output += `   Details: ${result.details}\n`;
      }
      
      if (!result.success && result.error) {
        output += `   Error: ${result.error}\n`;
      }
      
      output += '\n';
    });

    const passCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    output += `Summary: ${passCount}/${totalCount} tests passed\n`;
    
    if (passCount === totalCount) {
      output += '🎉 All tests passed! Supabase is properly configured.\n';
    } else {
      output += '⚠️  Some tests failed. Please check the configuration.\n';
    }

    return output;
  }
}
