import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Users, Video } from 'lucide-react';

interface MeetingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  pitchId: string;
  pitchTitle: string;
}

export const MeetingRequestModal = ({ isOpen, onClose, pitchId, pitchTitle }: MeetingRequestModalProps) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: '30',
    type: 'video',
    agenda: '',
    attendees: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.agenda.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Meeting Request Sent",
      description: "The team will contact you to confirm the meeting details",
    });

    setFormData({
      date: '',
      time: '',
      duration: '30',
      type: 'video',
      agenda: '',
      attendees: ''
    });
    setIsSubmitting(false);
    onClose();
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Request Meeting
          </DialogTitle>
          <DialogDescription>
            Schedule a discussion about "{pitchTitle}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Preferred Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => updateFormData('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium">
                Preferred Time *
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => updateFormData('time', e.target.value)}
              />
            </div>
          </div>

          {/* Duration and Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Duration
              </Label>
              <Select value={formData.duration} onValueChange={(value) => updateFormData('duration', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1">
                <Video className="h-3 w-3" />
                Meeting Type
              </Label>
              <Select value={formData.type} onValueChange={(value) => updateFormData('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video Call</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="in-person">In Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Attendees */}
          <div className="space-y-2">
            <Label htmlFor="attendees" className="text-sm font-medium flex items-center gap-1">
              <Users className="h-3 w-3" />
              Additional Attendees
            </Label>
            <Input
              id="attendees"
              placeholder="Enter email addresses separated by commas"
              value={formData.attendees}
              onChange={(e) => updateFormData('attendees', e.target.value)}
            />
          </div>

          {/* Meeting Agenda */}
          <div className="space-y-2">
            <Label htmlFor="agenda" className="text-sm font-medium">
              Meeting Agenda *
            </Label>
            <Textarea
              id="agenda"
              placeholder="What would you like to discuss? (e.g., technical clarifications, timeline adjustments, budget details...)"
              value={formData.agenda}
              onChange={(e) => updateFormData('agenda', e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Quick Topics */}
          <div className="bg-muted/50 rounded-lg p-3">
            <h4 className="text-sm font-medium mb-2">Suggested Topics:</h4>
            <div className="flex flex-wrap gap-1">
              {[
                'Technical Details',
                'Timeline Review',
                'Budget Discussion',
                'Implementation Plan',
                'Next Steps'
              ].map((topic) => (
                <Button
                  key={topic}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    const currentAgenda = formData.agenda;
                    const newAgenda = currentAgenda 
                      ? `${currentAgenda}\n• ${topic}` 
                      : `• ${topic}`;
                    updateFormData('agenda', newAgenda);
                  }}
                >
                  + {topic}
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};