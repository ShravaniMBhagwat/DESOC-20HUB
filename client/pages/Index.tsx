import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Zap, Users, Calendar, Clock, ChevronRight, Cpu, Orbit, Wifi } from 'lucide-react';

interface Workshop {
  id: string;
  name: string;
  date: string;
  time: string;
  description: string;
  capacity: number;
  registeredUsers: string[];
  imageUrl?: string;
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
}

interface UserRegistration {
  workshopId: string;
  workshopName: string;
  registeredAt: Date;
}

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [authError, setAuthError] = useState('');
  const [notification, setNotification] = useState('');

  // Mock workshops data
  const mockWorkshops: Workshop[] = [
    {
      id: 'quantum-computing',
      name: 'Quantum Computing Fundamentals',
      date: '2025-01-20',
      time: '14:00 - 16:00',
      description: 'Dive into the quantum realm and understand the principles of quantum computing, qubits, and quantum algorithms.',
      capacity: 25,
      registeredUsers: [],
      instructor: 'Dr. Sarah Chen',
      level: 'Intermediate',
      tags: ['Quantum', 'Physics', 'Computing'],
      imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop'
    },
    {
      id: 'neural-networks',
      name: 'Neural Network Architecture',
      date: '2025-01-25',
      time: '10:00 - 12:00',
      description: 'Explore deep learning architectures and build your first neural network from scratch.',
      capacity: 30,
      registeredUsers: [],
      instructor: 'Prof. Alex Rodriguez',
      level: 'Advanced',
      tags: ['AI', 'Machine Learning', 'Python'],
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop'
    },
    {
      id: 'space-robotics',
      name: 'Space Robotics Engineering',
      date: '2025-01-30',
      time: '13:00 - 15:00',
      description: 'Design and program robots for space exploration missions. Learn about autonomous navigation in zero gravity.',
      capacity: 20,
      registeredUsers: [],
      instructor: 'Commander Lisa Park',
      level: 'Intermediate',
      tags: ['Robotics', 'Space', 'Engineering'],
      imageUrl: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=250&fit=crop'
    },
    {
      id: 'blockchain-protocols',
      name: 'Advanced Blockchain Protocols',
      date: '2025-02-05',
      time: '16:00 - 18:00',
      description: 'Master consensus algorithms, smart contracts, and decentralized application development.',
      capacity: 35,
      registeredUsers: [],
      instructor: 'Dr. Marcus Webb',
      level: 'Advanced',
      tags: ['Blockchain', 'Cryptography', 'Web3'],
      imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop'
    },
    {
      id: 'cybersecurity-hacking',
      name: 'Ethical Hacking & Penetration Testing',
      date: '2025-02-10',
      time: '09:00 - 11:00',
      description: 'Learn ethical hacking techniques, vulnerability assessment, and penetration testing methodologies.',
      capacity: 15,
      registeredUsers: [],
      instructor: 'Agent Maya Singh',
      level: 'Advanced',
      tags: ['Security', 'Hacking', 'Networks'],
      imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop'
    },
    {
      id: 'biotech-programming',
      name: 'Biotechnology & Bioinformatics',
      date: '2025-02-15',
      time: '11:00 - 13:00',
      description: 'Apply programming to biological data analysis, gene sequencing, and protein structure prediction.',
      capacity: 28,
      registeredUsers: [],
      instructor: 'Dr. Elena Vasquez',
      level: 'Beginner',
      tags: ['Biology', 'Data Science', 'Research'],
      imageUrl: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=400&h=250&fit=crop'
    }
  ];

  useEffect(() => {
    // Simulate loading and authentication check
    const initializeApp = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading
      
      // Check if user is logged in (mock)
      const savedUser = localStorage.getItem('sciFiUser');
      if (savedUser) {
        setCurrentUser(savedUser);
        setIsAuthenticated(true);
        loadUserRegistrations(savedUser);
      }
      
      setWorkshops(mockWorkshops);
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

    // Mock authentication
    const userId = `user_${Date.now()}`;
    localStorage.setItem('sciFiUser', userId);
    setCurrentUser(userId);
    setIsAuthenticated(true);
    setShowAuth(false);
    setNotification(`Authentication successful! Welcome to the network, Agent ${userId.slice(-4)}.`);
    
    setTimeout(() => setNotification(''), 5000);
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
      setNotification('You are already registered for this workshop.');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    if (workshop.registeredUsers.length >= workshop.capacity) {
      setNotification('Workshop is at full capacity.');
      setTimeout(() => setNotification(''), 3000);
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

    // Update workshop registered users
    const updatedWorkshops = workshops.map(w => 
      w.id === workshopId 
        ? { ...w, registeredUsers: [...w.registeredUsers, currentUser] }
        : w
    );
    setWorkshops(updatedWorkshops);

    setNotification(`Successfully registered for ${workshop.name}!`);
    setTimeout(() => setNotification(''), 5000);
  };

  const handleUnregister = async (workshopId: string) => {
    const updatedRegistrations = registrations.filter(r => r.workshopId !== workshopId);
    setRegistrations(updatedRegistrations);
    
    if (currentUser) {
      localStorage.setItem(`registrations_${currentUser}`, JSON.stringify(updatedRegistrations));
    }

    // Update workshop registered users
    const updatedWorkshops = workshops.map(w => 
      w.id === workshopId 
        ? { ...w, registeredUsers: w.registeredUsers.filter(u => u !== currentUser) }
        : w
    );
    setWorkshops(updatedWorkshops);

    const workshop = workshops.find(w => w.id === workshopId);
    setNotification(`Unregistered from ${workshop?.name}`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('sciFiUser');
    localStorage.removeItem(`registrations_${currentUser}`);
    setCurrentUser(null);
    setIsAuthenticated(false);
    setRegistrations([]);
    setNotification('Session terminated. Goodbye, Agent.');
    setTimeout(() => setNotification(''), 3000);
  };

  const isRegisteredForWorkshop = (workshopId: string) => {
    return registrations.some(r => r.workshopId === workshopId);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-cyber-green-500 text-cyber-green-100';
      case 'Intermediate': return 'bg-neon-blue-500 text-neon-blue-100';
      case 'Advanced': return 'bg-neon-purple-500 text-neon-purple-100';
      default: return 'bg-gray-500 text-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <Cpu className="w-16 h-16 text-neon-blue-400 animate-spin mx-auto" />
            <div className="absolute inset-0 w-16 h-16 bg-neon-blue-400 rounded-full opacity-20 animate-ping mx-auto"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-neon-blue-400 animate-pulse">SYSTEM INITIALIZING</h2>
            <p className="text-slate-300 font-mono">Establishing secure connection...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-neon-blue-500/30 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Orbit className="w-8 h-8 text-neon-blue-400 animate-spin" />
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue-400 to-neon-purple-400">
                  NEXUS WORKSHOP HUB
                </h1>
              </div>
              <Badge variant="outline" className="border-cyber-green-500 text-cyber-green-400 bg-cyber-green-500/10">
                <Wifi className="w-3 h-3 mr-1" />
                NETWORK ACTIVE
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Badge variant="secondary" className="bg-neon-blue-500/20 text-neon-blue-400 border-neon-blue-500/50">
                    Agent {currentUser?.slice(-4)}
                  </Badge>
                  <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    DISCONNECT
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => setShowAuth(true)}
                  className="bg-neon-blue-500 hover:bg-neon-blue-600 text-white"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  CONNECT
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-slide-in-right">
          <Alert className="bg-cyber-green-500/20 border-cyber-green-500 text-cyber-green-400">
            <Zap className="h-4 w-4" />
            <AlertDescription>{notification}</AlertDescription>
          </Alert>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="space-y-6">
            <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue-400 via-neon-purple-400 to-cyber-green-400 animate-float">
              ADVANCED TECHNOLOGY WORKSHOPS
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto font-mono">
              Interface with cutting-edge technology protocols. Enhance your neural pathways with quantum-level knowledge.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-neon-blue-400" />
                <span>{workshops.reduce((acc, w) => acc + w.capacity, 0)} Total Slots</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-neon-purple-400" />
                <span>{workshops.length} Active Workshops</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-cyber-green-400" />
                <span>Real-time Sync</span>
              </div>
            </div>
          </div>
        </section>

        {/* My Registrations */}
        {isAuthenticated && registrations.length > 0 && (
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-neon-blue-400 mb-6 flex items-center">
              <Cpu className="w-6 h-6 mr-2" />
              MY ACTIVE PROTOCOLS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registrations.map((reg) => {
                const workshop = workshops.find(w => w.id === reg.workshopId);
                if (!workshop) return null;
                
                return (
                  <Card key={reg.workshopId} className="glass border-cyber-green-500/50 hover:border-cyber-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyber-green-500/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getLevelColor(workshop.level)}>
                          {workshop.level}
                        </Badge>
                        <Badge variant="outline" className="border-cyber-green-500 text-cyber-green-400">
                          REGISTERED
                        </Badge>
                      </div>
                      <CardTitle className="text-lg text-neon-blue-400">{workshop.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-4 text-sm text-slate-300">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{workshop.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{workshop.time}</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleUnregister(workshop.id)}
                        variant="outline" 
                        className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        ABORT PROTOCOL
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Workshops Grid */}
        <section>
          <h3 className="text-2xl font-bold text-neon-blue-400 mb-6 flex items-center">
            <Orbit className="w-6 h-6 mr-2 animate-spin" />
            AVAILABLE PROTOCOLS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workshops.map((workshop) => {
              const isRegistered = isRegisteredForWorkshop(workshop.id);
              const availableSlots = workshop.capacity - workshop.registeredUsers.length;
              const isFull = availableSlots <= 0;
              
              return (
                <Card key={workshop.id} className="glass border-neon-blue-500/30 hover:border-neon-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-neon-blue-500/20 group">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={workshop.imageUrl} 
                      alt={workshop.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className={`absolute top-3 left-3 ${getLevelColor(workshop.level)}`}>
                      {workshop.level}
                    </Badge>
                    {isRegistered && (
                      <Badge className="absolute top-3 right-3 bg-cyber-green-500 text-cyber-green-100">
                        ACTIVE
                      </Badge>
                    )}
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-neon-blue-400 group-hover:text-neon-blue-300 transition-colors">
                      {workshop.name}
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Instructor: {workshop.instructor}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-slate-300 text-sm">{workshop.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {workshop.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-slate-700/50 text-slate-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{workshop.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{workshop.time}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-400">
                          {availableSlots} / {workshop.capacity} slots
                        </span>
                      </div>
                      <Badge 
                        variant={isFull ? "destructive" : "secondary"}
                        className={isFull ? "bg-red-500/20 text-red-400" : "bg-cyber-green-500/20 text-cyber-green-400"}
                      >
                        {isFull ? "FULL" : "AVAILABLE"}
                      </Badge>
                    </div>
                    
                    <Button 
                      onClick={() => isRegistered ? handleUnregister(workshop.id) : handleRegister(workshop.id)}
                      disabled={!isRegistered && isFull}
                      className={`w-full ${
                        isRegistered 
                          ? "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30" 
                          : isFull
                          ? "bg-gray-500/20 text-gray-500 cursor-not-allowed"
                          : "bg-neon-blue-500 hover:bg-neon-blue-600 text-white"
                      }`}
                      variant={isRegistered ? "outline" : "default"}
                    >
                      {isRegistered ? "ABORT PROTOCOL" : isFull ? "CAPACITY REACHED" : "INITIATE PROTOCOL"}
                      {!isRegistered && !isFull && <ChevronRight className="w-4 h-4 ml-2" />}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>

      {/* Authentication Dialog */}
      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="glass border-neon-blue-500/50 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-neon-blue-400 text-xl">
              {authMode === 'login' ? 'SYSTEM ACCESS' : 'NEURAL LINK CREATION'}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {authMode === 'login' 
                ? 'Enter your credentials to access the network' 
                : 'Initialize new agent profile in the system'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Agent ID</Label>
              <Input
                id="email"
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                className="bg-slate-800/50 border-neon-blue-500/30 text-slate-100 focus:border-neon-blue-400"
                placeholder="agent@nexus.sys"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Access Key</Label>
              <Input
                id="password"
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                className="bg-slate-800/50 border-neon-blue-500/30 text-slate-100 focus:border-neon-blue-400"
                placeholder="••••••••"
                required
              />
            </div>
            
            {authMode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Access Key</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={authForm.confirmPassword}
                  onChange={(e) => setAuthForm({...authForm, confirmPassword: e.target.value})}
                  className="bg-slate-800/50 border-neon-blue-500/30 text-slate-100 focus:border-neon-blue-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}
            
            {authError && (
              <Alert className="bg-red-500/20 border-red-500 text-red-400">
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex flex-col space-y-3">
              <Button type="submit" className="bg-neon-blue-500 hover:bg-neon-blue-600 text-white">
                <Zap className="w-4 h-4 mr-2" />
                {authMode === 'login' ? 'ESTABLISH CONNECTION' : 'CREATE NEURAL LINK'}
              </Button>
              
              <Button 
                type="button"
                variant="ghost" 
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'signup' : 'login');
                  setAuthError('');
                  setAuthForm({ email: '', password: '', confirmPassword: '' });
                }}
                className="text-slate-400 hover:text-neon-blue-400"
              >
                {authMode === 'login' ? 'Need neural link? Create profile' : 'Already connected? Access system'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
