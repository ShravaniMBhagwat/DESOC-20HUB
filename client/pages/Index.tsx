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
  User, Settings, LogOut, Heart, MessageSquare
} from 'lucide-react';
import { SearchAndFilters } from '@/components/SearchAndFilters';
import { EnhancedWorkshopCard } from '@/components/EnhancedWorkshopCard';
import { NotificationSystem } from '@/components/NotificationSystem';
import Navigation from '@/components/Navigation';
import DesocEvents from '@/components/DesocEvents';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-brand/10 to-purple-600/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-blue-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>
      {/* Navigation */}
      <Navigation
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onLogout={handleLogout}
        onShowAuth={() => setShowAuth(true)}
        onShowNotifications={() => setShowNotifications(true)}
      />

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
        <section className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-brand/10 via-purple-600/8 to-pink-600/6 rounded-3xl shadow-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent rounded-3xl"></div>
          <div className="relative py-20 px-8">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand/15 to-accent/10 rounded-full mb-8 border border-brand/20 shadow-lg backdrop-blur-sm">
              <Star className="w-5 h-5 text-brand mr-2 animate-pulse" />
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand to-accent">Premium Learning Platform</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-neutral-900 mb-8 leading-tight">
              Unlock the
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-accent to-brand-700 animate-pulse"> Universe </span>
              of Knowledge
            </h2>
            <p className="text-xl md:text-2xl text-neutral-600 max-w-4xl mx-auto mb-10 leading-relaxed font-medium">
              Join DESOC Workshop Hub and transform your career with cutting-edge workshops led by industry pioneers.
              Master tomorrow's technologies today and earn prestigious certifications that matter.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button className="bg-gradient-to-r from-brand via-brand-600 to-accent hover:from-brand/90 hover:via-brand-600/90 hover:to-accent/90 text-white px-10 py-4 text-xl font-bold shadow-2xl hover:shadow-glow transition-all duration-500 transform hover:scale-105 border-2 border-white/20">
                🚀 Start Learning Today
              </Button>
              <Button variant="outline" className="px-10 py-4 text-xl font-bold border-3 border-brand hover:bg-gradient-to-r hover:from-brand/5 hover:to-accent/5 transition-all duration-500 transform hover:scale-105 hover:border-accent text-brand hover:text-accent">
                🎯 Explore Workshops
              </Button>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <div className="group text-center p-8 bg-white/90 backdrop-blur-lg rounded-3xl border border-neutral-200/60 hover:shadow-2xl hover:shadow-glow transition-all duration-500 transform hover:scale-105 hover:rotate-1">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-600 mb-3 group-hover:scale-110 transition-transform duration-300">{workshops.length}</div>
                <div className="text-sm font-semibold text-neutral-600 group-hover:text-brand transition-colors duration-300">Expert Workshops</div>
              </div>
              <div className="group text-center p-8 bg-white/90 backdrop-blur-lg rounded-3xl border border-neutral-200/60 hover:shadow-2xl hover:shadow-glow-success transition-all duration-500 transform hover:scale-105 hover:-rotate-1">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-success to-success-600 mb-3 group-hover:scale-110 transition-transform duration-300">{workshops.reduce((acc, w) => acc + w.capacity, 0)}</div>
                <div className="text-sm font-semibold text-neutral-600 group-hover:text-success transition-colors duration-300">Learning Seats</div>
              </div>
              <div className="group text-center p-8 bg-white/90 backdrop-blur-lg rounded-3xl border border-neutral-200/60 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 transform hover:scale-105 hover:rotate-1">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-warning to-warning-600 mb-3 group-hover:scale-110 transition-transform duration-300">4.7⭐</div>
                <div className="text-sm font-semibold text-neutral-600 group-hover:text-warning transition-colors duration-300">Average Rating</div>
              </div>
              <div className="group text-center p-8 bg-white/90 backdrop-blur-lg rounded-3xl border border-neutral-200/60 hover:shadow-2xl hover:shadow-glow-accent transition-all duration-500 transform hover:scale-105 hover:-rotate-1">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-600 mb-3 group-hover:scale-110 transition-transform duration-300">92%</div>
                <div className="text-sm font-semibold text-neutral-600 group-hover:text-accent transition-colors duration-300">Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Innovation Partners */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand to-accent mb-4">Innovation Partners</h3>
            <p className="text-lg font-medium text-neutral-600">Powering the future with leading technology companies</p>
          </div>
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent z-10 pointer-events-none"></div>
            <div className="flex flex-wrap justify-center items-center gap-6">
              <div className="group px-8 py-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200/60 text-gray-700 font-bold hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer">
                <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">Google</span>
              </div>
              <div className="group px-8 py-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200/60 text-gray-700 font-bold hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 cursor-pointer">
                <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-emerald-600 transition-all duration-300">Microsoft</span>
              </div>
              <div className="group px-8 py-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200/60 text-gray-700 font-bold hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer">
                <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">Meta</span>
              </div>
              <div className="group px-8 py-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200/60 text-gray-700 font-bold hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 cursor-pointer">
                <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-yellow-600 transition-all duration-300">Amazon</span>
              </div>
              <div className="group px-8 py-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200/60 text-gray-700 font-bold hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 cursor-pointer">
                <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-600 group-hover:to-slate-600 transition-all duration-300">Apple</span>
              </div>
              <div className="group px-8 py-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200/60 text-gray-700 font-bold hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 cursor-pointer">
                <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-rose-600 transition-all duration-300">Netflix</span>
              </div>
              <div className="group px-8 py-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200/60 text-gray-700 font-bold hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 cursor-pointer">
                <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 transition-all duration-300">Tesla</span>
              </div>
              <div className="group px-8 py-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200/60 text-gray-700 font-bold hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 cursor-pointer">
                <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">SpaceX</span>
              </div>
            </div>
          </div>
        </section>

        {/* HackerRank Series - Special Course */}
        <section className="mb-16">
          <div className="relative bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-8 overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="text-white">
                  <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full mb-4">
                    <Award className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Special Course Series</span>
                  </div>
                  <h2 className="text-4xl font-bold mb-4">HackerRank Mastery Series</h2>
                  <p className="text-xl mb-6 text-white/90">
                    Master coding interviews and competitive programming with our comprehensive HackerRank-style challenges and training modules.
                  </p>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <Badge className="bg-white/20 text-white border-white/30">200+ Problems</Badge>
                    <Badge className="bg-white/20 text-white border-white/30">Live Coding Sessions</Badge>
                    <Badge className="bg-white/20 text-white border-white/30">Interview Prep</Badge>
                    <Badge className="bg-white/20 text-white border-white/30">Real-time Judging</Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-white text-green-600 hover:bg-white/90 font-semibold px-6 py-3">
                      Start Coding Challenges
                    </Button>
                    <Button variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-6 py-3">
                      View Curriculum
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">Featured Challenges</h3>
                      <Badge className="bg-yellow-400 text-black">Hot 🔥</Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Two Sum Problem</p>
                          <p className="text-white/70 text-sm">Array, Hash Table</p>
                        </div>
                        <Badge className="bg-green-500 text-white">Easy</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Binary Tree Traversal</p>
                          <p className="text-white/70 text-sm">Tree, Recursion</p>
                        </div>
                        <Badge className="bg-yellow-500 text-white">Medium</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Graph Algorithms</p>
                          <p className="text-white/70 text-sm">Graph, DFS, BFS</p>
                        </div>
                        <Badge className="bg-red-500 text-white">Hard</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events & Workshops</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our live events, webinars, and special workshops featuring industry experts and thought leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Live Workshop Event */}
            <Card className="professional-card border-l-4 border-l-brand relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-red-500 text-white animate-pulse">🔴 LIVE</Badge>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Jan 25, 2025</span>
                  <Clock className="w-4 h-4 ml-2" />
                  <span>2:00 PM EST</span>
                </div>
                <CardTitle className="text-xl">AI in Production: Best Practices</CardTitle>
                <CardDescription>
                  Live workshop on deploying AI models in production environments with real-world case studies.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" />
                      <AvatarFallback>DR</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">Dr. Raj Patel</span>
                  </div>
                  <Button size="sm" className="bg-brand">
                    Join Live
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Webinar Event */}
            <Card className="professional-card border-l-4 border-l-purple-500">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Jan 30, 2025</span>
                  <Clock className="w-4 h-4 ml-2" />
                  <span>1:00 PM EST</span>
                </div>
                <CardTitle className="text-xl">Future of Quantum Computing</CardTitle>
                <CardDescription>
                  Expert panel discussion on quantum computing breakthroughs and their impact on various industries.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b2e23e84?w=150&h=150&fit=crop&crop=face" />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">Dr. Sarah Chen</span>
                  </div>
                  <Button size="sm" variant="outline">
                    Register Free
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Special Masterclass */}
            <Card className="professional-card border-l-4 border-l-green-500">
              <div className="absolute top-4 right-4">
                <Badge className="bg-yellow-400 text-black">Premium</Badge>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Feb 5, 2025</span>
                  <Clock className="w-4 h-4 ml-2" />
                  <span>3:00 PM EST</span>
                </div>
                <CardTitle className="text-xl">Blockchain Masterclass</CardTitle>
                <CardDescription>
                  Comprehensive masterclass on building decentralized applications with hands-on coding sessions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" />
                      <AvatarFallback>MW</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">Marcus Webb</span>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Reserve Spot
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" className="px-8 py-3">
              View All Events
            </Button>
          </div>
        </section>

        {/* DESOC Events Section */}
        <section className="mb-16">
          <DesocEvents />
        </section>

        {/* Contact Us Section */}
        <section className="mb-16">
          <Card className="professional-card bg-gradient-to-r from-gray-50 to-blue-50 border-brand/20">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-lg text-gray-600">Get in touch with our team for any questions or support</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Head Contact */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-brand to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Dr. Priya Sharma</h3>
                  <p className="text-gray-600 mb-2">Head of Education</p>
                  <p className="text-sm text-gray-600 mb-4">Leading educational innovation and curriculum development</p>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Email:</span>
                      <a href="mailto:priya.sharma@desoc.edu" className="text-brand hover:underline ml-1">
                        priya.sharma@desoc.edu
                      </a>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Phone:</span>
                      <a href="tel:+1-555-0123" className="text-brand hover:underline ml-1">
                        +1 (555) 012-3456
                      </a>
                    </p>
                  </div>
                </div>

                {/* Help & Support */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Help & Support</h3>
                  <p className="text-gray-600 mb-4">Technical support and general inquiries</p>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Support Email:</span>
                      <a href="mailto:help@desoc.edu" className="text-brand hover:underline ml-1">
                        help@desoc.edu
                      </a>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Response Time:</span>
                      <span className="text-gray-600 ml-1">Within 24 hours</span>
                    </p>
                    <Button className="mt-3 bg-green-600 hover:bg-green-700" size="sm">
                      Submit Ticket
                    </Button>
                  </div>
                </div>

                {/* General Contact */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">DESOC Hub</h3>
                  <p className="text-gray-600 mb-4">General information and partnerships</p>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Main Office:</span>
                      <span className="text-gray-600 ml-1">San Francisco, CA</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">General Email:</span>
                      <a href="mailto:info@desoc.edu" className="text-brand hover:underline ml-1">
                        info@desoc.edu
                      </a>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Business Hours:</span>
                      <span className="text-gray-600 ml-1">Mon-Fri 9AM-6PM PST</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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

      {/* Notification System */}
      <NotificationSystem
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
}
