import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SolutionPitch, fetchSolutionPitches } from '@/lib/mockData';
import { User } from '@/lib/auth';
import { CheckCircle, FileText, Download, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PitchDetailModal } from '@/components/pitch/PitchDetailModal';
import { FeedbackModal } from '@/components/feedback/FeedbackModal';
import { MeetingRequestModal } from '@/components/meeting/MeetingRequestModal';

interface FinalizedPitchViewerProps {
  user: User;
}

export const FinalizedPitchViewer = ({ user }: FinalizedPitchViewerProps) => {
  const [finalizedPitches, setFinalizedPitches] = useState<SolutionPitch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPitch, setSelectedPitch] = useState<SolutionPitch | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadFinalizedPitches();
  }, []);

  const loadFinalizedPitches = async () => {
    try {
      const pitches = await fetchSolutionPitches();
      // Filter for pitches that are approved/finalized for this customer
      const customerPitches = pitches.filter(
        pitch => pitch.status === 'approved' && pitch.clientEmail === user.email
      );
      setFinalizedPitches(customerPitches);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load finalized pitches",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (pitchId: string) => {
    toast({
      title: "Download started",
      description: "Your solution pitch document is being prepared for download",
    });
  };

  const handleViewDetails = (pitch: SolutionPitch) => {
    setSelectedPitch(pitch);
    setShowDetailModal(true);
  };

  const handleProvideFeedback = (pitchId: string) => {
    const pitch = finalizedPitches.find(p => p.id === pitchId);
    if (pitch) {
      setSelectedPitch(pitch);
      setShowDetailModal(false);
      setShowFeedbackModal(true);
    }
  };

  const handleRequestMeeting = (pitchId: string) => {
    const pitch = finalizedPitches.find(p => p.id === pitchId);
    if (pitch) {
      setSelectedPitch(pitch);
      setShowDetailModal(false);
      setShowMeetingModal(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading your solutions...</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-success" />
          Finalized Solution Pitches
        </CardTitle>
        <CardDescription>
          View and download your approved solution proposals
        </CardDescription>
      </CardHeader>
      <CardContent>
        {finalizedPitches.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No finalized pitches yet</h3>
            <p className="text-muted-foreground">
              Your approved solution pitches will appear here once they're ready
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {finalizedPitches.map((pitch) => (
              <div key={pitch.id} className="border border-border rounded-lg p-6 bg-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">{pitch.title}</h3>
                      <Badge className="bg-success/10 text-success border-success/20">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approved
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Delivered: {pitch.createdAt}
                      </span>
                      <span>Created by: {pitch.createdBy}</span>
                    </div>
                  </div>
                  <Button onClick={() => handleDownload(pitch.id)} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Solution Overview</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {pitch.content}
                    </p>
                  </div>

                  {pitch.feedback && (
                    <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                      <h4 className="font-medium text-success mb-2">Key Highlights</h4>
                      <p className="text-sm text-muted-foreground">
                        {pitch.feedback}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(pitch)}
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleProvideFeedback(pitch.id)}
                    >
                      Provide Feedback
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRequestMeeting(pitch.id)}
                    >
                      Request Meeting
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      {/* Modals */}
      <PitchDetailModal
        pitch={selectedPitch}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onProvideFeedback={handleProvideFeedback}
        onRequestMeeting={handleRequestMeeting}
      />
      
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        pitchId={selectedPitch?.id || ''}
        pitchTitle={selectedPitch?.title || ''}
      />
      
      <MeetingRequestModal
        isOpen={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
        pitchId={selectedPitch?.id || ''}
        pitchTitle={selectedPitch?.title || ''}
      />
    </Card>
  );
};