import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  FileText, 
  BookOpen, 
  Sparkles, 
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Activity,
  RefreshCw,
  Bell,
  Settings,
  Play,
  Edit3,
  BookOpen as BookOpenIcon,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardItem {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  progress: number;
  lastUpdated: string;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high';
}

interface DashboardStats {
  totalItems: number;
  completedItems: number;
  inProgressItems: number;
  pendingItems: number;
  errorItems: number;
}

interface EnhancedDashboardProps {
  userRole: 'customer' | 'team_manager' | 'team_member';
  className?: string;
}

export const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({
  userRole,
  className
}) => {
  const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    completedItems: 0,
    inProgressItems: 0,
    pendingItems: 0,
    errorItems: 0
  });
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<DashboardItem | null>(null);

  // Mock data based on user role
  useEffect(() => {
    const mockItems: DashboardItem[] = userRole === 'customer' ? [
      {
        id: '1',
        title: 'E-commerce Platform Brief',
        status: 'in_progress',
        progress: 75,
        lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        priority: 'high'
      },
      {
        id: '2',
        title: 'Mobile App Development',
        status: 'completed',
        progress: 100,
        lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium'
      },
      {
        id: '3',
        title: 'CRM Integration Project',
        status: 'pending',
        progress: 0,
        lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        priority: 'low'
      }
    ] : userRole === 'team_manager' ? [
      {
        id: '1',
        title: 'E-commerce Platform Brief',
        status: 'in_progress',
        progress: 75,
        lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'member@pitchforge.com',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Healthcare Management System',
        status: 'completed',
        progress: 100,
        lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'member@pitchforge.com',
        priority: 'medium'
      },
      {
        id: '3',
        title: 'Financial Analytics Dashboard',
        status: 'pending',
        progress: 0,
        lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        priority: 'low'
      },
      {
        id: '4',
        title: 'Educational Platform',
        status: 'error',
        progress: 45,
        lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'member@pitchforge.com',
        priority: 'high'
      }
    ] : [
      {
        id: '1',
        title: 'E-commerce Platform Brief',
        status: 'in_progress',
        progress: 75,
        lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        priority: 'high'
      },
      {
        id: '2',
        title: 'Healthcare Management System',
        status: 'completed',
        progress: 100,
        lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium'
      }
    ];

    setDashboardItems(mockItems);
    updateStats(mockItems);
  }, [userRole]);

  const updateStats = (items: DashboardItem[]) => {
    const newStats: DashboardStats = {
      totalItems: items.length,
      completedItems: items.filter(item => item.status === 'completed').length,
      inProgressItems: items.filter(item => item.status === 'in_progress').length,
      pendingItems: items.filter(item => item.status === 'pending').length,
      errorItems: items.filter(item => item.status === 'error').length
    };
    setStats(newStats);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  // Team member action handlers
  const handleStartWorking = (item: DashboardItem) => {
    console.log('Starting work on:', item.title);
    // Update item status to in_progress
    setDashboardItems(prev => {
      const updatedItems = prev.map(i => 
        i.id === item.id 
          ? { ...i, status: 'in_progress' as const, progress: Math.min(i.progress + 25, 100) }
          : i
      );
      updateStats(updatedItems);
      return updatedItems;
    });
  };

  const handleViewStudyDetails = (item: DashboardItem) => {
    console.log('Viewing study details for:', item.title);
    setSelectedItem(item);
    setActiveModal('study-details');
  };

  const handleEditPitch = (item: DashboardItem) => {
    console.log('Editing pitch for:', item.title);
    setSelectedItem(item);
    setActiveModal('edit-pitch');
  };

  const handleViewPitch = (item: DashboardItem) => {
    console.log('Viewing pitch for:', item.title);
    setSelectedItem(item);
    setActiveModal('view-pitch');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedItem(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-green-600 bg-green-100';
    }
  };

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Items</p>
              <p className="text-2xl font-bold">{stats.totalItems}</p>
            </div>
            <Activity className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgressItems}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedItems}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Errors</p>
              <p className="text-2xl font-bold text-red-600">{stats.errorItems}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDashboardItem = (item: DashboardItem) => (
    <Card key={item.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="font-medium">{item.title}</h3>
              {getStatusIcon(item.status)}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn("text-xs", getPriorityColor(item.priority))}>
                {item.priority} Priority
              </Badge>
              {item.assignedTo && (
                <Badge variant="secondary" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  {item.assignedTo}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            {userRole === 'team_member' ? (
              <>
                {item.status === 'pending' && (
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleStartWorking(item)}
                    className="flex items-center gap-1"
                  >
                    <Play className="h-3 w-3" />
                    Start Working
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewStudyDetails(item)}
                  className="flex items-center gap-1"
                >
                  <BookOpenIcon className="h-3 w-3" />
                  Study Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditPitch(item)}
                  className="flex items-center gap-1"
                >
                  <Edit3 className="h-3 w-3" />
                  Edit Pitch
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewPitch(item)}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" />
                  View Pitch
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm">
                  <Eye className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{item.progress}%</span>
            </div>
            <Progress value={item.progress} className="h-2" />
          </div>
          <div className="text-xs text-muted-foreground">
            Last updated: {new Date(item.lastUpdated).toLocaleString()}
          </div>
          {userRole === 'team_member' && item.status === 'in_progress' && (
            <div className="flex gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleViewStudyDetails(item)}
                className="flex items-center gap-1"
              >
                <BookOpenIcon className="h-3 w-3" />
                Case Studies
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleEditPitch(item)}
                className="flex items-center gap-1"
              >
                <Edit3 className="h-3 w-3" />
                Continue Pitch
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderCustomerDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customer Dashboard</h2>
          <p className="text-muted-foreground">
            Track your project briefs and solution pitches
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing} className="flex items-center gap-2">
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {renderStatsCards()}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Your Project Briefs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardItems.map(item => renderDashboardItem(item))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTeamManagerDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Manager Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor team performance and project assignments
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing} className="flex items-center gap-2">
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {renderStatsCards()}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardItems.map(item => renderDashboardItem(item))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Case Study Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Case Study Management</h3>
                <p className="text-muted-foreground">
                  Manage case study assignments and recommendations
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground">
                  View team performance metrics and insights
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderTeamMemberDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Member Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your assigned tasks and pitch generation
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing} className="flex items-center gap-2">
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {renderStatsCards()}

      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="pitches">Pitch Generation</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Assigned Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardItems.map(item => renderDashboardItem(item))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pitches">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Pitch Generation Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Pitch Generation</h3>
                <p className="text-muted-foreground">
                  Track your pitch generation progress and status
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Notifications</h3>
                <p className="text-muted-foreground">
                  View your recent notifications and updates
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Modal components for team member actions
  const renderStudyDetailsModal = () => (
    <Dialog open={activeModal === 'study-details'} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpenIcon className="h-5 w-5" />
            Case Study Details - {selectedItem?.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recommended Case Studies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">E-commerce Platform for RetailCorp</h4>
                      <Badge variant="outline" className="text-xs">92% Match</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Built scalable e-commerce platform with payment integration
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">Technology</Badge>
                      <Badge variant="secondary" className="text-xs">$80,000</Badge>
                      <Badge variant="secondary" className="text-xs">4 months</Badge>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Healthcare Management System</h4>
                      <Badge variant="outline" className="text-xs">85% Match</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      HIPAA-compliant healthcare management system
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">Healthcare</Badge>
                      <Badge variant="secondary" className="text-xs">$120,000</Badge>
                      <Badge variant="secondary" className="text-xs">6 months</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Similarity Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Industry Match</span>
                      <span>100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Budget Compatibility</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Timeline Compatibility</span>
                      <span>90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Content Similarity</span>
                      <span>88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCloseModal}>
              Close
            </Button>
            <Button onClick={() => {
              handleCloseModal();
              handleEditPitch(selectedItem!);
            }}>
              Use These Studies
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderEditPitchModal = () => (
    <Dialog open={activeModal === 'edit-pitch'} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Edit Pitch - {selectedItem?.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pitch Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Executive Summary</label>
                    <textarea 
                      className="w-full mt-1 p-2 border rounded-md text-sm"
                      rows={3}
                      defaultValue="Comprehensive e-commerce solution for your business needs..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Technical Approach</label>
                    <textarea 
                      className="w-full mt-1 p-2 border rounded-md text-sm"
                      rows={4}
                      defaultValue="Our solution leverages modern technologies including React, Node.js, and PostgreSQL..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Timeline & Budget</label>
                    <textarea 
                      className="w-full mt-1 p-2 border rounded-md text-sm"
                      rows={2}
                      defaultValue="Project timeline: 4-6 months with budget of $75,000 - $125,000..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Case Study Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">E-commerce Platform for RetailCorp</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Similar project with 40% increase in sales and improved user experience
                    </p>
                    <Badge variant="outline" className="text-xs">Integrated</Badge>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">Healthcare Management System</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      HIPAA-compliant system with improved patient care outcomes
                    </p>
                    <Badge variant="outline" className="text-xs">Integrated</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={() => {
              handleCloseModal();
              // Update progress
              setDashboardItems(prev => {
                const updatedItems = prev.map(i => 
                  i.id === selectedItem?.id 
                    ? { ...i, progress: Math.min(i.progress + 30, 100) }
                    : i
                );
                updateStats(updatedItems);
                return updatedItems;
              });
            }}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderViewPitchModal = () => (
    <Dialog open={activeModal === 'view-pitch'} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            View Pitch - {selectedItem?.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Final Pitch Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Executive Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    We are excited to present our comprehensive e-commerce solution for your business needs. 
                    Our approach leverages cutting-edge technologies and proven methodologies to deliver exceptional results.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Technical Approach</h3>
                  <p className="text-sm text-muted-foreground">
                    Our solution utilizes modern technology stack including React frontend, Node.js backend, 
                    and PostgreSQL database to ensure scalability, security, and performance.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Case Study Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Based on our successful implementation for RetailCorp, we achieved 40% increase in sales 
                    and significantly improved user experience through our scalable e-commerce platform.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Timeline & Budget</h3>
                  <p className="text-sm text-muted-foreground">
                    Project timeline: 4-6 months with budget of $75,000 - $125,000, including 
                    development, testing, and deployment phases.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Request Review
            </Button>
            <Button>
              Submit for Approval
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {userRole === 'customer' && renderCustomerDashboard()}
      {userRole === 'team_manager' && renderTeamManagerDashboard()}
      {userRole === 'team_member' && renderTeamMemberDashboard()}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-time Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <span>Last updated: {lastRefresh.toLocaleString()}</span>
            <Badge variant="outline" className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Live Updates
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Modal components for team member actions */}
      {userRole === 'team_member' && (
        <>
          {renderStudyDetailsModal()}
          {renderEditPitchModal()}
          {renderViewPitchModal()}
        </>
      )}
    </div>
  );
}; 