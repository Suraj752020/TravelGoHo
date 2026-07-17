import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, User, Loader2, KeyRound } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

const AuthModal = ({ isOpen, onClose, mode, onModeChange }: AuthModalProps) => {
  const { login, register } = useAuth();
  const { toast } = useToast();
  
  const [internalMode, setInternalMode] = useState<'login' | 'register' | 'forgot' | 'otp'>('login');
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // OTP Reset states
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Synchronize internal mode with parent prop
  useEffect(() => {
    if (isOpen) {
      setInternalMode(mode);
    }
  }, [mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (internalMode === 'login') {
        await login(formData.email, formData.password);
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });
        onClose();
        setFormData({ name: '', email: '', password: '' });
      } else if (internalMode === 'register') {
        await register(formData.name, formData.email, formData.password);
        toast({
          title: 'Account created!',
          description: 'Welcome to TravelGo.',
        });
        onClose();
        setFormData({ name: '', email: '', password: '' });
      } else if (internalMode === 'forgot') {
        await authAPI.forgotPassword({ email: formData.email });
        toast({
          title: 'OTP Sent!',
          description: 'A 6-digit OTP has been sent to your email. Check your server console if running locally.',
        });
        setInternalMode('otp');
      } else if (internalMode === 'otp') {
        if (newPassword !== confirmPassword) {
          toast({
            title: 'Error',
            description: 'Passwords do not match.',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }
        if (newPassword.length < 6) {
          toast({
            title: 'Error',
            description: 'Password must be at least 6 characters long.',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        await authAPI.resetPassword({
          email: formData.email,
          otp,
          password: newPassword,
        });

        toast({
          title: 'Password reset successful!',
          description: 'You can now sign in with your new password.',
        });
        setInternalMode('login');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getHeaderInfo = () => {
    switch (internalMode) {
      case 'register':
        return {
          title: 'Start Your Journey',
          description: 'Create an account to book flights, hotels, and manage your trips.',
        };
      case 'forgot':
        return {
          title: 'Reset Password',
          description: 'Enter your email address and we will send you a 6-digit OTP to reset your password.',
        };
      case 'otp':
        return {
          title: 'Verify OTP',
          description: 'Enter the 6-digit OTP sent to your email and choose your new password.',
        };
      case 'login':
      default:
        return {
          title: 'Welcome Back',
          description: 'Sign in to access your bookings and personalized travel experiences.',
        };
    }
  };

  const header = getHeaderInfo();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="gradient-sunset p-6 text-primary-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display text-white">
              {header.title}
            </DialogTitle>
          </DialogHeader>
          <p className="mt-2 text-primary-foreground/85 text-sm leading-relaxed">
            {header.description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* REGISTER: Name field */}
          {internalMode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="pl-10"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          {/* LOGIN, REGISTER, FORGOT: Email field */}
          {internalMode !== 'otp' && (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          {/* LOGIN, REGISTER: Password field */}
          {(internalMode === 'login' || internalMode === 'register') && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                {internalMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setInternalMode('forgot')}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
            </div>
          )}

          {/* OTP: OTP & New Password fields */}
          {internalMode === 'otp' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="otp">6-Digit OTP</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="otp"
                    placeholder="123456"
                    className="pl-10"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password (min. 6 chars)"
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <Button type="submit" variant="hero" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Please wait...
              </>
            ) : internalMode === 'login' ? (
              'Sign In'
            ) : internalMode === 'register' ? (
              'Create Account'
            ) : internalMode === 'forgot' ? (
              'Send Reset OTP'
            ) : (
              'Reset Password'
            )}
          </Button>

          {/* Modal Footer Links */}
          <div className="text-center text-sm text-muted-foreground">
            {internalMode === 'login' && (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  className="text-primary font-medium hover:underline"
                  onClick={() => onModeChange('register')}
                >
                  Sign up
                </button>
              </>
            )}
            {internalMode === 'register' && (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  className="text-primary font-medium hover:underline"
                  onClick={() => onModeChange('login')}
                >
                  Sign in
                </button>
              </>
            )}
            {(internalMode === 'forgot' || internalMode === 'otp') && (
              <button
                type="button"
                className="text-primary font-medium hover:underline"
                onClick={() => setInternalMode('login')}
              >
                Back to Sign In
              </button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
