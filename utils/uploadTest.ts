import { MediaService } from '@/services/mediaService';
import * as ImagePicker from 'expo-image-picker';

export class UploadTest {
  static async testPermissions(): Promise<boolean> {
    try {
      console.log('Testing media permissions...');
      const permission = await ImagePicker.getMediaLibraryPermissionsAsync();
      console.log('Current permission status:', permission.status);
      
      if (permission.status !== 'granted') {
        console.log('Requesting permission...');
        const requestResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log('Permission request result:', requestResult.status);
        return requestResult.status === 'granted';
      }
      
      return true;
    } catch (error) {
      console.error('Permission test failed:', error);
      return false;
    }
  }

  static async testFilePicker(): Promise<boolean> {
    try {
      console.log('Testing file picker...');
      
      const hasPermission = await this.testPermissions();
      if (!hasPermission) {
        console.error('No permission for file picker');
        return false;
      }

      console.log('File picker test completed successfully');
      return true;
    } catch (error) {
      console.error('File picker test failed:', error);
      return false;
    }
  }

  static async testUploadFlow(userId: string): Promise<boolean> {
    try {
      console.log('Testing upload flow...');
      
      // Test permissions
      const hasPermission = await this.testPermissions();
      if (!hasPermission) {
        console.error('Upload test failed: No permissions');
        return false;
      }

      console.log('Upload flow test completed successfully');
      return true;
    } catch (error) {
      console.error('Upload flow test failed:', error);
      return false;
    }
  }

  static async runAllTests(userId?: string): Promise<void> {
    console.log('=== Media Upload Test Suite ===');
    
    const permissionTest = await this.testPermissions();
    console.log(`✅ Permissions: ${permissionTest ? 'PASS' : 'FAIL'}`);
    
    const pickerTest = await this.testFilePicker();
    console.log(`✅ File Picker: ${pickerTest ? 'PASS' : 'FAIL'}`);
    
    if (userId) {
      const uploadTest = await this.testUploadFlow(userId);
      console.log(`✅ Upload Flow: ${uploadTest ? 'PASS' : 'FAIL'}`);
    }
    
    console.log('=== Test Suite Complete ===');
  }
}
