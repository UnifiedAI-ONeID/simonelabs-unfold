
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'superuser' | 'admin' | 'moderator' | 'user';

export const useUserRoles = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user) {
        setRoles([]);
        setIsSuperuser(false);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching user roles:', error);
          setRoles([]);
        } else {
          const userRoles = data?.map(item => item.role as UserRole) || [];
          setRoles(userRoles);
          setIsSuperuser(userRoles.includes('superuser'));
          setIsAdmin(userRoles.includes('admin') || userRoles.includes('superuser'));
        }
      } catch (error) {
        console.error('Error fetching user roles:', error);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoles();
  }, [user]);

  return {
    roles,
    loading,
    isSuperuser,
    isAdmin,
    hasRole: (role: UserRole) => roles.includes(role)
  };
};
