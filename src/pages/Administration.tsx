
import { useState, useEffect } from 'react';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Shield, 
  Users, 
  Database, 
  Settings, 
  UserCheck,
  Trash2,
  Plus,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database as DatabaseType } from '@/integrations/supabase/types';

type UserRole = DatabaseType['public']['Enums']['app_role'];

interface User {
  id: string;
  email: string;
  created_at: string;
  roles: UserRole[];
}

const Administration = () => {
  const { user, loading: authLoading } = useAuth();
  const { isSuperuser, loading: rolesLoading } = useUserRoles();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('user');

  useEffect(() => {
    if (isSuperuser) {
      fetchUsers();
    }
  }, [isSuperuser]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      
      // Get all users from auth.users (note: this requires service role in production)
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
        // Fallback: get users from user_roles table
        const { data: roleUsers, error: roleError } = await supabase
          .from('user_roles')
          .select('user_id, role');
        
        if (roleError) {
          throw roleError;
        }
        
        // Group roles by user_id
        const userRolesMap = new Map<string, UserRole[]>();
        roleUsers?.forEach(roleUser => {
          const existing = userRolesMap.get(roleUser.user_id) || [];
          userRolesMap.set(roleUser.user_id, [...existing, roleUser.role]);
        });
        
        const userList: User[] = Array.from(userRolesMap.entries()).map(([userId, roles]) => ({
          id: userId,
          email: 'Unknown Email',
          created_at: new Date().toISOString(),
          roles
        }));
        
        setUsers(userList);
        return;
      }

      // Get user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        throw rolesError;
      }

      // Group roles by user_id
      const userRolesMap = new Map<string, UserRole[]>();
      userRoles?.forEach(roleUser => {
        const existing = userRolesMap.get(roleUser.user_id) || [];
        userRolesMap.set(roleUser.user_id, [...existing, roleUser.role]);
      });

      // Combine auth users with their roles
      const userList: User[] = authUsers.users.map(authUser => ({
        id: authUser.id,
        email: authUser.email || 'No Email',
        created_at: authUser.created_at,
        roles: userRolesMap.get(authUser.id) || ['user']
      }));

      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users. You may need service role permissions.",
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const assignRole = async (userId: string, role: UserRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: role
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Role ${role} assigned successfully.`,
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign role.",
        variant: "destructive",
      });
    }
  };

  const removeRole = async (userId: string, role: UserRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Role ${role} removed successfully.`,
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove role.",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'superuser': return 'destructive';
      case 'admin': return 'default';
      case 'moderator': return 'secondary';
      default: return 'outline';
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  if (authLoading || rolesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isSuperuser) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground">
              You need superuser privileges to access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Administration</h1>
              <p className="text-muted-foreground">
                System administration and user management
              </p>
            </div>
          </div>

          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="system">System Settings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                  <CardDescription>
                    Manage user accounts and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor="search">Search Users</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder="Search by email..."
                          value={searchEmail}
                          onChange={(e) => setSearchEmail(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button onClick={fetchUsers} variant="outline">
                      Refresh
                    </Button>
                  </div>

                  {loadingUsers ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-muted-foreground">Loading users...</p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Roles</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((userItem) => (
                            <TableRow key={userItem.id}>
                              <TableCell className="font-medium">
                                {userItem.email}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {userItem.roles.map((role) => (
                                    <Badge
                                      key={role}
                                      variant={getRoleBadgeVariant(role)}
                                      className="text-xs"
                                    >
                                      {role}
                                      <button
                                        onClick={() => removeRole(userItem.id, role)}
                                        className="ml-1 hover:text-destructive"
                                      >
                                        ×
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                {new Date(userItem.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Select
                                    onValueChange={(role: UserRole) => assignRole(userItem.id, role)}
                                  >
                                    <SelectTrigger className="w-32">
                                      <SelectValue placeholder="Add role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="user">User</SelectItem>
                                      <SelectItem value="moderator">Moderator</SelectItem>
                                      <SelectItem value="admin">Admin</SelectItem>
                                      <SelectItem value="superuser">Superuser</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Settings
                  </CardTitle>
                  <CardDescription>
                    Configure system-wide settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    System settings panel - Coming soon
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Analytics Dashboard
                  </CardTitle>
                  <CardDescription>
                    System usage and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium">Total Users</h3>
                      <p className="text-2xl font-bold text-primary">{users.length}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium">Superusers</h3>
                      <p className="text-2xl font-bold text-red-500">
                        {users.filter(u => u.roles.includes('superuser')).length}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium">Admins</h3>
                      <p className="text-2xl font-bold text-blue-500">
                        {users.filter(u => u.roles.includes('admin')).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Administration;
