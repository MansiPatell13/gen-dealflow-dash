import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ProjectBrief, CaseStudy, SolutionPitch, fetchProjectBriefs, fetchCaseStudies, fetchSolutionPitches, updateProjectBrief } from '@/lib/mockData';
import { User } from '@/lib/auth';
import { Users, FileText, TrendingUp, Clock, CheckCircle, AlertCircle, Target, BarChart3, UserCheck, Eye, Edit, Trash2, Send, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AssignmentPanel } from '@/components/assignment/AssignmentPanel';
import { CaseStudyManager } from '@/components/case-studies/CaseStudyManager';
import { PitchReviewPanel } from '@/components/solution-pitch/PitchReviewPanel';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { ProposalViewModal } from '@/components/proposals/ProposalViewModal';

interface TeamManagerDashboardProps {
  user: User;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  expertise: string[];
  currentLoad: number;
  maxCapacity: number;
  availability: 'available' | 'busy' | 'unavailable';
}

export const TeamManagerDashboard = ({ user }: TeamManagerDashboardProps) => {
  const [projects, setProjects] = useState<ProjectBrief[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [pitches, setPitches] = useState<SolutionPitch[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState<ProjectBrief | null>(null);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedProjectForAssignment, setSelectedProjectForAssignment] = useState<ProjectBrief | null>(null);
  const [selectedAssignee, setSelectedAssignee] = useState<string>('');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedPitchForFeedback, setSelectedPitchForFeedback] = useState<SolutionPitch | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    loadTeamMembers();
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

  const loadTeamMembers = () => {
    // Mock team members data
    setTeamMembers([
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@pitchforge.com',
        expertise: ['React', 'Node.js', 'E-commerce'],
        currentLoad: 2,
        maxCapacity: 3,
        availability: 'available'
      },
      {
        id: '2',
        name: 'Mike Chen',
        email: 'mike@pitchforge.com',
        expertise: ['Python', 'AI/ML', 'Healthcare'],
        currentLoad: 1,
        maxCapacity: 3,
        availability: 'available'
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily@pitchforge.com',
        expertise: ['Vue.js', 'Mobile', 'UX/UI'],
        currentLoad: 3,
        maxCapacity: 3,
        availability: 'busy'
      },
      {
        id: '4',
        name: 'David Kim',
        email: 'david@pitchforge.com',
        expertise: ['Java', 'DevOps', 'Cloud'],
        currentLoad: 1,
        maxCapacity: 4,
        availability: 'available'
      }
    ]);
  };

  const handleViewProposal = (proposal: ProjectBrief) => {
    setSelectedProposal(proposal);
    setShowProposalModal(true);
  };

  const handleAssignProject = (project: ProjectBrief) => {
    setSelectedProjectForAssignment(project);
    setShowAssignmentModal(true);
  };

  const handleAssignmentSubmit = async () => {
    if (!selectedProjectForAssignment || !selectedAssignee) return;

    try {
      const member = teamMembers.find(m => m.id === selectedAssignee);
      if (!member) return;

      await updateProjectBrief(selectedProjectForAssignment.id, {
        assignedTo: member.email,
        status: 'in_progress'
      });

      setProjects(prev => prev.map(p => 
        p.id === selectedProjectForAssignment.id 
          ? { ...p, assignedTo: member.email, status: 'in_progress' }
          : p
      ));

      // Update team member load
      setTeamMembers(prev => prev.map(m => 
        m.id === selectedAssignee 
          ? { ...m, currentLoad: m.currentLoad + 1 }
          : m
      ));

      toast({
        title: "Assignment successful",
        description: `Project "${selectedProjectForAssignment.title}" assigned to ${member.name}`,
      });

      setShowAssignmentModal(false);
      setSelectedProjectForAssignment(null);
      setSelectedAssignee('');
      setAssignmentNotes('');
    } catch (error) {
      toast({
        title: "Assignment failed",
        description: "Failed to assign the project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleProvideFeedback = (pitch: SolutionPitch) => {
    setSelectedPitchForFeedback(pitch);
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = async () => {
    if (!selectedPitchForFeedback || !feedbackText.trim()) return;

    try {
      // Update pitch with feedback
      const updatedPitch = { ...selectedPitchForFeedback, feedback: feedbackText };
      setPitches(prev => prev.map(p => 
        p.id === selectedPitchForFeedback.id ? updatedPitch : p
      ));

      toast({
        title: "Feedback submitted",
        description: "Feedback has been sent to the team member",
      });

      setShowFeedbackModal(false);
      setSelectedPitchForFeedback(null);
      setFeedbackText('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      });
    }
  };

  const handleApproveProposal = (proposalId: string) => {
    setProjects(prev => 
      prev.map(p => p.id === proposalId ? { ...p, status: 'approved' as const } : p)
    );
    toast({
      title: "Proposal approved",
      description: "The proposal has been approved",
    });
  };

  const handleRejectProposal = (proposalId: string) => {
    setProjects(prev => 
      prev.map(p => p.id === proposalId ? { ...p, status: 'submitted' as const } : p)
    );
    toast({
      title: "Proposal rejected",
      description: "The proposal has been rejected",
    });
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

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-600';
      case 'busy': return 'text-yellow-600';
      case 'unavailable': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
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
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                        {!project.assignedTo ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAssignProject(project)}
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Assign
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAssignProject(project)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Reassign
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewProposal(project)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
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

        <TabsContent value="assignments">
          <AssignmentPanel 
            briefs={projects}
            onAssignmentChange={(briefId, assigneeEmail) => {
              setProjects(prev => prev.map(p => 
                p.id === briefId ? { ...p, assignedTo: assigneeEmail, status: 'in_progress' } : p
              ));
              toast({
                title: "Assignment Updated",
                description: "Project has been assigned successfully",
              });
            }}
          />
        </TabsContent>

        <TabsContent value="case-studies" className="space-y-4">
          <CaseStudyManager />
        </TabsContent>

        <TabsContent value="proposals">
          <PitchReviewPanel />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
      
      {/* Proposal View Modal */}
      <ProposalViewModal
        proposal={selectedProposal}
        isOpen={showProposalModal}
        onClose={() => setShowProposalModal(false)}
        onApprove={handleApproveProposal}
        onReject={handleRejectProposal}
        showActions={true}
      />

      {/* Assignment Modal */}
      <Dialog open={showAssignmentModal} onOpenChange={setShowAssignmentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Project</DialogTitle>
            <DialogDescription>
              Assign "{selectedProjectForAssignment?.title}" to a team member
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Team Member</Label>
              <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers
                    .filter(member => member.currentLoad < member.maxCapacity)
                    .map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex items-center justify-between">
                          <span>{member.name}</span>
                          <span className={`text-xs ${getAvailabilityColor(member.availability)}`}>
                            {member.currentLoad}/{member.maxCapacity}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {selectedAssignee && (
              <div className="p-3 bg-muted rounded-lg">
                {(() => {
                  const member = teamMembers.find(m => m.id === selectedAssignee);
                  return member ? (
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground mb-2">
                        {member.email}
                      </p>
                      <div className="flex gap-1">
                        {member.expertise.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            <div className="space-y-2">
              <Label>Assignment Notes (Optional)</Label>
              <Textarea
                placeholder="Add any specific instructions or notes for this assignment..."
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowAssignmentModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAssignmentSubmit}
                disabled={!selectedAssignee}
                className="flex-1"
              >
                Assign Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Modal */}
      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Provide Feedback</DialogTitle>
            <DialogDescription>
              Give feedback on "{selectedPitchForFeedback?.title}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Feedback</Label>
              <Textarea
                placeholder="Provide constructive feedback for the team member..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleFeedbackSubmit}
                disabled={!feedbackText.trim()}
                className="flex-1"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Feedback
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};