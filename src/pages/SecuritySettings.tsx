
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Key, 
  Bell, 
  Eye, 
  Smartphone, 
  History, 
  AlertTriangle,
  CheckCircle,
  Settings,
  Clock,
  MapPin,
  Monitor
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logSecurityEvent } from '@/lib/securityEnhancements';

interface SecuritySettings {
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
  deviceTracking: boolean;
  locationBasedSecurity: boolean;
}

interface LoginSession {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  lastActive: Date;
  current: boolean;
}

interface SecurityEvent {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}

const SecuritySettings = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    emailNotifications: true,
    loginAlerts: true,
    sessionTimeout: 30,
    deviceTracking: true,
    locationBasedSecurity: false
  });

  const [activeSessions] = useState<LoginSession[]>([
    {
      id: '1',
      device: 'Chrome on Windows',
      location: 'New York, USA',
      ipAddress: '192.168.1.1',
      lastActive: new Date(),
      current: true
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'New York, USA',
      ipAddress: '192.168.1.2',
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      current: false
    }
  ]);

  const [securityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'Login',
      description: 'Successful login from Chrome on Windows',
      timestamp: new Date(),
      severity: 'low'
    },
    {
      id: '2',
      type: 'Password Change',
      description: 'Password was changed successfully',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      severity: 'medium'
    },
    {
      id: '3',
      type: 'Suspicious Activity',
      description: 'Multiple failed login attempts detected',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      severity: 'high'
    }
  ]);

  const [passwordStrength, setPasswordStrength] = useState('strong');

  useEffect(() => {
    // Load user security settings
    const loadSettings = async () => {
      try {
        // In a real app, this would fetch from the backend
        // For now, we'll use localStorage for demo purposes
        const savedSettings = localStorage.getItem('securitySettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Error loading security settings:', error);
      }
    };

    if (user) {
      loadSettings();
    }
  }, [user]);

  const updateSetting = async (key: keyof SecuritySettings, value: boolean | number) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      
      // Save to localStorage (in a real app, this would save to backend)
      localStorage.setItem('securitySettings', JSON.stringify(newSettings));
      
      // Log security event
      await logSecurityEvent({
        type: 'SECURITY_SETTING_CHANGED',
        details: `Security setting ${key} changed to ${value}`
      });

      toast({
        title: "Settings updated",
        description: "Your security settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update security settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const terminateSession = async (sessionId: string) => {
    try {
      // In a real app, this would call the backend to terminate the session
      await logSecurityEvent({
        type: 'SESSION_TERMINATED',
        details: `Session ${sessionId} terminated by user`
      });

      toast({
        title: "Session terminated",
        description: "The selected session has been terminated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to terminate session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const terminateAllOtherSessions = async () => {
    try {
      await logSecurityEvent({
        type: 'ALL_SESSIONS_TERMINATED',
        details: 'All other sessions terminated by user'
      });

      toast({
        title: "All sessions terminated",
        description: "All other sessions have been terminated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to terminate sessions. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Eye className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      return `${days} days ago`;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Security Settings</h1>
              <p className="text-muted-foreground">
                Manage your account security and privacy preferences
              </p>
            </div>
          </div>

          <Tabs defaultValue="security" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
              <TabsTrigger value="activity">Security Log</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Account Security
                  </CardTitle>
                  <CardDescription>
                    Configure your account security settings and authentication methods
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="font-medium">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch
                        checked={settings.twoFactorEnabled}
                        onCheckedChange={(checked) => updateSetting('twoFactorEnabled', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="font-medium">Login Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified of new sign-ins to your account
                        </p>
                      </div>
                      <Switch
                        checked={settings.loginAlerts}
                        onCheckedChange={(checked) => updateSetting('loginAlerts', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="font-medium">Device Tracking</Label>
                        <p className="text-sm text-muted-foreground">
                          Monitor and manage devices that access your account
                        </p>
                      </div>
                      <Switch
                        checked={settings.deviceTracking}
                        onCheckedChange={(checked) => updateSetting('deviceTracking', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="font-medium">Location-Based Security</Label>
                        <p className="text-sm text-muted-foreground">
                          Enhanced security based on your location patterns
                        </p>
                      </div>
                      <Switch
                        checked={settings.locationBasedSecurity}
                        onCheckedChange={(checked) => updateSetting('locationBasedSecurity', checked)}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="space-y-4">
                      <div>
                        <Label className="font-medium">Password Strength</Label>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={passwordStrength === 'strong' ? 'default' : 'secondary'}>
                            {passwordStrength === 'strong' ? 'Strong' : 'Weak'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Last changed 30 days ago
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full sm:w-auto">
                        Change Password
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to be notified about security events
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="font-medium">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive security alerts via email
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Active Sessions
                  </CardTitle>
                  <CardDescription>
                    Manage devices and browsers that are currently signed in to your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          {session.device.includes('iPhone') ? (
                            <Smartphone className="h-4 w-4" />
                          ) : (
                            <Monitor className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{session.device}</span>
                            {session.current && (
                              <Badge variant="secondary" className="text-xs">
                                Current
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {session.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(session.lastActive)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {!session.current && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => terminateSession(session.id)}
                        >
                          Terminate
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t">
                    <Button
                      variant="destructive"
                      onClick={terminateAllOtherSessions}
                      className="w-full sm:w-auto"
                    >
                      Terminate All Other Sessions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Security Activity Log
                  </CardTitle>
                  <CardDescription>
                    Recent security events and activities on your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {securityEvents.map((event) => (
                    <div key={event.id} className="flex items-center gap-3 p-4 border rounded-lg">
                      <div className={`p-2 rounded-lg ${getSeverityColor(event.severity)}`}>
                        {getSeverityIcon(event.severity)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{event.type}</span>
                          <Badge variant="outline" className={getSeverityColor(event.severity)}>
                            {event.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatTimestamp(event.timestamp)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>
                    Control how your data is used and shared
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Your privacy is important to us. We only collect data necessary to provide 
                      and improve our services. You can control most data collection settings here.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="font-medium">Analytics Data</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow collection of usage analytics to improve the platform
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="font-medium">Marketing Communications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about new features and promotions
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full sm:w-auto">
                        Download My Data
                      </Button>
                      <Button variant="destructive" className="w-full sm:w-auto">
                        Delete Account
                      </Button>
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

export default SecuritySettings;
