import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SolutionPitch } from '@/lib/mockData';
import { Calendar, User, FileText, Clock } from 'lucide-react';

interface PitchDetailModalProps {
  pitch: SolutionPitch | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestMeeting?: (pitchId: string) => void;
  onProvideFeedback?: (pitchId: string) => void;
}

export const PitchDetailModal = ({ 
  pitch, 
  isOpen, 
  onClose, 
  onRequestMeeting, 
  onProvideFeedback 
}: PitchDetailModalProps) => {
  if (!pitch) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success/10 text-success border-success/20';
      case 'rejected': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'submitted': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-secondary/10 text-secondary border-secondary/20';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{pitch.title}</DialogTitle>
              <DialogDescription className="mt-2">
                Solution pitch details and specifications
              </DialogDescription>
            </div>
            <Badge className={getStatusColor(pitch.status)}>
              {pitch.status.charAt(0).toUpperCase() + pitch.status.slice(1)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Meta Information */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Created by:</span>
              <span className="font-medium">{pitch.createdBy}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Date:</span>
              <span className="font-medium">{pitch.createdAt}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Brief ID:</span>
              <span className="font-medium">#{pitch.briefId}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Status:</span>
              <span className="font-medium">{pitch.status}</span>
            </div>
          </div>

          <Separator />

          {/* Content Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Proposal Content</h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {pitch.content}
              </p>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Technical Approach</h3>
            <div className="bg-card border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Technology Stack</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• React 18 with TypeScript</li>
                    <li>• Node.js & Express backend</li>
                    <li>• PostgreSQL database</li>
                    <li>• AWS cloud infrastructure</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Timeline</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Week 1-2: Setup & Planning</li>
                    <li>• Week 3-6: Core Development</li>
                    <li>• Week 7-8: Testing & Deployment</li>
                    <li>• Week 9: Training & Handover</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Investment & ROI */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Investment Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h4 className="font-medium text-primary">Total Investment</h4>
                <p className="text-2xl font-bold text-primary">$75,000</p>
                <p className="text-sm text-muted-foreground">Including all phases</p>
              </div>
              <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                <h4 className="font-medium text-success">Expected ROI</h4>
                <p className="text-2xl font-bold text-success">300%</p>
                <p className="text-sm text-muted-foreground">Within 12 months</p>
              </div>
              <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
                <h4 className="font-medium text-warning">Timeline</h4>
                <p className="text-2xl font-bold text-warning">9 weeks</p>
                <p className="text-sm text-muted-foreground">To full deployment</p>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          {pitch.feedback && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Feedback & Comments</h3>
                <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                  <p className="text-muted-foreground">{pitch.feedback}</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {onProvideFeedback && (
            <Button 
              variant="outline" 
              onClick={() => onProvideFeedback(pitch.id)}
            >
              Provide Feedback
            </Button>
          )}
          {onRequestMeeting && (
            <Button onClick={() => onRequestMeeting(pitch.id)}>
              Request Meeting
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};