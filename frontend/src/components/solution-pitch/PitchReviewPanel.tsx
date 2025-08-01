import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, MessageSquare, Eye, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SolutionPitch, fetchSolutionPitches } from '@/lib/mockData';
import { PitchDetailModal } from '@/components/pitch/PitchDetailModal';

export const PitchReviewPanel = () => {
  const [pitches, setPitches] = useState<SolutionPitch[]>([]);
  const [selectedPitch, setSelectedPitch] = useState<SolutionPitch | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPitches();
  }, []);

  const loadPitches = async () => {
    try {
      const data = await fetchSolutionPitches();
      setPitches(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load solution pitches.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (pitchId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPitches(prev => 
        prev.map(p => 
          p.id === pitchId 
            ? { ...p, status: 'approved' as const, feedback: feedback || 'Approved for client presentation' }
            : p
        )
      );

      toast({
        title: "Pitch approved",
        description: "The solution pitch has been approved and will be sent to the client.",
      });

      setReviewDialogOpen(false);
      setFeedback('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve pitch.",
        variant: "destructive",
      });
    }
  };

  const handleRequestChanges = async (pitchId: string) => {
    if (!feedback.trim()) {
      toast({
        title: "Feedback required",
        description: "Please provide feedback for the requested changes.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPitches(prev => 
        prev.map(p => 
          p.id === pitchId 
            ? { ...p, status: 'rejected' as const, feedback }
            : p
        )
      );

      toast({
        title: "Changes requested",
        description: "Feedback has been sent to the team member.",
      });

      setReviewDialogOpen(false);
      setFeedback('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request changes.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (pitch: SolutionPitch) => {
    setSelectedPitch(pitch);
    setShowDetailModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'submitted': return <Clock className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const pendingPitches = pitches.filter(p => p.status === 'submitted');
  const reviewedPitches = pitches.filter(p => p.status === 'approved' || p.status === 'rejected');

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Pitch Review Panel</h2>
        <p className="text-muted-foreground">
          Review and approve solution pitches before client presentation
        </p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Review ({pendingPitches.length})
          </TabsTrigger>
          <TabsTrigger value="reviewed">
            Reviewed ({reviewedPitches.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingPitches.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pitches pending review</p>
              </CardContent>
            </Card>
          ) : (
            pendingPitches.map((pitch) => (
              <Card key={pitch.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pitch.title}</CardTitle>
                    <Badge className={getStatusColor(pitch.status)}>
                      {getStatusIcon(pitch.status)}
                      <span className="ml-1">{pitch.status}</span>
                    </Badge>
                  </div>
                  <CardDescription>
                    Created by {pitch.createdBy} • {pitch.createdAt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {pitch.content}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(pitch)}
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      View Details
                    </Button>

                    <Dialog open={reviewDialogOpen && selectedPitch?.id === pitch.id} onOpenChange={(open) => {
                      setReviewDialogOpen(open);
                      if (open) setSelectedPitch(pitch);
                    }}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <MessageSquare className="mr-2 h-3 w-3" />
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Review Solution Pitch</DialogTitle>
                          <DialogDescription>
                            Approve or request changes for "{pitch.title}"
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Feedback (Optional for approval, Required for changes)</Label>
                            <Textarea
                              placeholder="Provide feedback or approval comments..."
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              rows={4}
                            />
                          </div>

                          <div className="flex gap-2 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => handleRequestChanges(pitch.id)}
                              className="flex-1"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Request Changes
                            </Button>
                            <Button
                              onClick={() => handleApprove(pitch.id)}
                              className="flex-1"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="reviewed" className="space-y-4">
          {reviewedPitches.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No reviewed pitches yet</p>
              </CardContent>
            </Card>
          ) : (
            reviewedPitches.map((pitch) => (
              <Card key={pitch.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pitch.title}</CardTitle>
                    <Badge className={getStatusColor(pitch.status)}>
                      {getStatusIcon(pitch.status)}
                      <span className="ml-1">{pitch.status}</span>
                    </Badge>
                  </div>
                  <CardDescription>
                    Created by {pitch.createdBy} • {pitch.createdAt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {pitch.content}
                  </p>
                  {pitch.feedback && (
                    <div className="p-3 bg-muted rounded-lg mt-3">
                      <p className="text-sm">
                        <strong>Feedback:</strong> {pitch.feedback}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Pitch Detail Modal */}
      <PitchDetailModal
        pitch={selectedPitch}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
    </div>
  );
};