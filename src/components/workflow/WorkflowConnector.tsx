import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WorkflowEvent {
  type: 'assignment' | 'pitch_submitted' | 'pitch_approved' | 'feedback_given';
  projectId: string;
  userId: string;
  data: any;
}

interface WorkflowConnectorProps {
  onWorkflowEvent?: (event: WorkflowEvent) => void;
}

export const WorkflowConnector = ({ onWorkflowEvent }: WorkflowConnectorProps) => {
  const { toast } = useToast();

  // Simulate workflow events
  useEffect(() => {
    const simulateWorkflow = () => {
      // Mock workflow event - would be replaced with real event listeners
      const mockEvent: WorkflowEvent = {
        type: 'assignment',
        projectId: '1',
        userId: 'team.member@pitchforge.com',
        data: {
          projectTitle: 'E-commerce Platform Redesign',
          assignedBy: 'manager@pitchforge.com'
        }
      };

      if (onWorkflowEvent) {
        onWorkflowEvent(mockEvent);
      }
    };

    // Simulate workflow events every 30 seconds
    const interval = setInterval(simulateWorkflow, 30000);
    return () => clearInterval(interval);
  }, [onWorkflowEvent]);

  const handleAssignment = (projectId: string, assigneeEmail: string) => {
    // Update project status
    // Send notification to assignee
    // Update dashboard counts
    toast({
      title: "Project Assigned",
      description: "Team member has been notified of the new assignment",
    });

    if (onWorkflowEvent) {
      onWorkflowEvent({
        type: 'assignment',
        projectId,
        userId: assigneeEmail,
        data: { assignedAt: new Date().toISOString() }
      });
    }
  };

  const handlePitchSubmission = (pitchId: string, projectId: string) => {
    // Update pitch status to 'submitted'
    // Notify manager for review
    // Update project progress
    toast({
      title: "Pitch Submitted",
      description: "Solution pitch sent to manager for review",
    });

    if (onWorkflowEvent) {
      onWorkflowEvent({
        type: 'pitch_submitted',
        projectId,
        userId: 'manager',
        data: { pitchId, submittedAt: new Date().toISOString() }
      });
    }
  };

  const handlePitchApproval = (pitchId: string, projectId: string, clientEmail: string) => {
    // Update pitch status to 'approved'
    // Make pitch available to customer
    // Send completion notification
    toast({
      title: "Pitch Approved",
      description: "Solution pitch has been delivered to the client",
    });

    if (onWorkflowEvent) {
      onWorkflowEvent({
        type: 'pitch_approved',
        projectId,
        userId: clientEmail,
        data: { pitchId, approvedAt: new Date().toISOString() }
      });
    }
  };

  const handleFeedbackGiven = (pitchId: string, feedback: string, recipientEmail: string) => {
    // Update pitch with feedback
    // Notify team member
    // Update revision count
    toast({
      title: "Feedback Provided",
      description: "Team member has been notified of the feedback",
    });

    if (onWorkflowEvent) {
      onWorkflowEvent({
        type: 'feedback_given',
        projectId: pitchId,
        userId: recipientEmail,
        data: { feedback, givenAt: new Date().toISOString() }
      });
    }
  };

  // This component manages workflow state but doesn't render anything
  return null;
};