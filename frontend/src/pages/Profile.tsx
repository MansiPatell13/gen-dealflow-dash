import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  User,
  Mail,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  FileText,
  BookOpen,
  Sparkles,
  Activity,
  Settings,
  Edit3,
  Camera,
  Download,
  Share2
} from 'lucide-react';
import { User as UserType } from '@/lib/auth';

interface ProfileProps {
  user: UserType;
  onBack: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user statistics
  const userStats = {
    totalProjects: 12,
    completedProjects: 8,
    activeProjects: 3,
    totalPitches: 15,
    approvedPitches: 12,
    averageRating: 4.7,
    memberSince: '2023-06-15',
    lastActive: '2024-01-15T10:30:00Z'
  };

  // Mock activity history
  const activityHistory = [
    {
      id: '1',
      type: 'pitch_created',
      title: 'Created pitch for E-commerce Platform',
      description: 'Generated comprehensive solution pitch',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'completed'
    },
    {
      id: '2',
      type: 'brief_assigned',
      title: 'Assigned Healthcare Management Brief',
      description: 'New project brief assigned by team manager',
      timestamp: '2024-01-14T14:20:00Z',
      status: 'in_progress'
    },
    {
      id: '3',
      type: 'pitch_approved',
      title: 'Pitch approved for RetailCorp',
      description: 'Solution pitch approved by team manager',
      timestamp: '2024-01-13T09:15:00Z',
      status: 'completed'
    },
    {
      id: '4',
      type: 'case_study_reviewed',
      title: 'Reviewed case study recommendations',
      description: 'Analyzed 5 recommended case studies',
      timestamp: '2024-01-12T16:45:00Z',
      status: 'completed'
    }
  ];

  // Mock recent projects
  const recentProjects = [
    {
      id: '1',
      title: 'E-commerce Platform Development',
      status: 'completed',
      progress: 100,
      industry: 'Technology',
      budget: '$80,000',
      timeline: '4 months',
      rating: 4.8
    },
    {
      id: '2',
      title: 'Healthcare Management System',
      status: 'in_progress',
      progress: 75,
      industry: 'Healthcare',
      budget: '$120,000',
      timeline: '6 months',
      rating: null
    },
    {
      id: '3',
      title: 'Financial Analytics Dashboard',
      status: 'pending',
      progress: 0,
      industry: 'Finance',
      budget: '$95,000',
      timeline: '5 months',
      rating: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'pitch_created':
        return <Sparkles className="h-4 w-4" />;
      case 'brief_assigned':
        return <FileText className="h-4 w-4" />;
      case 'pitch_approved':
        return <Award className="h-4 w-4" />;
      case 'case_study_reviewed':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">
              View and manage your account information and activity
            </p>
          </div>
          <Button onClick={onBack} variant="outline">
            Back to Dashboard
          </Button>
        </div>

        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                <AvatarFallback className="text-2xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="capitalize">
                      {user.role.replace('_', ' ')}
                    </Badge>
                    <Badge variant="secondary">
                      Member since {new Date(userStats.memberSince).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="text-sm text-muted-foreground">Performance Rating</div>
                <div className="text-2xl font-bold text-green-600">{userStats.averageRating}/5.0</div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  +0.2 this month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                      <p className="text-2xl font-bold">{userStats.totalProjects}</p>
                    </div>
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold text-green-600">{userStats.completedProjects}</p>
                    </div>
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                      <p className="text-2xl font-bold text-blue-600">{userStats.activeProjects}</p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {Math.round((userStats.approvedPitches / userStats.totalPitches) * 100)}%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityHistory.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="mt-1">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{activity.title}</h4>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="outline" className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Project Completion</span>
                        <span>{Math.round((userStats.completedProjects / userStats.totalProjects) * 100)}%</span>
                      </div>
                      <Progress value={(userStats.completedProjects / userStats.totalProjects) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Pitch Approval Rate</span>
                        <span>{Math.round((userStats.approvedPitches / userStats.totalPitches) * 100)}%</span>
                      </div>
                      <Progress value={(userStats.approvedPitches / userStats.totalPitches) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Average Rating</span>
                        <span>{userStats.averageRating}/5.0</span>
                      </div>
                      <Progress value={(userStats.averageRating / 5) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityHistory.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline" className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{project.title}</h4>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{project.industry}</Badge>
                            <Badge variant="outline">{project.budget}</Badge>
                            <Badge variant="outline">{project.timeline}</Badge>
                            {project.rating && (
                              <Badge variant="secondary">
                                ⭐ {project.rating}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                          <div className="mt-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Achievements & Awards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <Award className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                    <h4 className="font-medium">Top Performer</h4>
                    <p className="text-sm text-muted-foreground">Highest rating this month</p>
                    <Badge variant="secondary" className="mt-2">Achieved</Badge>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <h4 className="font-medium">Consistent Excellence</h4>
                    <p className="text-sm text-muted-foreground">5 projects completed on time</p>
                    <Badge variant="secondary" className="mt-2">Achieved</Badge>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Sparkles className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-medium">Innovation Award</h4>
                    <p className="text-sm text-muted-foreground">Creative solution approach</p>
                    <Badge variant="outline" className="mt-2">In Progress</Badge>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <BookOpen className="h-12 w-12 text-purple-500 mx-auto mb-2" />
                    <h4 className="font-medium">Case Study Master</h4>
                    <p className="text-sm text-muted-foreground">Reviewed 50+ case studies</p>
                    <Badge variant="outline" className="mt-2">In Progress</Badge>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <FileText className="h-12 w-12 text-orange-500 mx-auto mb-2" />
                    <h4 className="font-medium">Pitch Perfect</h4>
                    <p className="text-sm text-muted-foreground">10 pitches approved in a row</p>
                    <Badge variant="outline" className="mt-2">In Progress</Badge>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Activity className="h-12 w-12 text-red-500 mx-auto mb-2" />
                    <h4 className="font-medium">Speed Demon</h4>
                    <p className="text-sm text-muted-foreground">Complete project in record time</p>
                    <Badge variant="outline" className="mt-2">In Progress</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}; 