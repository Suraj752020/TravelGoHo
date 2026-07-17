import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Lock, Shield, Loader2, Save, KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthModal from '@/components/auth/AuthModal';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading, refreshProfile } = useAuth();
  const { toast } = useToast();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated && user) {
        setProfileData({
          name: user.name || '',
          phone: user.phone || '',
        });
      } else {
        setAuthModalOpen(true);
      }
    }
  }, [isAuthenticated, authLoading, user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);

    try {
      await authAPI.updateProfile(profileData);
      await refreshProfile();
      toast({
        title: 'Profile updated!',
        description: 'Your profile settings have been successfully updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Error updating profile',
        description: error.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast({
        title: 'Validation Error',
        description: 'New password and confirm password do not match.',
        variant: 'destructive',
      });
    }

    if (passwordData.newPassword.length < 6) {
      return toast({
        title: 'Validation Error',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
    }

    setPasswordLoading(true);

    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast({
        title: 'Password updated!',
        description: 'Your password has been changed successfully.',
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast({
        title: 'Error changing password',
        description: error.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-bold font-display">Authentication Required</h2>
          <p className="text-muted-foreground">
            Please sign in to view and manage your profile settings.
          </p>
          <Button onClick={() => setAuthModalOpen(true)} className="w-full">
            Sign In / Get Started
          </Button>
        </div>
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => {
            setAuthModalOpen(false);
            if (!isAuthenticated) navigate('/');
          }}
          mode="login"
          onModeChange={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 text-primary flex items-center justify-center font-display text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold font-display text-foreground">{user?.name}</h1>
                <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5" />
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="px-4 py-2 rounded-xl bg-orange-50 text-primary text-xs font-semibold border border-orange-100 flex items-center gap-1.5 self-start md:self-auto">
                <Shield className="w-3.5 h-3.5" /> Verified Account
              </div>
            </div>
          </div>

          {/* Main Content (Tabs) */}
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid grid-cols-2 max-w-md mx-auto mb-6 bg-white border border-border shadow-sm p-1 rounded-xl">
              <TabsTrigger value="personal" className="rounded-lg py-2.5 text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" /> Personal Details
              </TabsTrigger>
              <TabsTrigger value="security" className="rounded-lg py-2.5 text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" /> Security / Password
              </TabsTrigger>
            </TabsList>

            {/* Personal Details Tab */}
            <TabsContent value="personal">
              <form onSubmit={handleProfileSubmit}>
                <Card className="border-border shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-display text-lg">Personal Details</CardTitle>
                    <CardDescription>
                      Manage your profile information. Keep your contact details updated for booking updates.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="profile-name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          placeholder="Your full name"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profile-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="profile-email"
                          type="email"
                          value={user?.email}
                          disabled
                          placeholder="Your email address"
                          className="pl-10 bg-muted/50 cursor-not-allowed"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Your registered email address cannot be changed.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profile-phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="profile-phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          placeholder="Your phone number"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/10 border-t border-border/50 p-6 flex justify-end">
                    <Button type="submit" disabled={profileLoading} className="flex items-center gap-2">
                      {profileLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" /> Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <form onSubmit={handlePasswordSubmit}>
                <Card className="border-border shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-display text-lg">Change Password</CardTitle>
                    <CardDescription>
                      Ensure your account remains secure by regularly updating your password.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="current-password"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          placeholder="Enter your current password"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="new-password"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          placeholder="Enter your new password (min. 6 chars)"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          placeholder="Re-enter your new password"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/10 border-t border-border/50 p-6 flex justify-end">
                    <Button type="submit" disabled={passwordLoading} className="flex items-center gap-2">
                      {passwordLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" /> Change Password
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
