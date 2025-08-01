import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ProjectBrief } from '@/lib/mockData';
import { CheckCircle, XCircle, Clock, User, Calendar, DollarSign, Target, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProposalViewModalProps {
  proposal: ProjectBrief | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (proposalId: string) => void;
  onReject?: (proposalId: string) => void;
  showActions?: boolean;
}

export const ProposalViewModal = ({ 
  proposal, 
  isOpen, 
  onClose, 
  onApprove, 
  onReject,
  showActions = false 
}: ProposalViewModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  if (!proposal) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success/10 text-success border-success/20';
      case 'completed': return 'bg-primary/10 text-primary border-primary/20';
      case 'in_progress': return 'bg-warning/10 text-warning border-warning/20';
      case 'submitted': return 'bg-secondary/10 text-secondary border-secondary/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (onApprove) {
      onApprove(proposal.id);
    }
    
    toast({
      title: "Proposal Approved",
      description: "The proposal has been approved and assigned for development",
    });
    
    setIsProcessing(false);
    onClose();
  };

  const handleReject = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (onReject) {
      onReject(proposal.id);
    }
    
    toast({
      title: "Proposal Rejected",
      description: "The proposal has been marked for revision",
      variant: "destructive"
    });
    
    setIsProcessing(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{proposal.title}</DialogTitle>
              <DialogDescription className="mt-2">
                Project proposal details and requirements
              </DialogDescription>
            </div>
            <Badge className={getStatusColor(proposal.status)}>
              {getStatusIcon(proposal.status)}
              {proposal.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="assignment">Assignment</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <h3 className="font-medium text-primary">Budget Range</h3>
                </div>
                <p className="text-2xl font-bold">{proposal.budget}</p>
              </div>
              <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-success" />
                  <h3 className="font-medium text-success">Timeline</h3>
                </div>
                <p className="text-2xl font-bold">{proposal.timeline}</p>
              </div>
              <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-5 w-5 text-warning" />
                  <h3 className="font-medium text-warning">Industry</h3>
                </div>
                <p className="text-2xl font-bold">{proposal.industry}</p>
              </div>
            </div>

            <Separator />

            {/* Project Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5" />
                Project Objectives
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {proposal.objectives}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Client Information</h3>
              <div className="bg-card border rounded-lg p-4">
                <p className="text-muted-foreground">{proposal.clientDetails}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Functional Requirements</h3>
              <div className="space-y-3">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Core Features</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• User authentication and authorization</li>
                    <li>• Responsive web design for all devices</li>
                    <li>• Real-time data processing and updates</li>
                    <li>• Integration with existing systems</li>
                    <li>• Comprehensive admin dashboard</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Technical Requirements</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Cloud-based infrastructure with 99.9% uptime</li>
                    <li>• SSL encryption and security compliance</li>
                    <li>• Automated backup and disaster recovery</li>
                    <li>• API documentation and testing</li>
                    <li>• Performance optimization for high traffic</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Project Phases</h3>
              <div className="space-y-3">
                {[
                  { phase: 'Discovery & Planning', duration: '1-2 weeks', status: 'pending' },
                  { phase: 'Design & Prototyping', duration: '2-3 weeks', status: 'pending' },
                  { phase: 'Development', duration: '4-6 weeks', status: 'pending' },
                  { phase: 'Testing & QA', duration: '1-2 weeks', status: 'pending' },
                  { phase: 'Deployment & Training', duration: '1 week', status: 'pending' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.phase}</h4>
                      <p className="text-sm text-muted-foreground">Duration: {item.duration}</p>
                    </div>
                    <Badge variant="outline">{item.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assignment" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Submission Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Submitted by:</span>
                    <span className="font-medium">{proposal.submittedBy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Created:</span>
                    <span className="font-medium">{proposal.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Updated:</span>
                    <span className="font-medium">{proposal.updatedAt}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Assignment Status</h3>
                <div className="space-y-3">
                  {proposal.assignedTo ? (
                    <div className="bg-success/5 border border-success/20 rounded-lg p-3">
                      <p className="text-sm font-medium text-success">Assigned to:</p>
                      <p className="font-medium">{proposal.assignedTo}</p>
                    </div>
                  ) : (
                    <div className="bg-warning/5 border border-warning/20 rounded-lg p-3">
                      <p className="text-warning font-medium">Not yet assigned</p>
                      <p className="text-sm text-muted-foreground">Awaiting team member assignment</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          
          {showActions && proposal.status === 'submitted' && (
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleReject}
                disabled={isProcessing}
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Request Changes
              </Button>
              <Button 
                onClick={handleApprove}
                disabled={isProcessing}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isProcessing ? "Processing..." : "Approve"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};