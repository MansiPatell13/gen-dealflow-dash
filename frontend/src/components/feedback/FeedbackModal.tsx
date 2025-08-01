import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Star } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  pitchId: string;
  pitchTitle: string;
}

export const FeedbackModal = ({ isOpen, onClose, pitchId, pitchTitle }: FeedbackModalProps) => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim() || !rating) {
      toast({
        title: "Missing Information",
        description: "Please provide both feedback and a rating",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Feedback Submitted",
      description: "Your feedback has been sent to the team. Thank you!",
    });

    setFeedback('');
    setRating('');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Provide Feedback
          </DialogTitle>
          <DialogDescription>
            Share your thoughts on "{pitchTitle}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Overall Rating</Label>
            <RadioGroup value={rating} onValueChange={setRating}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excellent" id="excellent" />
                <Label htmlFor="excellent" className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  Excellent - Exceeds expectations
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="good" />
                <Label htmlFor="good" className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-blue-400 text-blue-400" />
                  Good - Meets expectations
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="needs-improvement" id="needs-improvement" />
                <Label htmlFor="needs-improvement" className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                  Needs Improvement
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Feedback Text */}
          <div className="space-y-3">
            <Label htmlFor="feedback" className="text-sm font-medium">
              Detailed Feedback
            </Label>
            <Textarea
              id="feedback"
              placeholder="Please share your specific thoughts, suggestions, or concerns about this proposal..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Suggestion Prompts */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-2">Consider addressing:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Technical approach and feasibility</li>
              <li>• Timeline and milestones</li>
              <li>• Budget and value proposition</li>
              <li>• Risk mitigation strategies</li>
              <li>• Communication and collaboration</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};