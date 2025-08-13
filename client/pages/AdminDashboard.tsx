import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, Plus, Edit, Trash2, Users, TrendingUp, 
  Calendar, DollarSign, Star, Eye, MessageSquare,
  Filter, Download, Upload, Settings, MoreHorizontal
} from 'lucide-react';
import { workshopsData, Workshop } from '@/data/workshops';

interface AdminStats {
  totalUsers: number;
  totalWorkshops: number;
  totalRevenue: number;
  averageRating: number;
  activeRegistrations: number;
  completionRate: number;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: Date;
  workshopsCompleted: number;
  totalSpent: number;
  status: 'active' | 'inactive';
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [workshops, setWorkshops] = useState<Workshop[]>(workshopsData);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1247,
    totalWorkshops: workshopsData.length,
    totalRevenue: 45680,
    averageRating: 4.7,
    activeRegistrations: 156,
    completionRate: 92
  });

  const [users] = useState<UserData[]>([
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      joinDate: new Date('2024-01-15'),
      workshopsCompleted: 8,
      totalSpent: 1120,
      status: 'active'
    },
    {
      id: '2',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e23e84?w=150&h=150&fit=crop&crop=face',
      joinDate: new Date('2024-02-20'),
      workshopsCompleted: 12,
      totalSpent: 1560,
      status: 'active'
    },
    {
      id: '3',
      name: 'Mike Rodriguez',
      email: 'mike@example.com',
      joinDate: new Date('2024-03-10'),
      workshopsCompleted: 3,
      totalSpent: 340,
      status: 'inactive'
    }
  ]);

  const handleEditWorkshop = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsEditing(true);
  };

  const handleDeleteWorkshop = (workshopId: string) => {
    setWorkshops(workshops.filter(w => w.id !== workshopId));
  };

  const handleSaveWorkshop = () => {
    if (selectedWorkshop) {
      setWorkshops(workshops.map(w => 
        w.id === selectedWorkshop.id ? selectedWorkshop : w
      ));
      setIsEditing(false);
      setSelectedWorkshop(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Platform
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage workshops and users</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Workshop
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workshops">Workshops</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="professional-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-3xl font-bold text-brand">{stats.totalUsers}</p>
                    </div>
                    <Users className="w-8 h-8 text-brand" />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="text-green-600">↗ 12%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="professional-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-3xl font-bold text-brand">${stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-brand" />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="text-green-600">↗ 8%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="professional-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                      <p className="text-3xl font-bold text-brand">{stats.averageRating}</p>
                    </div>
                    <Star className="w-8 h-8 text-brand" />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="text-green-600">↗ 0.2</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="professional-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                      <p className="text-3xl font-bold text-brand">{stats.completionRate}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-brand" />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="text-green-600">↗ 3%</span> from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="professional-card">
                <CardHeader>
                  <CardTitle>Recent Registrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">Joined {user.joinDate.toLocaleDateString()}</p>
                        </div>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="professional-card">
                <CardHeader>
                  <CardTitle>Top Performing Workshops</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workshops.slice(0, 5).map((workshop) => (
                      <div key={workshop.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{workshop.name}</p>
                          <p className="text-sm text-gray-600">{workshop.rating} ⭐ • {workshop.reviewCount} reviews</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${workshop.price}</p>
                          <p className="text-sm text-gray-600">{workshop.registeredUsers.length} enrolled</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workshops" className="space-y-6">
            {/* Workshop Management Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Workshop Management</h2>
                <p className="text-gray-600">Create and manage your workshops</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Workshop
                </Button>
              </div>
            </div>

            {/* Workshop List */}
            <Card className="professional-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-700">Workshop</th>
                        <th className="text-left p-4 font-medium text-gray-700">Instructor</th>
                        <th className="text-left p-4 font-medium text-gray-700">Date</th>
                        <th className="text-left p-4 font-medium text-gray-700">Enrolled</th>
                        <th className="text-left p-4 font-medium text-gray-700">Revenue</th>
                        <th className="text-left p-4 font-medium text-gray-700">Rating</th>
                        <th className="text-left p-4 font-medium text-gray-700">Status</th>
                        <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workshops.map((workshop) => (
                        <tr key={workshop.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={workshop.imageUrl} 
                                alt={workshop.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                              <div>
                                <p className="font-medium">{workshop.name}</p>
                                <p className="text-sm text-gray-600">{workshop.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-medium">{workshop.instructor}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-sm">{workshop.date}</p>
                            <p className="text-sm text-gray-600">{workshop.time}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-medium">{workshop.registeredUsers.length}/{workshop.capacity}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-medium">${(workshop.registeredUsers.length * workshop.price).toLocaleString()}</p>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span>{workshop.rating}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant={workshop.registeredUsers.length === workshop.capacity ? 'destructive' : 'default'}>
                              {workshop.registeredUsers.length === workshop.capacity ? 'Full' : 'Available'}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditWorkshop(workshop)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteWorkshop(workshop.id)}>
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* User Management */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">User Management</h2>
                <p className="text-gray-600">Manage platform users and their access</p>
              </div>
              <div className="flex items-center space-x-2">
                <Input placeholder="Search users..." className="w-64" />
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <Card className="professional-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-700">User</th>
                        <th className="text-left p-4 font-medium text-gray-700">Join Date</th>
                        <th className="text-left p-4 font-medium text-gray-700">Workshops</th>
                        <th className="text-left p-4 font-medium text-gray-700">Total Spent</th>
                        <th className="text-left p-4 font-medium text-gray-700">Status</th>
                        <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="text-sm">{user.joinDate.toLocaleDateString()}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-medium">{user.workshopsCompleted}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-medium">${user.totalSpent}</p>
                          </td>
                          <td className="p-4">
                            <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Analytics Dashboard</h2>
              <p className="text-gray-600">Track performance and insights</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="professional-card">
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Revenue chart would go here</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="professional-card">
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">User growth chart would go here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Platform Settings</h2>
              <p className="text-gray-600">Configure your workshop platform</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="professional-card">
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input id="platform-name" defaultValue="WorkshopHub" />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input id="contact-email" defaultValue="admin@workshophub.com" />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>

              <Card className="professional-card">
                <CardHeader>
                  <CardTitle>Payment Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                    <Input id="tax-rate" defaultValue="8.5" type="number" />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
