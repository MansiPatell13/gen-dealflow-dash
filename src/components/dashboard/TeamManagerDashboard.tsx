import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectBrief, CaseStudy, SolutionPitch, fetchProjectBriefs, fetchCaseStudies, fetchSolutionPitches } from '@/lib/mockData';
import { User } from '@/lib/auth';
import { Users, FileText, TrendingUp, Clock, CheckCircle, AlertCircle, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TeamManagerDashboardProps {
  user: User;
}

export const TeamManagerDashboard = ({ user }: TeamManagerDashboardProps) => {
  const [projects, setProjects] = useState<ProjectBrief[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [pitches, setPitches] = useState<SolutionPitch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsData, caseStudiesData, pitchesData] = await Promise.all([
        fetchProjectBriefs(),
        fetchCaseStudies(),
        fetchSolutionPitches()
      ]);
      setProjects(projectsData);
      setCaseStudies(caseStudiesData);
      setPitches(pitchesData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-warning/10 text-warning border-warning/20';
      case 'in_progress': return 'bg-info/10 text-info border-info/20';
      case 'completed': return 'bg-success/10 text-success border-success/20';
      case 'approved': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 90) return 'bg-success/10 text-success border-success/20';
    if (score >= 80) return 'bg-info/10 text-info border-info/20';
    if (score >= 70) return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-muted/10 text-muted-foreground border-muted/20';
  };

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'in_progress').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    pendingApproval: pitches.filter(p => p.status === 'submitted').length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Team Manager Dashboard</h1>
        <p className="text-muted-foreground">Oversee projects, assign tasks, and manage team performance</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-info/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-foreground">{stats.activeProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">{stats.completedProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-warning/10 rounded-lg">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold text-foreground">{stats.pendingApproval}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Project Management</TabsTrigger>
          <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Portfolio</CardTitle>
              <CardDescription>
                Manage and assign project briefs to team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-foreground">{project.title}</h3>
                          <Badge className={getStatusColor(project.status)}>
                            {getStatusIcon(project.status)}
                            {project.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{project.industry} • {project.budget}</p>
                        <p className="text-sm text-muted-foreground mt-1">{project.objectives}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          {project.assignedTo ? 'Reassign' : 'Assign'}
                        </Button>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span>Client: {project.submittedBy}</span>
                      <span>Timeline: {project.timeline}</span>
                      {project.assignedTo && <span>Assigned to: {project.assignedTo}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="case-studies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Case Study Library</CardTitle>
              <CardDescription>
                Recommended case studies with relevance scoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {caseStudies.map((study) => (
                  <div key={study.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-foreground">{study.title}</h3>
                          <Badge className={getRelevanceColor(study.relevanceScore)}>
                            <Target className="h-3 w-3 mr-1" />
                            {study.relevanceScore}% relevance
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{study.industry}</p>
                        <p className="text-sm text-foreground">{study.description}</p>
                        <p className="text-sm text-success mt-2">
                          <strong>Outcome:</strong> {study.outcome}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Full Case
                      </Button>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {study.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proposals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Solution Pitches</CardTitle>
              <CardDescription>
                Review and approve proposals before client delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pitches.map((pitch) => {
                  const relatedProject = projects.find(p => p.id === pitch.briefId);
                  return (
                    <div key={pitch.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-foreground">{pitch.title}</h3>
                            <Badge className={getStatusColor(pitch.status)}>
                              {pitch.status}
                            </Badge>
                          </div>
                          {relatedProject && (
                            <p className="text-sm text-muted-foreground">
                              Project: {relatedProject.title}
                            </p>
                          )}
                          <p className="text-sm text-foreground mt-2">{pitch.content}</p>
                          {pitch.feedback && (
                            <p className="text-sm text-success mt-2">
                              <strong>Feedback:</strong> {pitch.feedback}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {pitch.status === 'submitted' && (
                            <>
                              <Button variant="outline" size="sm">
                                Request Changes
                              </Button>
                              <Button size="sm">
                                Approve
                              </Button>
                            </>
                          )}
                          <Button variant="outline" size="sm">
                            View Full
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span>Created by: {pitch.createdBy}</span>
                        <span>Date: {pitch.createdAt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};