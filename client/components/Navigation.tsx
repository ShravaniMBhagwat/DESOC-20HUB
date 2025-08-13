import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  BookOpen, Brain, BarChart3, Trophy, Bell, LogOut, User, Menu, X
} from 'lucide-react';

interface NavigationProps {
  isAuthenticated: boolean;
  currentUser: string | null;
  onLogout: () => void;
  onShowAuth: () => void;
  onShowNotifications: () => void;
}

export default function Navigation({
  isAuthenticated,
  currentUser,
  onLogout,
  onShowAuth,
  onShowNotifications
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: 'Workshops', path: '/', icon: BookOpen },
    { name: 'Quiz Platform', path: '/quiz', icon: Brain },
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/60 sticky top-0 z-50 shadow-lg relative animate-slide-in-up">
      <div className="absolute inset-0 bg-gradient-to-r from-brand/5 via-transparent to-accent/5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-brand to-brand-600 rounded-xl shadow-lg group-hover:shadow-glow transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <BookOpen className="w-7 h-7 text-white group-hover:animate-bounce-gentle" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center group-hover:animate-wiggle">
                <span className="text-xs font-bold text-gray-900">D</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900 leading-tight">DESOC Workshop Hub</h1>
              <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-brand to-accent font-medium">Unlock the Universe of Knowledge</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActivePath(item.path)
                      ? 'bg-gradient-to-r from-brand to-brand-600 text-white shadow-lg'
                      : 'text-neutral-700 hover:text-brand hover:bg-brand/5'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShowNotifications}
                  className="relative hidden sm:flex"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    3
                  </span>
                </Button>
                <div className="hidden sm:flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {currentUser?.slice(-2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">User {currentUser?.slice(-4)}</span>
                </div>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={onShowAuth} className="bg-brand hover:bg-brand/90">
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <nav className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActivePath(item.path)
                        ? 'bg-gradient-to-r from-brand to-brand-600 text-white'
                        : 'text-neutral-700 hover:text-brand hover:bg-brand/5'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
              
              {isAuthenticated && (
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onShowNotifications();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start relative"
                  >
                    <Bell className="w-4 h-4 mr-3" />
                    Notifications
                    <span className="absolute top-1 left-8 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                      3
                    </span>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
