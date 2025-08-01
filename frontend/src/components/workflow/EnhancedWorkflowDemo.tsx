import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnifiedWorkflow } from './UnifiedWorkflow';
import { PitchTemplateSystem } from '../pitch/PitchTemplateSystem';
import { EnhancedDashboard } from '../dashboard/EnhancedDashboard';
import { 
  FileText, 
  Settings, 
  Users, 
  Target,
  Sparkles,
  TrendingUp,
  Activity
} from 'lucide-react';

// Mock workflow steps
const mockWorkflowSteps = [
  {
    id: 'brief-upload',
    title: 'Upload Project Brief',
    description: 'Upload or paste your project requirements',
    icon: FileText,
    status: 'completed' as const,
    component: () => (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Brief Uploaded Successfully</h3>
        <p className="text-muted-foreground">
          Your project brief has been uploaded and parsed successfully.
        </p>
      </div>
    )
  },
  {
    id: 'case-studies',
    title: 'Case Study Recommendations',
    description: 'Review AI-powered case study recommendations',
    icon: Target,
    status: 'active' as const,
    component: () => (
      <div className="text-center py-8">
        <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Case Study Analysis</h3>
        <p className="text-muted-foreground">
          AI is analyzing your brief and finding relevant case studies.
        </p>
        <div className="mt-4">
          <Badge variant="outline" className="flex items-center gap-1 mx-auto w-fit">
            <Activity className="h-3 w-3" />
            Processing...
          </Badge>
        </div>
      </div>
    )
  },
  {
    id: 'pitch-generation',
    title: 'Generate Solution Pitch',
    description: 'Create AI-powered solution pitch',
    icon: Sparkles,
    status: 'pending' as const,
    component: () => (
      <div className="text-center py-8">
        <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Pitch Generation</h3>
        <p className="text-muted-foreground">
          Generate comprehensive solution pitch based on brief and case studies.
        </p>
      </div>
    )
  },
  {
    id: 'review-approval',
    title: 'Review and Approval',
    description: 'Review and approve the generated pitch',
    icon: Settings,
    status: 'pending' as const,
    component: () => (
      <div className="text-center py-8">
        <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Review & Approval</h3>
        <p className="text-muted-foreground">
          Review the generated pitch and approve for submission.
        </p>
      </div>
    )
  }
];

export const EnhancedWorkflowDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('workflow');
  const [selectedUserRole, setSelectedUserRole] = useState<'customer' | 'team_manager' | 'team_member'>('customer');

  const handleStepComplete = (stepId: string) => {
    console.log('Step completed:', stepId);
  };

  const handleWorkflowComplete = () => {
    console.log('Workflow completed!');
  };

  const handleStepChange = (stepId: string) => {
    console.log('Step changed to:', stepId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Workflow & UI/UX Demo</h2>
          <p className="text-muted-foreground">
            Showcasing unified workflow, template system, and enhanced dashboards
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Activity className="h-4 w-4" />
          Live Demo
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="workflow">Unified Workflow</TabsTrigger>
          <TabsTrigger value="templates">Template System</TabsTrigger>
          <TabsTrigger value="dashboard">Enhanced Dashboard</TabsTrigger>
          <TabsTrigger value="features">Features Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="workflow">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Unified Workflow System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UnifiedWorkflow
                steps={mockWorkflowSteps}
                onStepComplete={handleStepComplete}
                onWorkflowComplete={handleWorkflowComplete}
                onStepChange={handleStepChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Pitch Template System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PitchTemplateSystem
                onTemplateSelect={(template) => console.log('Template selected:', template)}
                onTemplateSave={(template) => console.log('Template saved:', template)}
                onTemplateDelete={(templateId) => console.log('Template deleted:', templateId)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Enhanced Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium">Select User Role:</span>
                  <div className="flex gap-2">
                    {(['customer', 'team_manager', 'team_member'] as const).map((role) => (
                      <Button
                        key={role}
                        variant={selectedUserRole === role ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedUserRole(role)}
                      >
                        {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <EnhancedDashboard userRole={selectedUserRole} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Enhanced Pitch Workflow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Pitch Preview
                    </Badge>
                    <span className="text-sm text-muted-foreground">Multiple view modes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Settings className="h-3 w-3" />
                      Template System
                    </Badge>
                    <span className="text-sm text-muted-foreground">Customizable templates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Customization
                    </Badge>
                    <span className="text-sm text-muted-foreground">Advanced editing options</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      Submission Workflow
                    </Badge>
                    <span className="text-sm text-muted-foreground">Approval process</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Workflow Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Unified Workflow
                    </Badge>
                    <span className="text-sm text-muted-foreground">Step-by-step navigation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      Progress Indicators
                    </Badge>
                    <span className="text-sm text-muted-foreground">Visual progress tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      Breadcrumb Navigation
                    </Badge>
                    <span className="text-sm text-muted-foreground">Context-aware navigation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Settings className="h-3 w-3" />
                      State Management
                    </Badge>
                    <span className="text-sm text-muted-foreground">Workflow state tracking</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Enhanced Dashboard Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      Real-time Updates
                    </Badge>
                    <span className="text-sm text-muted-foreground">Live status updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      Brief Processing
                    </Badge>
                    <span className="text-sm text-muted-foreground">Customer dashboard tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Recommendation Tracking
                    </Badge>
                    <span className="text-sm text-muted-foreground">Team manager analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Pitch Generation Progress
                    </Badge>
                    <span className="text-sm text-muted-foreground">Team member tracking</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  UI/UX Improvements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      Responsive Design
                    </Badge>
                    <span className="text-sm text-muted-foreground">Mobile-first approach</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      Progress Indicators
                    </Badge>
                    <span className="text-sm text-muted-foreground">Visual feedback</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Settings className="h-3 w-3" />
                      Interactive Elements
                    </Badge>
                    <span className="text-sm text-muted-foreground">Touch-friendly controls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Performance
                    </Badge>
                    <span className="text-sm text-muted-foreground">Optimized loading</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>System Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Streamlined</div>
              <div className="text-sm text-muted-foreground">Unified workflow experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">Efficient</div>
              <div className="text-sm text-muted-foreground">Real-time progress tracking</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">User-Friendly</div>
              <div className="text-sm text-muted-foreground">Intuitive interface design</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 