import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { UserPlus, Calendar, Clock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProjectBrief } from '@/lib/mockData';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  expertise: string[];
  currentLoad: number;
  maxCapacity: number;
}

interface AssignmentPanelProps {
  briefs: ProjectBrief[];
  onAssignmentChange: () => void;
}

export const AssignmentPanel = ({ briefs, onAssignmentChange }: AssignmentPanelProps) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedBrief, setSelectedBrief] = useState<ProjectBrief | null>(null);
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Mock team members data
    setTeamMembers([
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@pitchforge.com',
        expertise: ['React', 'Node.js', 'E-commerce'],
        currentLoad: 2,
        maxCapacity: 3
      },
      {
        id: '2',
        name: 'Mike Chen',
        email: 'mike@pitchforge.com',
        expertise: ['Python', 'AI/ML', 'Healthcare'],
        currentLoad: 1,
        maxCapacity: 3
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily@pitchforge.com',
        expertise: ['Vue.js', 'Mobile', 'UX/UI'],
        currentLoad: 3,
        maxCapacity: 3
      },
      {
        id: '4',
        name: 'David Kim',
        email: 'david@pitchforge.com',
        expertise: ['Java', 'DevOps', 'Cloud'],
        currentLoad: 1,
        maxCapacity: 4
      }
    ]);
  }, []);

  const unassignedBriefs = briefs.filter(brief => !brief.assignedTo);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getLoadColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 100) return 'text-destructive';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getAvailableMembers = () => {
    return teamMembers.filter(member => member.currentLoad < member.maxCapacity);
  };

  const handleAssign = async () => {
    if (!selectedBrief || !selectedMember) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the brief with assignment
      const member = teamMembers.find(m => m.id === selectedMember);
      if (member) {
        // Update team member's load
        setTeamMembers(prev => 
          prev.map(m => 
            m.id === selectedMember 
              ? { ...m, currentLoad: m.currentLoad + 1 }
              : m
          )
        );
      }

      toast({
        title: "Assignment successful",
        description: `Project "${selectedBrief.title}" assigned to ${member?.name}`,
      });

      setIsDialogOpen(false);
      setSelectedBrief(null);
      setSelectedMember('');
      setAssignmentNotes('');
      onAssignmentChange();
    } catch (error) {
      toast({
        title: "Assignment failed",
        description: "Failed to assign the project. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Assignment Panel</h2>
          <p className="text-muted-foreground">
            Assign project briefs to team members
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Team Capacity</CardTitle>
              <CardDescription>Current workload distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{member.name}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${getLoadColor(member.currentLoad, member.maxCapacity)}`}>
                        {member.currentLoad}/{member.maxCapacity}
                      </span>
                      <div className="flex gap-1">
                        {member.expertise.slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Unassigned Briefs */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Unassigned Project Briefs</CardTitle>
              <CardDescription>
                {unassignedBriefs.length} briefs waiting for assignment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {unassignedBriefs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <UserPlus className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>All briefs have been assigned!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {unassignedBriefs.map((brief) => (
                    <div key={brief.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{brief.title}</h3>
                        <Badge variant="outline">{brief.industry}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {brief.objectives}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {brief.timeline}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {brief.createdAt}
                          </div>
                        </div>
                        <Dialog open={isDialogOpen && selectedBrief?.id === brief.id} onOpenChange={(open) => {
                          setIsDialogOpen(open);
                          if (open) setSelectedBrief(brief);
                        }}>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <UserPlus className="mr-2 h-3 w-3" />
                              Assign
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Assign Project Brief</DialogTitle>
                              <DialogDescription>
                                Assign "{brief.title}" to a team member
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Select Team Member</Label>
                                <Select value={selectedMember} onValueChange={setSelectedMember}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose a team member" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getAvailableMembers().map((member) => (
                                      <SelectItem key={member.id} value={member.id}>
                                        <div className="flex items-center gap-2">
                                          <span>{member.name}</span>
                                          <span className="text-xs text-muted-foreground">
                                            ({member.currentLoad}/{member.maxCapacity})
                                          </span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {selectedMember && (
                                <div className="p-3 bg-muted rounded-lg">
                                  {(() => {
                                    const member = teamMembers.find(m => m.id === selectedMember);
                                    return member ? (
                                      <div>
                                        <p className="text-sm font-medium">{member.name}</p>
                                        <p className="text-xs text-muted-foreground mb-2">
                                          {member.email}
                                        </p>
                                        <div className="flex gap-1">
                                          {member.expertise.map((skill) => (
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
                                  onClick={() => setIsDialogOpen(false)}
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  onClick={handleAssign}
                                  disabled={!selectedMember}
                                  className="flex-1"
                                >
                                  Assign Project
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};