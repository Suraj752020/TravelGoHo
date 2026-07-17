import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Hotel, Calendar, User, Menu, X, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const navLinks = [
    { to: '/flights', label: 'Flights', icon: Plane },
    { to: '/hotels', label: 'Hotels', icon: Hotel },
    { to: '/bookings', label: 'My Bookings', icon: Calendar },
  ];

  const isTransparent = location.pathname === '/';

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isTransparent ? 'bg-transparent' : 'glass border-b border-border/50'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl gradient-sunset flex items-center justify-center shadow-lg group-hover:shadow-glow transition-shadow">
                <Plane className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className={`text-xl font-display font-bold ${isTransparent ? 'text-primary-foreground' : 'text-foreground'}`}>
                TravelGo
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? isTransparent ? 'text-accent' : 'text-primary'
                      : isTransparent ? 'text-primary-foreground/80 hover:text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={isTransparent ? 'hero-outline' : 'ghost'}
                      className="flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      <span>{user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white border border-border shadow-md rounded-xl p-1.5 mt-2">
                    <DropdownMenuLabel className="px-2 py-1.5 text-xs text-muted-foreground font-medium">
                      My Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1 border-t border-border/50" />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2 px-2 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer outline-none">
                        <User className="w-4 h-4 text-primary" />
                        <span>Profile Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/bookings" className="flex items-center gap-2 px-2 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer outline-none">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>My Bookings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1 border-t border-border/50" />
                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center gap-2 px-2 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer outline-none"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    variant={isTransparent ? 'hero-outline' : 'ghost'}
                    onClick={() => openAuth('login')}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="hero"
                    onClick={() => openAuth('register')}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className={`w-6 h-6 ${isTransparent ? 'text-primary-foreground' : 'text-foreground'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${isTransparent ? 'text-primary-foreground' : 'text-foreground'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden glass border-t border-border/50"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <link.icon className="w-5 h-5 text-primary" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                ))}
                <div className="pt-4 border-t border-border space-y-2">
                  {isAuthenticated ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 p-3">
                        <User className="w-5 h-5 text-primary" />
                        <span className="font-medium text-foreground">{user?.name}</span>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="w-5 h-5 text-primary" />
                        <span className="font-medium">Profile Settings</span>
                      </Link>
                      <Link
                        to="/bookings"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="font-medium">My Bookings</span>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full mt-2 flex items-center gap-2 justify-center"
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          openAuth('login');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Sign In
                      </Button>
                      <Button
                        variant="hero"
                        className="w-full"
                        onClick={() => {
                          openAuth('register');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
};

export default Navbar;
