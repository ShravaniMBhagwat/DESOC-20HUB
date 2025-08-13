import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import {
  Clock, Trophy, TrendingUp, BookOpen, Target, Award,
  Calendar, Users, Brain, Zap, CheckCircle, Star,
  BarChart3, PieChart, Activity, Timer, Flame,
  ArrowUpRight, ArrowDownRight, Plus, Eye
} from 'lucide-react';

interface LearningStats {
  totalHours: number;
  thisWeekHours: number;
  examsCompleted: number;
  averageScore: number;
  coursesEnrolled: number;
  coursesCompleted: number;
  certificatesEarned: number;
  currentStreak: number;
  longestStreak: number;
  skillsLearned: string[];
  recentActivities: Array<{
    id: string;
    type: 'quiz' | 'exam' | 'workshop' | 'achievement';
    title: string;
    date: string;
    score?: number;
    status: 'completed' | 'in-progress' | 'upcoming';
  }>;
  weeklyProgress: Array<{
    day: string;
    hours: number;
  }>;
  topSkills: Array<{
    skill: string;
    level: number;
    progress: number;
  }>;
  upcomingDeadlines: Array<{
    id: string;
    title: string;
    type: string;
    date: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

const mockLearningStats: LearningStats = {
  totalHours: 127.5,
  thisWeekHours: 12.3,
  examsCompleted: 8,
  averageScore: 87.5,
  coursesEnrolled: 12,
  coursesCompleted: 7,
  certificatesEarned: 5,
  currentStreak: 7,
  longestStreak: 23,
  skillsLearned: ['React', 'TypeScript', 'Node.js', 'Python', 'Machine Learning', 'Cloud Computing'],
  recentActivities: [
    {
      id: '1',
      type: 'quiz',
      title: 'React Fundamentals Quiz',
      date: '2025-01-26',
      score: 92,
      status: 'completed'
    },
    {
      id: '2',
      type: 'workshop',
      title: 'Advanced TypeScript Workshop',
      date: '2025-01-25',
      status: 'completed'
    },
    {
      id: '3',
      type: 'exam',
      title: 'Full Stack Certification Exam',
      date: '2025-01-24',
      score: 85,
      status: 'completed'
    },
    {
      id: '4',
      type: 'achievement',
      title: 'Earned Python Expert Certificate',
      date: '2025-01-23',
      status: 'completed'
    },
    {
      id: '5',
      type: 'workshop',
      title: 'Machine Learning Bootcamp',
      date: '2025-01-30',
      status: 'upcoming'
    }
  ],
  weeklyProgress: [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 1.8 },
    { day: 'Wed', hours: 3.2 },
    { day: 'Thu', hours: 2.1 },
    { day: 'Fri', hours: 1.5 },
    { day: 'Sat', hours: 0.8 },
    { day: 'Sun', hours: 0.4 }
  ],
  topSkills: [
    { skill: 'JavaScript', level: 8, progress: 85 },
    { skill: 'React', level: 7, progress: 78 },
    { skill: 'Python', level: 6, progress: 65 },
    { skill: 'TypeScript', level: 5, progress: 52 },
    { skill: 'Node.js', level: 4, progress: 43 }
  ],
  upcomingDeadlines: [
    {
      id: '1',
      title: 'Machine Learning Project Submission',
      type: 'Assignment',
      date: '2025-02-01',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Cloud Computing Certification Exam',
      type: 'Exam',
      date: '2025-02-05',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'DevOps Workshop Registration',
      type: 'Registration',
      date: '2025-02-08',
      priority: 'low'
    }
  ]
};

const achievementBadges = [
  { name: 'Fast Learner', description: 'Completed 5 courses in a month', icon: '⚡', earned: true },
  { name: 'Perfect Score', description: 'Scored 100% on an exam', icon: '🎯', earned: true },
  { name: 'Streak Master', description: '20+ day learning streak', icon: '🔥', earned: true },
  { name: 'Skill Collector', description: 'Learned 10+ skills', icon: '🎓', earned: false },
  { name: 'Community Helper', description: 'Helped 50+ peers', icon: '🤝', earned: false },
  { name: 'Innovation Leader', description: 'Led a successful project', icon: '🚀', earned: true }
];

export default function Dashboard() {
  const [stats] = useState<LearningStats>(mockLearningStats);
  const [activeTab, setActiveTab] = useState('overview');

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz': return Brain;
      case 'exam': return Trophy;
      case 'workshop': return BookOpen;
      case 'achievement': return Award;
      default: return CheckCircle;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'quiz': return 'text-blue-600';
      case 'exam': return 'text-yellow-600';
      case 'workshop': return 'text-green-600';
      case 'achievement': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const maxWeeklyHours = Math.max(...stats.weeklyProgress.map(p => p.hours));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/20 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500/10 to-blue-600/10 rounded-full mb-4">
              <Activity className="w-4 h-4 text-teal-600 mr-2" />
              <span className="text-sm font-semibold text-teal-700">Learning Analytics</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Your Learning
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600"> Dashboard</span>
            </h1>
            <p className="text-lg text-gray-600">Track your progress and stay motivated on your learning journey</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Current Streak</p>
            <div className="flex items-center">
              <Flame className="w-6 h-6 text-orange-500 mr-2" />
              <span className="text-2xl font-bold text-gray-900">{stats.currentStreak} days</span>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="professional-card bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-teal-700">Total Hours</p>
                      <p className="text-3xl font-bold text-teal-900">{stats.totalHours}</p>
                      <p className="text-xs text-teal-600">+{stats.thisWeekHours} this week</p>
                    </div>
                    <Clock className="w-8 h-8 text-teal-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="professional-card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">Exams Completed</p>
                      <p className="text-3xl font-bold text-blue-900">{stats.examsCompleted}</p>
                      <p className="text-xs text-blue-600">{stats.averageScore}% avg score</p>
                    </div>
                    <Trophy className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="professional-card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">Courses</p>
                      <p className="text-3xl font-bold text-green-900">{stats.coursesCompleted}/{stats.coursesEnrolled}</p>
                      <p className="text-xs text-green-600">{Math.round((stats.coursesCompleted / stats.coursesEnrolled) * 100)}% completed</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="professional-card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">Certificates</p>
                      <p className="text-3xl font-bold text-purple-900">{stats.certificatesEarned}</p>
                      <p className="text-xs text-purple-600">Professional level</p>
                    </div>
                    <Award className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Upcoming Deadlines */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="professional-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-teal-600" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest learning activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentActivities.slice(0, 5).map((activity) => {
                      const IconComponent = getActivityIcon(activity.type);
                      return (
                        <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg bg-white shadow-sm mr-3`}>
                              <IconComponent className={`w-4 h-4 ${getActivityColor(activity.type)}`} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{activity.title}</p>
                              <p className="text-sm text-gray-600">{formatDate(activity.date)}</p>
                            </div>
                          </div>
                          {activity.score && (
                            <Badge className="bg-teal-100 text-teal-800">
                              {activity.score}%
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="professional-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                    Upcoming Deadlines
                  </CardTitle>
                  <CardDescription>Stay on top of your commitments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.upcomingDeadlines.map((deadline) => (
                      <div key={deadline.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{deadline.title}</p>
                          <p className="text-sm text-gray-600">{deadline.type} • {formatDate(deadline.date)}</p>
                        </div>
                        <Badge className={getPriorityColor(deadline.priority)}>
                          {deadline.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-8">
            {/* Weekly Progress Chart */}
            <Card className="professional-card">
              <CardHeader>
                <CardTitle>Weekly Learning Hours</CardTitle>
                <CardDescription>Your daily learning time this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.weeklyProgress.map((day, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">{day.hours}h</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(day.hours / maxWeeklyHours) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-teal-600">{stats.thisWeekHours}h</p>
                    <p className="text-sm text-gray-600">This Week</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{(stats.thisWeekHours / 7).toFixed(1)}h</p>
                    <p className="text-sm text-gray-600">Daily Average</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{stats.longestStreak}</p>
                    <p className="text-sm text-gray-600">Longest Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Trend */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="professional-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Performance Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-green-600 mb-2">+15%</p>
                    <p className="text-gray-600">Improvement this month</p>
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">You're performing better than 78% of learners!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="professional-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600" />
                    Weekly Goal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Learning Hours</span>
                      <span className="text-sm text-gray-600">{stats.thisWeekHours}/15h</span>
                    </div>
                    <Progress value={(stats.thisWeekHours / 15) * 100} className="h-3" />
                    <p className="text-sm text-gray-600">
                      {15 - stats.thisWeekHours > 0 
                        ? `${(15 - stats.thisWeekHours).toFixed(1)} hours left to reach your goal` 
                        : "Goal achieved! Great work! 🎉"
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-8">
            {/* Skills Overview */}
            <Card className="professional-card">
              <CardHeader>
                <CardTitle>Skill Development</CardTitle>
                <CardDescription>Track your expertise across different technologies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stats.topSkills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{skill.skill}</span>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-2">Level {skill.level}</span>
                          <Badge variant="outline">{skill.progress}%</Badge>
                        </div>
                      </div>
                      <Progress value={skill.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills Learned */}
            <Card className="professional-card">
              <CardHeader>
                <CardTitle>Skills Mastered</CardTitle>
                <CardDescription>Technologies and concepts you've learned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {stats.skillsLearned.map((skill, index) => (
                    <Badge key={index} className="bg-teal-100 text-teal-800 px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-8">
            {/* Achievement Badges */}
            <Card className="professional-card">
              <CardHeader>
                <CardTitle>Achievement Badges</CardTitle>
                <CardDescription>Celebrate your learning milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievementBadges.map((badge, index) => (
                    <div 
                      key={index} 
                      className={`p-6 rounded-xl border-2 text-center transition-all duration-300 ${
                        badge.earned 
                          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg' 
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="text-4xl mb-3">{badge.icon}</div>
                      <h3 className={`font-semibold mb-2 ${badge.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                        {badge.name}
                      </h3>
                      <p className={`text-sm ${badge.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                        {badge.description}
                      </p>
                      {badge.earned && (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto mt-3" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certificates */}
            <Card className="professional-card">
              <CardHeader>
                <CardTitle>Certificates Earned</CardTitle>
                <CardDescription>Your professional certifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: stats.certificatesEarned }, (_, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-200">
                      <div className="flex items-center">
                        <Award className="w-8 h-8 text-teal-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Professional Certificate {index + 1}</p>
                          <p className="text-sm text-gray-600">Earned on Jan {20 + index}, 2025</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
