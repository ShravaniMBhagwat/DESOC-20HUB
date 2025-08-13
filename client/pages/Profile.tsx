import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, Edit, Save, X, Star, Calendar, Clock, 
  Award, BookOpen, TrendingUp, Users, Target,
  Settings, Bell, Shield, Download, Upload
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  title: string;
  bio: string;
  location: string;
  company: string;
  website: string;
  skills: string[];
  interests: string[];
  joinDate: Date;
  totalWorkshops: number;
  completedWorkshops: number;
  certificatesEarned: number;
  averageRating: number;
  points: number;
  level: number;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate: Date;
  category: 'completion' | 'skill' | 'social' | 'special';
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    // Load user profile
    const savedUser = localStorage.getItem('workshopUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      
      // Mock user profile data
      const mockProfile: UserProfile = {
        id: userData.id,
        name: 'Alex Johnson',
        email: userData.email,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        title: 'Full Stack Developer',
        bio: 'Passionate about learning new technologies and building innovative solutions. Always excited to tackle challenging problems.',
        location: 'San Francisco, CA',
        company: 'TechCorp Inc.',
        website: 'https://alexjohnson.dev',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Machine Learning'],
        interests: ['AI/ML', 'Quantum Computing', 'Blockchain', 'IoT'],
        joinDate: new Date('2024-01-15'),
        totalWorkshops: 12,
        completedWorkshops: 8,
        certificatesEarned: 6,
        averageRating: 4.7,
        points: 2450,
        level: 5,
        achievements: [
          {
            id: 'first-workshop',
            name: 'First Steps',
            description: 'Completed your first workshop',
            icon: '🎯',
            earnedDate: new Date('2024-01-20'),
            category: 'completion'
          },
          {
            id: 'ai-specialist',
            name: 'AI Specialist',
            description: 'Completed 3 AI/ML workshops',
            icon: '🤖',
            earnedDate: new Date('2024-06-15'),
            category: 'skill'
          },
          {
            id: 'community-contributor',
            name: 'Community Star',
            description: 'Helped 10+ fellow learners',
            icon: '⭐',
            earnedDate: new Date('2024-08-20'),
            category: 'social'
          }
        ]
      };
      
      setUser(mockProfile);
      setEditForm(mockProfile);
    }
  }, []);

  const handleSave = () => {
    if (user && editForm) {
      const updatedUser = { ...user, ...editForm };
      setUser(updatedUser);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditForm(user || {});
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Please sign in to view your profile.</p>
            <Link to="/">
              <Button className="mt-4">Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressToNextLevel = ((user.points % 500) / 500) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="professional-card">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block mb-4">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-2xl">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button size="sm" className="absolute bottom-0 right-0 rounded-full">
                        <Upload className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        placeholder="Full Name"
                      />
                      <Input
                        value={editForm.title || ''}
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                        placeholder="Professional Title"
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
                      <p className="text-gray-600 mb-4">{user.title}</p>
                    </>
                  )}

                  {/* Level & Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Level {user.level}</span>
                      <span className="text-sm text-gray-600">{user.points} points</span>
                    </div>
                    <Progress value={progressToNextLevel} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">
                      {500 - (user.points % 500)} points to level {user.level + 1}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Button onClick={handleSave} className="flex-1">
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button variant="outline" onClick={handleCancel} className="flex-1">
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={() => setIsEditing(true)} className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand">{user.completedWorkshops}</div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand">{user.certificatesEarned}</div>
                    <div className="text-xs text-gray-600">Certificates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand">{user.averageRating}</div>
                    <div className="text-xs text-gray-600">Avg Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand">{user.achievements.length}</div>
                    <div className="text-xs text-gray-600">Achievements</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="professional-card mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Award className="w-5 h-5 mr-2 text-brand" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {user.achievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{achievement.name}</h4>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="workshops">Workshops</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                {/* About Section */}
                <Card className="professional-card">
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              value={editForm.location || ''}
                              onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="company">Company</Label>
                            <Input
                              id="company"
                              value={editForm.company || ''}
                              onChange={(e) => setEditForm({...editForm, company: e.target.value})}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <textarea
                            id="bio"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            rows={4}
                            value={editForm.bio || ''}
                            onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-700">{user.bio}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Location:</span> {user.location}
                          </div>
                          <div>
                            <span className="font-medium">Company:</span> {user.company}
                          </div>
                          <div>
                            <span className="font-medium">Member since:</span> {user.joinDate.toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Website:</span> 
                            <a href={user.website} className="text-brand hover:underline ml-1">
                              {user.website}
                            </a>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Skills & Interests */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="professional-card">
                    <CardHeader>
                      <CardTitle className="text-lg">Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="professional-card">
                    <CardHeader>
                      <CardTitle className="text-lg">Interests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {user.interests.map((interest) => (
                          <Badge key={interest} variant="outline">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Learning Progress */}
                <Card className="professional-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Learning Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-brand mb-2">{user.completedWorkshops}</div>
                        <div className="text-sm text-gray-600">Workshops Completed</div>
                        <Progress value={(user.completedWorkshops / user.totalWorkshops) * 100} className="mt-2" />
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-brand mb-2">{user.certificatesEarned}</div>
                        <div className="text-sm text-gray-600">Certificates Earned</div>
                        <div className="flex justify-center mt-2">
                          {Array.from({ length: user.certificatesEarned }, (_, i) => (
                            <Award key={i} className="w-4 h-4 text-yellow-500" />
                          ))}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-brand mb-2">{user.averageRating}</div>
                        <div className="text-sm text-gray-600">Average Rating</div>
                        <div className="flex justify-center mt-2">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < Math.floor(user.averageRating) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="workshops">
                <Card className="professional-card">
                  <CardHeader>
                    <CardTitle>My Workshops</CardTitle>
                    <CardDescription>
                      Track your learning journey and upcoming sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Your workshop history will appear here</p>
                      <Link to="/">
                        <Button>Browse Workshops</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements">
                <Card className="professional-card">
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>
                      Celebrate your learning milestones
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.achievements.map((achievement) => (
                        <div key={achievement.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-3xl">{achievement.icon}</div>
                            <div>
                              <h4 className="font-semibold">{achievement.name}</h4>
                              <p className="text-sm text-gray-600">{achievement.description}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">
                            Earned on {achievement.earnedDate.toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <div className="space-y-6">
                  <Card className="professional-card">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Settings className="w-5 h-5 mr-2" />
                        Account Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={user.email} disabled />
                      </div>
                      <Button variant="outline">Change Password</Button>
                    </CardContent>
                  </Card>

                  <Card className="professional-card">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Bell className="w-5 h-5 mr-2" />
                        Notifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Email notifications</span>
                        <input type="checkbox" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Workshop reminders</span>
                        <input type="checkbox" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Achievement notifications</span>
                        <input type="checkbox" defaultChecked />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="professional-card">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Download className="w-5 h-5 mr-2" />
                        Data Export
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Download your learning data and certificates
                      </p>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Download className="w-4 h-4 mr-2" />
                          Download Learning Data
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Award className="w-4 h-4 mr-2" />
                          Download Certificates
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
