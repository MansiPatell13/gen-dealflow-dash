import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProjectBrief } from '@/lib/mockData';

interface SolutionPitchFormProps {
  brief: ProjectBrief;
  existingPitch?: any;
  onSubmit: (pitchData: any) => Promise<void>;
  onSaveDraft: (pitchData: any) => Promise<void>;
}

export const SolutionPitchForm = ({ brief, existingPitch, onSubmit, onSaveDraft }: SolutionPitchFormProps) => {
  const [formData, setFormData] = useState({
    title: existingPitch?.title || '',
    executiveSummary: existingPitch?.executiveSummary || '',
    technicalApproach: existingPitch?.technicalApproach || '',
    timeline: existingPitch?.timeline || '',
    budget: existingPitch?.budget || '',
    teamStructure: existingPitch?.teamStructure || '',
    riskMitigation: existingPitch?.riskMitigation || '',
    deliverables: existingPitch?.deliverables || '',
    status: existingPitch?.status || 'draft'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await onSaveDraft({ ...formData, status: 'draft' });
      toast({
        title: "Draft saved",
        description: "Your solution pitch has been saved as a draft.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSubmit({ ...formData, status: 'submitted' });
      toast({
        title: "Pitch submitted",
        description: "Your solution pitch has been submitted for review.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit pitch. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Brief Context */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Project Brief: {brief.title}
            <Badge variant="outline">{brief.industry}</Badge>
          </CardTitle>
          <CardDescription>
            {brief.objectives}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Budget:</strong> {brief.budget}
            </div>
            <div>
              <strong>Timeline:</strong> {brief.timeline}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Solution Pitch Form */}
      <Card>
        <CardHeader>
          <CardTitle>Solution Pitch</CardTitle>
          <CardDescription>
            Create a comprehensive solution proposal for this project brief.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Pitch Title</Label>
              <Input
                id="title"
                placeholder="Enter a compelling title for your solution"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="executiveSummary">Executive Summary</Label>
              <Textarea
                id="executiveSummary"
                placeholder="Provide a high-level overview of your proposed solution..."
                value={formData.executiveSummary}
                onChange={(e) => handleInputChange('executiveSummary', e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="technicalApproach">Technical Approach</Label>
              <Textarea
                id="technicalApproach"
                placeholder="Describe the technical methodology, technologies, and architecture you'll use..."
                value={formData.technicalApproach}
                onChange={(e) => handleInputChange('technicalApproach', e.target.value)}
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeline">Proposed Timeline</Label>
                <Input
                  id="timeline"
                  placeholder="e.g., 12-14 weeks"
                  value={formData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Proposed Budget</Label>
                <Input
                  id="budget"
                  placeholder="e.g., $75,000 - $85,000"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamStructure">Team Structure</Label>
              <Textarea
                id="teamStructure"
                placeholder="Describe the team composition and roles required for this project..."
                value={formData.teamStructure}
                onChange={(e) => handleInputChange('teamStructure', e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliverables">Key Deliverables</Label>
              <Textarea
                id="deliverables"
                placeholder="List the main deliverables and milestones..."
                value={formData.deliverables}
                onChange={(e) => handleInputChange('deliverables', e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="riskMitigation">Risk Assessment & Mitigation</Label>
              <Textarea
                id="riskMitigation"
                placeholder="Identify potential risks and your mitigation strategies..."
                value={formData.riskMitigation}
                onChange={(e) => handleInputChange('riskMitigation', e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isLoading || isSaving}
                className="flex-1"
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || isSaving}
                className="flex-1"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Send className="mr-2 h-4 w-4" />
                Submit for Review
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};