import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectBrief, CaseStudy, SolutionPitch, fetchProjectBriefs, fetchCaseStudies, fetchSolutionPitches, createSolutionPitch, updateSolutionPitch } from '@/lib/mockData';
import { User } from '@/lib/auth';
import { Briefcase, BookOpen, FileEdit, Clock, AlertCircle, Target, Lightbulb, Bell, Eye, Edit, Send, CheckCircle, XCircle, MessageSquare, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AssignmentNotifications } from '@/components/team-member/AssignmentNotifications';
import { SolutionPitchForm } from '@/components/solution-pitch/SolutionPitchForm';

interface TeamMemberDashboardProps {
  user: User;
}

export const TeamMemberDashboard = ({ user }: TeamMemberDashboardProps) => {
  const [assignedProjects, setAssignedProjects] = useState<ProjectBrief[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [myPitches, setMyPitches] = useState<SolutionPitch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePitch, setActivePitch] = useState('');
  const [selectedProject, setSelectedProject] = useState<ProjectBrief | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [selectedPitch, setSelectedPitch] = useState<SolutionPitch | null>(null);
  const [showPitchDetailModal, setShowPitchDetailModal] = useState(false);
  const [pitchStatus, setPitchStatus] = useState<'draft' | 'submitted' | 'approved' | 'rejected'>('draft');
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
      
      // Filter projects assigned to this team member
      const assigned = projectsData.filter(p => p.assignedTo === user.email);
      setAssignedProjects(assigned);
      setCaseStudies(caseStudiesData);
      
      // Filter pitches created by this team member
      const myCreatedPitches = pitchesData.filter(p => p.createdBy === user.email);
      setMyPitches(myCreatedPitches);
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

  const handleViewProject = (project: ProjectBrief) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  const handleStartWorking = async (project: ProjectBrief) => {
    try {
      // Update project status to in progress
      const updatedProject = { ...project, status: 'in_progress' as const };
      setAssignedProjects(prev => prev.map(p => p.id === project.id ? updatedProject : p));
      
      toast({
        title: "Started working",
        description: `You've started working on "${project.title}"`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project status",
        variant: "destructive"
      });
    }
  };

  const handleCreatePitch = (project: ProjectBrief) => {
    setSelectedProject(project);
    setShowPitchModal(true);
  };

  const handleViewPitch = (pitch: SolutionPitch) => {
    setSelectedPitch(pitch);
    setShowPitchDetailModal(true);
  };

  const handleEditPitch = (pitch: SolutionPitch) => {
    setSelectedPitch(pitch);
    setShowPitchModal(true);
  };

  const handleSubmitPitch = async () => {
    if (!activePitch.trim() || !selectedProject) return;
    
    try {
      const newPitch = await createSolutionPitch({
        briefId: selectedProject.id,
        title: `Solution for ${selectedProject.title}`,
        content: activePitch,
        status: 'submitted',
        createdBy: user.email,
        clientEmail: selectedProject.submittedBy
      });
      
      setMyPitches(prev => [newPitch, ...prev]);
      setActivePitch('');
      setShowPitchModal(false);
      setSelectedProject(null);
      
      toast({
        title: "Success",
        description: "Solution pitch submitted for review",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit pitch",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePitchStatus = async (pitchId: string, newStatus: 'draft' | 'submitted' | 'approved' | 'rejected') => {
    try {
      await updateSolutionPitch(pitchId, { status: newStatus });
      setMyPitches(prev => prev.map(p => p.id === pitchId ? { ...p, status: newStatus } : p));
      
      toast({
        title: "Status updated",
        description: `Pitch status updated to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update pitch status",
        variant: "destructive"
      });
    }
  };

  const handleDownloadPitch = (pitch: SolutionPitch) => {
    const pitchData = {
      title: pitch.title,
      content: pitch.content,
      status: pitch.status,
      createdAt: pitch.createdAt,
      feedback: pitch.feedback
    };

    const blob = new Blob([JSON.stringify(pitchData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pitch.title.replace(/\s+/g, '_')}_pitch.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Pitch downloaded successfully",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <Target className="h-4 w-4" />;
      case 'approved': return <Target className="h-4 w-4" />;
      default: return <Briefcase className="h-4 w-4" />;
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

  const getPitchStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-muted/10 text-muted-foreground border-muted/20';
      case 'submitted': return 'bg-warning/10 text-warning border-warning/20';
      case 'approved': return 'bg-success/10 text-success border-success/20';
      case 'rejected': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 90) return 'bg-success/10 text-success border-success/20';
    if (score >= 80) return 'bg-info/10 text-info border-info/20';
    if (score >= 70) return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-muted/10 text-muted-foreground border-muted/20';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Team Member Dashboard</h1>
        <p className="text-muted-foreground">Work on assigned projects and create solution pitches</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
              <div>
                <p className="text-sm text-muted-foreground">Assigned Projects</p>
                <p className="text-2xl font-bold text-foreground">{assignedProjects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-info/10 rounded-lg">
                <FileEdit className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">My Pitches</p>
                <p className="text-2xl font-bold text-foreground">{myPitches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-success/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Case Studies</p>
                <p className="text-2xl font-bold text-foreground">{caseStudies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assignments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assignments">My Assignments</TabsTrigger>
          <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
          <TabsTrigger value="pitches">My Pitches</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Projects</CardTitle>
              <CardDescription>
                Projects assigned to you for development and proposal creation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assignedProjects.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No assignments yet</h3>
                  <p className="text-muted-foreground">You'll see your assigned projects here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignedProjects.map((project) => (
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
                          <p className="text-sm text-foreground mt-2">{project.objectives}</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            <strong>Client:</strong> {project.clientDetails}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewProject(project)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {project.status === 'submitted' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStartWorking(project)}
                            >
                              <Target className="h-4 w-4 mr-1" />
                              Start Working
                            </Button>
                          )}
                          <SolutionPitchForm 
                            brief={project} 
                            onSubmit={async (pitch) => {
                              try {
                                const newPitch = await createSolutionPitch({
                                  briefId: project.id,
                                  title: pitch.title,
                                  content: pitch.content,
                                  status: 'submitted',
                                  createdBy: user.email,
                                  clientEmail: project.submittedBy
                                });
                                setMyPitches(prev => [newPitch, ...prev]);
                                toast({
                                  title: "Success",
                                  description: "Solution pitch submitted for review",
                                });
                              } catch (error) {
                                toast({
                                  title: "Error",
                                  description: "Failed to submit pitch",
                                  variant: "destructive"
                                });
                              }
                            }}
                            onSaveDraft={async (pitch) => {
                              try {
                                const newPitch = await createSolutionPitch({
                                  briefId: project.id,
                                  title: pitch.title,
                                  content: pitch.content,
                                  status: 'draft',
                                  createdBy: user.email,
                                  clientEmail: project.submittedBy
                                });
                                setMyPitches(prev => [newPitch, ...prev]);
                                toast({
                                  title: "Draft saved",
                                  description: "Your pitch has been saved as a draft",
                                });
                              } catch (error) {
                                toast({
                                  title: "Error",
                                  description: "Failed to save draft",
                                  variant: "destructive"
                                });
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span>Timeline: {project.timeline}</span>
                        <span>Submitted: {project.createdAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="case-studies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Case Studies</CardTitle>
              <CardDescription>
                Learn from successful projects with relevance scoring
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
                            {study.relevanceScore}% relevant
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{study.industry}</p>
                        <p className="text-sm text-foreground">{study.description}</p>
                        <p className="text-sm text-success mt-2">
                          <strong>Key Outcome:</strong> {study.outcome}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Study Details
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

        <TabsContent value="pitches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Solution Pitches</CardTitle>
              <CardDescription>
                Track your submitted proposals and feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              {myPitches.length === 0 ? (
                <div className="text-center py-8">
                  <FileEdit className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No pitches yet</h3>
                  <p className="text-muted-foreground">Create your first solution pitch from an assigned project</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myPitches.map((pitch) => {
                    const relatedProject = assignedProjects.find(p => p.id === pitch.briefId);
                    return (
                      <div key={pitch.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-foreground">{pitch.title}</h3>
                              <Badge className={getPitchStatusColor(pitch.status)}>
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
                              <div className="mt-3 p-3 bg-success/5 border border-success/20 rounded-lg">
                                <p className="text-sm text-success">
                                  <strong>Manager Feedback:</strong> {pitch.feedback}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewPitch(pitch)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditPitch(pitch)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadPitch(pitch)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            {pitch.status === 'draft' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUpdatePitchStatus(pitch.id, 'submitted')}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span>Created: {pitch.createdAt}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <AssignmentNotifications userEmail={user.email} />
        </TabsContent>
      </Tabs>

      {/* Project Detail Modal */}
      <Dialog open={showProjectModal} onOpenChange={setShowProjectModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedProject?.title}</DialogTitle>
            <DialogDescription>
              Detailed view of your assigned project
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Industry</Label>
                  <p className="text-sm text-muted-foreground">{selectedProject.industry}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Budget</Label>
                  <p className="text-sm text-muted-foreground">{selectedProject.budget}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Timeline</Label>
                  <p className="text-sm text-muted-foreground">{selectedProject.timeline}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedProject.status)}>
                    {selectedProject.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Objectives</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedProject.objectives}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Client Details</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedProject.clientDetails}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Submitted: {selectedProject.createdAt}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Pitch Detail Modal */}
      <Dialog open={showPitchDetailModal} onOpenChange={setShowPitchDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedPitch?.title}</DialogTitle>
            <DialogDescription>
              Detailed view of your solution pitch
            </DialogDescription>
          </DialogHeader>
          {selectedPitch && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getPitchStatusColor(selectedPitch.status)}>
                  {selectedPitch.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Created: {selectedPitch.createdAt}
                </span>
              </div>
              <div>
                <Label className="text-sm font-medium">Content</Label>
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{selectedPitch.content}</p>
                </div>
              </div>
              {selectedPitch.feedback && (
                <div>
                  <Label className="text-sm font-medium">Manager Feedback</Label>
                  <div className="mt-2 p-3 bg-success/5 border border-success/20 rounded-lg">
                    <p className="text-sm text-success">{selectedPitch.feedback}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};