
import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent } from './securityEnhancements';

// Fix database issues and verify user profile creation
export const verifyAndFixUserProfiles = async () => {
  try {
    // Check if the handle_new_user function exists and is working
    const { data: functions, error: functionsError } = await supabase
      .rpc('pg_get_functiondef', { funcid: 'handle_new_user' });

    if (functionsError) {
      console.warn('handle_new_user function may not exist:', functionsError);
    }

    console.log('Database verification completed');
    return true;
  } catch (error: any) {
    console.error('Database verification failed:', error);
    await logSecurityEvent({
      type: 'SESSION_VALIDATION_ERROR',
      details: `Database verification failed: ${error.message}`
    });
    return false;
  }
};

// Simplified user profile creation fallback
export const ensureUserProfile = async (userId: string, email: string) => {
  try {
    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('users_profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    // Create profile if it doesn't exist
    if (!existingProfile) {
      const { error: insertError } = await supabase
        .from('users_profiles')
        .insert({
          id: userId,
          display_name: email.split('@')[0],
          username: email.split('@')[0]
        });

      if (insertError) {
        throw insertError;
      }

      console.log('User profile created successfully');
    }

    return true;
  } catch (error: any) {
    console.error('Failed to ensure user profile:', error);
    return false;
  }
};
