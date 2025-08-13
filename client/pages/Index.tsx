import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, Calendar, Clock, Star, Award, TrendingUp, BookOpen, 
  Play, CheckCircle, Bell, Search, Filter, Grid, List, Menu,
  User, Settings, LogOut, Heart
} from 'lucide-react';
import { SearchAndFilters } from '@/components/SearchAndFilters';
import { EnhancedWorkshopCard } from '@/components/EnhancedWorkshopCard';
import { NotificationSystem } from '@/components/NotificationSystem';
import { workshopsData, Workshop } from '@/data/workshops';

interface UserRegistration {
  workshopId: string;
  workshopName: string;
  registeredAt: Date;
}

export default function Index() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'student' | 'instructor' | 'admin'>('student');
  
  // Loading and UI state
  const [isLoading, setIsLoading] = useState(true);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [authError, setAuthError] = useState('');
  const [notification, setNotification] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showNotifications, setShowNotifications] = useState(false);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('Featured');
  const [showFilters, setShowFilters] = useState(false);
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [onlyWithCertificate, setOnlyWithCertificate] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const savedUser = localStorage.getItem('workshopUser');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setCurrentUser(userData.id);
        setUserRole(userData.role || 'student');
        setIsAuthenticated(true);
        loadUserRegistrations(userData.id);
      }
      
      setWorkshops(workshopsData);
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  const loadUserRegistrations = (userId: string) => {
    const savedRegistrations = localStorage.getItem(`registrations_${userId}`);
    if (savedRegistrations) {
      setRegistrations(JSON.parse(savedRegistrations));
    }
  };

  const showNotification = (message: string, duration = 5000) => {
    setNotification(message);
    setTimeout(() => setNotification(''), duration);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (authMode === 'signup' && authForm.password !== authForm.confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }

    if (authForm.password.length < 6) {
      setAuthError('Password must be at least 6 characters');
      return;
    }

    const userData = {
      id: `user_${Date.now()}`,
      email: authForm.email,
      role: 'student' as const
    };

    localStorage.setItem('workshopUser', JSON.stringify(userData));
    setCurrentUser(userData.id);
    setUserRole(userData.role);
    setIsAuthenticated(true);
    setShowAuth(false);
    showNotification(`Welcome! You've successfully ${authMode === 'login' ? 'signed in' : 'created your account'}.`);
  };

  const handleRegister = async (workshopId: string) => {
    if (!isAuthenticated || !currentUser) {
      setShowAuth(true);
      return;
    }

    const workshop = workshops.find(w => w.id === workshopId);
    if (!workshop) return;

    const isAlreadyRegistered = registrations.some(r => r.workshopId === workshopId);
    if (isAlreadyRegistered) {
      showNotification('You are already registered for this workshop.', 3000);
      return;
    }

    if (workshop.registeredUsers.length >= workshop.capacity) {
      showNotification('This workshop is at full capacity.', 3000);
      return;
    }

    const newRegistration: UserRegistration = {
      workshopId,
      workshopName: workshop.name,
      registeredAt: new Date()
    };

    const updatedRegistrations = [...registrations, newRegistration];
    setRegistrations(updatedRegistrations);
    localStorage.setItem(`registrations_${currentUser}`, JSON.stringify(updatedRegistrations));

    const updatedWorkshops = workshops.map(w => 
      w.id === workshopId 
        ? { ...w, registeredUsers: [...w.registeredUsers, currentUser] }
        : w
    );
    setWorkshops(updatedWorkshops);

    showNotification(`Successfully registered for "${workshop.name}"!`);
  };

  const handleUnregister = async (workshopId: string) => {
    const updatedRegistrations = registrations.filter(r => r.workshopId !== workshopId);
    setRegistrations(updatedRegistrations);
    
    if (currentUser) {
      localStorage.setItem(`registrations_${currentUser}`, JSON.stringify(updatedRegistrations));
    }

    const updatedWorkshops = workshops.map(w => 
      w.id === workshopId 
        ? { ...w, registeredUsers: w.registeredUsers.filter(u => u !== currentUser) }
        : w
    );
    setWorkshops(updatedWorkshops);

    const workshop = workshops.find(w => w.id === workshopId);
    showNotification(`Cancelled registration for "${workshop?.name}"`, 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('workshopUser');
    localStorage.removeItem(`registrations_${currentUser}`);
    setCurrentUser(null);
    setUserRole('student');
    setIsAuthenticated(false);
    setRegistrations([]);
    showNotification('You have been signed out successfully.', 3000);
  };

  const isRegisteredForWorkshop = (workshopId: string) => {
    return registrations.some(r => r.workshopId === workshopId);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSelectedLevel('All Levels');
    setPriceRange([0, 200]);
    setMinRating(0);
    setOnlyFeatured(false);
    setOnlyWithCertificate(false);
  };

  // Filter and sort workshops
  const filteredAndSortedWorkshops = useMemo(() => {
    let filtered = workshops.filter(workshop => {
      const matchesSearch = workshop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           workshop.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           workshop.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All Categories' || workshop.category === selectedCategory;
      const matchesLevel = selectedLevel === 'All Levels' || workshop.level === selectedLevel;
      const matchesPrice = workshop.price >= priceRange[0] && workshop.price <= priceRange[1];
      const matchesRating = workshop.rating >= minRating;
      const matchesFeatured = !onlyFeatured || workshop.featured;
      const matchesCertificate = !onlyWithCertificate || workshop.certificate;

      return matchesSearch && matchesCategory && matchesLevel && matchesPrice && 
             matchesRating && matchesFeatured && matchesCertificate;
    });

    // Sort workshops
    switch (sortBy) {
      case 'Newest':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'Highest Rated':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'Price: Low to High':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'Featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return filtered;
  }, [workshops, searchTerm, selectedCategory, selectedLevel, priceRange, minRating, sortBy, onlyFeatured, onlyWithCertificate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Loading Workshop Hub</h2>
            <p className="text-gray-600">Preparing your learning experience...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-brand rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">WorkshopHub</h1>
                <p className="text-xs text-gray-500">Professional Learning Platform</p>
              </div>
            </div>
            
            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" size="sm">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {currentUser?.slice(-2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">User {currentUser?.slice(-4)}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button onClick={() => setShowAuth(true)} className="bg-brand hover:bg-brand/90">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50">
          <Alert className="bg-white border border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{notification}</AlertDescription>
          </Alert>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Workshop Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Advance your career with hands-on workshops led by industry experts. 
            Learn cutting-edge technologies and earn professional certificates.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-brand">{workshops.length}</div>
              <div className="text-sm text-gray-600">Active Workshops</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand">{workshops.reduce((acc, w) => acc + w.capacity, 0)}</div>
              <div className="text-sm text-gray-600">Total Seats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand">4.7</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand">92%</div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          minRating={minRating}
          setMinRating={setMinRating}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          onlyFeatured={onlyFeatured}
          setOnlyFeatured={setOnlyFeatured}
          onlyWithCertificate={onlyWithCertificate}
          setOnlyWithCertificate={setOnlyWithCertificate}
          clearFilters={clearFilters}
        />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {filteredAndSortedWorkshops.length} Workshop{filteredAndSortedWorkshops.length !== 1 ? 's' : ''} Found
            </h3>
            {searchTerm && (
              <p className="text-gray-600">Showing results for "{searchTerm}"</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* My Registrations */}
        {isAuthenticated && registrations.length > 0 && (
          <section className="mb-12">
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-success" />
                  My Registered Workshops
                </CardTitle>
                <CardDescription>
                  Track your upcoming workshops and learning progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {registrations.slice(0, 3).map((reg) => {
                    const workshop = workshops.find(w => w.id === reg.workshopId);
                    if (!workshop) return null;
                    
                    return (
                      <Card key={reg.workshopId} className="border border-success-200 bg-success-50">
                        <CardContent className="p-4">
                          <h4 className="font-medium text-gray-900 mb-2">{workshop.name}</h4>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Calendar className="w-4 h-4 mr-1" />
                            {workshop.date} at {workshop.time}
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge className="bg-success text-white">Registered</Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnregister(workshop.id)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                {registrations.length > 3 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline">
                      View All {registrations.length} Registrations
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Workshops Grid */}
        <section>
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredAndSortedWorkshops.map((workshop) => (
              <EnhancedWorkshopCard
                key={workshop.id}
                workshop={workshop}
                isRegistered={isRegisteredForWorkshop(workshop.id)}
                onRegister={handleRegister}
                onUnregister={handleUnregister}
              />
            ))}
          </div>

          {filteredAndSortedWorkshops.length === 0 && (
            <Card className="professional-card text-center py-12">
              <CardContent>
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No workshops found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or clearing filters to see more results.
                </p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      {/* Authentication Dialog */}
      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </DialogTitle>
            <DialogDescription>
              {authMode === 'login' 
                ? 'Sign in to your account to register for workshops' 
                : 'Create a new account to start your learning journey'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                placeholder="••••••••"
                required
              />
            </div>
            
            {authMode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={authForm.confirmPassword}
                  onChange={(e) => setAuthForm({...authForm, confirmPassword: e.target.value})}
                  placeholder="••••••••"
                  required
                />
              </div>
            )}
            
            {authError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{authError}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-3">
              <Button type="submit" className="w-full bg-brand hover:bg-brand/90">
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
              
              <Button 
                type="button"
                variant="ghost" 
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'signup' : 'login');
                  setAuthError('');
                  setAuthForm({ email: '', password: '', confirmPassword: '' });
                }}
                className="w-full"
              >
                {authMode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
