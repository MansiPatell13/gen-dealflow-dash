import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ProjectBrief, fetchProjectBriefs, submitProjectBrief, deleteProjectBrief } from '@/lib/mockData';
import { User } from '@/lib/auth';
import { Plus, FileText, Clock, CheckCircle, AlertCircle, Eye, Upload, Trash2, Edit, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FinalizedPitchViewer } from '@/components/customer/FinalizedPitchViewer';
import { BriefWorkflow } from '@/components/brief/BriefWorkflow';

interface CustomerDashboardProps {
  user: User;
}

export const CustomerDashboard = ({ user }: CustomerDashboardProps) => {
  const [projects, setProjects] = useState<ProjectBrief[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showUploadWorkflow, setShowUploadWorkflow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectBrief | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectBrief | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    industry: '',
    budget: '',
    objectives: '',
    timeline: '',
    clientDetails: ''
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await fetchProjectBriefs('customer', user.email);
      setProjects(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newProject = await submitProjectBrief({
        ...formData,
        status: 'submitted' as const,
        submittedBy: user.email
      });
      setProjects(prev => [newProject, ...prev]);
      setFormData({
        title: '',
        industry: '',
        budget: '',
        objectives: '',
        timeline: '',
        clientDetails: ''
      });
      setShowForm(false);
      toast({
        title: "Success",
        description: "Project brief submitted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit project brief",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBriefWorkflowComplete = async (parsedBrief: any) => {
    setIsSubmitting(true);

    try {
      const newProject = await submitProjectBrief({
        title: parsedBrief.title,
        industry: parsedBrief.industry,
        budget: parsedBrief.budget,
        objectives: parsedBrief.objectives,
        timeline: parsedBrief.timeline,
        clientDetails: parsedBrief.clientDetails,
        status: 'submitted' as const,
        submittedBy: user.email
      });
      setProjects(prev => [newProject, ...prev]);
      setShowUploadWorkflow(false);
      toast({
        title: "Success",
        description: "Project brief uploaded and submitted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit project brief",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewProject = (project: ProjectBrief) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  const handleEditProject = (project: ProjectBrief) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      industry: project.industry,
      budget: project.budget,
      objectives: project.objectives,
      timeline: project.timeline,
      clientDetails: project.clientDetails
    });
    setShowEditModal(true);
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setIsSubmitting(true);
    try {
      // This would call an update API in a real implementation
      const updatedProject = { ...editingProject, ...formData };
      setProjects(prev => prev.map(p => p.id === editingProject.id ? updatedProject : p));
      setShowEditModal(false);
      setEditingProject(null);
      toast({
        title: "Success",
        description: "Project brief updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project brief",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProjectBrief(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast({
        title: "Success",
        description: "Project brief deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project brief",
        variant: "destructive"
      });
    }
  };

  const handleDownloadProject = (project: ProjectBrief) => {
    const projectData = {
      title: project.title,
      industry: project.industry,
      budget: project.budget,
      objectives: project.objectives,
      timeline: project.timeline,
      clientDetails: project.clientDetails,
      status: project.status,
      submittedBy: project.submittedBy,
      createdAt: project.createdAt
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/\s+/g, '_')}_brief.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Project brief downloaded successfully",
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
      case 'submitted': return 'bg-warning/10 text-warning';
      case 'in_progress': return 'bg-info/10 text-info';
      case 'completed': return 'bg-success/10 text-success';
      case 'approved': return 'bg-success/10 text-success';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customer Dashboard</h1>
          <p className="text-muted-foreground">Manage your project briefs and view solutions</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowUploadWorkflow(!showUploadWorkflow)} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Brief
          </Button>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            Manual Form
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Submit New Project Brief</CardTitle>
            <CardDescription>
              Provide details about your project requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter project title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range</Label>
                  <Select value={formData.budget} onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-25k">Under $25,000</SelectItem>
                      <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                      <SelectItem value="250k-plus">$250,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeline">Timeline</Label>
                  <Select value={formData.timeline} onValueChange={(value) => setFormData(prev => ({ ...prev, timeline: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2-4 weeks">2-4 weeks</SelectItem>
                      <SelectItem value="1-2 months">1-2 months</SelectItem>
                      <SelectItem value="3-4 months">3-4 months</SelectItem>
                      <SelectItem value="6+ months">6+ months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="objectives">Project Objectives</Label>
                <Textarea
                  id="objectives"
                  value={formData.objectives}
                  onChange={(e) => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
                  placeholder="Describe your project goals and requirements"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientDetails">Client Details</Label>
                <Textarea
                  id="clientDetails"
                  value={formData.clientDetails}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientDetails: e.target.value }))}
                  placeholder="Provide information about your organization"
                  required
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Brief'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {showUploadWorkflow && (
        <BriefWorkflow
          onBriefComplete={handleBriefWorkflowComplete}
          onCancel={() => setShowUploadWorkflow(false)}
        />
      )}

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="solutions">Solution Proposals</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Your Project Briefs</CardTitle>
              <CardDescription>
                Track the status of your submitted projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              {projects.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No projects yet</h3>
                  <p className="text-muted-foreground">Submit your first project brief to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{project.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{project.industry} • {project.budget}</p>
                          <p className="text-sm text-muted-foreground mt-2">{project.objectives}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`gap-1 ${getStatusColor(project.status)}`}>
                            {getStatusIcon(project.status)}
                            {project.status.replace('_', ' ')}
                          </Badge>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewProject(project)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProject(project)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadProject(project)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span>Submitted: {project.createdAt}</span>
                        <span>Timeline: {project.timeline}</span>
                        {project.assignedTo && <span>Assigned to: {project.assignedTo}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="solutions">
          <FinalizedPitchViewer user={user} />
        </TabsContent>
      </Tabs>

      {/* Project Detail Modal */}
      <Dialog open={showProjectModal} onOpenChange={setShowProjectModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedProject?.title}</DialogTitle>
            <DialogDescription>
              Detailed view of your project brief
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
                {selectedProject.assignedTo && <span>Assigned to: {selectedProject.assignedTo}</span>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Project Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Project Brief</DialogTitle>
            <DialogDescription>
              Update your project brief details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateProject} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Project Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-budget">Budget Range</Label>
                <Select value={formData.budget} onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-25k">Under $25,000</SelectItem>
                    <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                    <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                    <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                    <SelectItem value="250k-plus">$250,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-timeline">Timeline</Label>
                <Select value={formData.timeline} onValueChange={(value) => setFormData(prev => ({ ...prev, timeline: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-4 weeks">2-4 weeks</SelectItem>
                    <SelectItem value="1-2 months">1-2 months</SelectItem>
                    <SelectItem value="3-4 months">3-4 months</SelectItem>
                    <SelectItem value="6+ months">6+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-objectives">Project Objectives</Label>
              <Textarea
                id="edit-objectives"
                value={formData.objectives}
                onChange={(e) => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-clientDetails">Client Details</Label>
              <Textarea
                id="edit-clientDetails"
                value={formData.clientDetails}
                onChange={(e) => setFormData(prev => ({ ...prev, clientDetails: e.target.value }))}
                required
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Brief'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};