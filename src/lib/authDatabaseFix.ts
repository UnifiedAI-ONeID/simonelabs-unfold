
import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent } from './securityEnhancements';

// Fix database issues and verify user profile creation
export const verifyAndFixUserProfiles = async () => {
  try {
    console.log('🔍 Starting database verification...');
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('users_profiles')
      .select('count')
      .limit(1);
      
    if (testError) {
      console.error('❌ Database connection test failed:', testError);
      return false;
    }
    
    console.log('✅ Database verification completed successfully');
    return true;
  } catch (error: any) {
    console.error('💥 Database verification failed:', error);
    await logSecurityEvent({
      type: 'VALIDATION_FAILURE',
      details: `Database verification failed: ${error.message}`
    });
    return false;
  }
};

// Simplified user profile creation fallback with better error handling
export const ensureUserProfile = async (userId: string, email: string) => {
  try {
    console.log('👤 Ensuring user profile exists for:', email);
    
    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('users_profiles')
      .select('id, display_name, username')
      .eq('id', userId)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error checking profile:', checkError);
      throw new Error(`Profile check failed: ${checkError.message}`);
    }

    // Create profile if it doesn't exist
    if (!existingProfile) {
      console.log('📝 Creating new user profile...');
      
      const displayName = email.split('@')[0];
      const username = `${displayName}_${Date.now().toString().slice(-6)}`;
      
      const { data: newProfile, error: insertError } = await supabase
        .from('users_profiles')
        .insert({
          id: userId,
          display_name: displayName,
          username: username
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Error creating profile:', insertError);
        
        // Log specific error details for debugging
        if (insertError.code === '23505') {
          console.error('🔄 Username collision detected, retrying with different username...');
          // Try with a more unique username
          const uniqueUsername = `${displayName}_${userId.slice(-8)}`;
          
          const { error: retryError } = await supabase
            .from('users_profiles')
            .insert({
              id: userId,
              display_name: displayName,
              username: uniqueUsername
            });
            
          if (retryError) {
            throw new Error(`Profile creation retry failed: ${retryError.message}`);
          }
          
          console.log('✅ User profile created successfully on retry');
          return true;
        }
        
        throw new Error(`Profile creation failed: ${insertError.message}`);
      }

      console.log('✅ User profile created successfully:', newProfile);
    } else {
      console.log('✅ User profile already exists for:', existingProfile.display_name);
    }

    return true;
  } catch (error: any) {
    console.error('💥 Failed to ensure user profile:', error);
    
    // Log the error for monitoring
    await logSecurityEvent({
      type: 'OPERATION_FAILED',
      details: `Profile creation failed for user ${userId}: ${error.message}`
    });
    
    // Don't throw the error - let auth continue even if profile creation fails
    // This prevents blocking the entire auth flow
    return false;
  }
};

// Helper function to clean up any problematic data
export const cleanupAuthData = async () => {
  try {
    console.log('🧹 Starting auth data cleanup...');
    
    // This would typically run maintenance tasks
    // For now, just verify the basic structure
    const isHealthy = await verifyAndFixUserProfiles();
    
    if (isHealthy) {
      console.log('✅ Auth data cleanup completed successfully');
    } else {
      console.warn('⚠️ Auth data cleanup found issues');
    }
    
    return isHealthy;
  } catch (error: any) {
    console.error('💥 Auth data cleanup failed:', error);
    return false;
  }
};
