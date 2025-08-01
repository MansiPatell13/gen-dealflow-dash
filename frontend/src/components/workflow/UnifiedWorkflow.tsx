import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Circle, 
  Clock,
  FileText,
  BookOpen,
  Sparkles,
  Eye,
  Send,
  Home,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'pending' | 'active' | 'completed' | 'error';
  component?: React.ComponentType<any>;
  props?: any;
}

interface UnifiedWorkflowProps {
  steps: WorkflowStep[];
  onStepComplete?: (stepId: string) => void;
  onWorkflowComplete?: () => void;
  onStepChange?: (stepId: string) => void;
  className?: string;
}

export const UnifiedWorkflow: React.FC<UnifiedWorkflowProps> = ({
  steps,
  onStepComplete,
  onWorkflowComplete,
  onStepChange,
  className
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>(steps);

  const currentStep = workflowSteps[currentStepIndex];
  const progress = ((completedSteps.size + (currentStep?.status === 'completed' ? 1 : 0)) / steps.length) * 100;

  const handleNext = () => {
    if (currentStepIndex < workflowSteps.length - 1) {
      const nextStepIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextStepIndex);
      
      // Mark current step as completed
      if (currentStep) {
        const updatedSteps = [...workflowSteps];
        updatedSteps[currentStepIndex] = { ...currentStep, status: 'completed' };
        setWorkflowSteps(updatedSteps);
        setCompletedSteps(prev => new Set([...prev, currentStep.id]));
        
        if (onStepComplete) {
          onStepComplete(currentStep.id);
        }
      }
      
      if (onStepChange) {
        onStepChange(workflowSteps[nextStepIndex].id);
      }
    } else {
      // Workflow completed
      if (onWorkflowComplete) {
        onWorkflowComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      const prevStepIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevStepIndex);
      
      if (onStepChange) {
        onStepChange(workflowSteps[prevStepIndex].id);
      }
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Allow navigation to completed steps or the next available step
    const targetStep = workflowSteps[stepIndex];
    if (targetStep.status === 'completed' || stepIndex <= currentStepIndex + 1) {
      setCurrentStepIndex(stepIndex);
      if (onStepChange) {
        onStepChange(targetStep.id);
      }
    }
  };

  const getStepIcon = (step: WorkflowStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'active':
        return <step.icon className="h-5 w-5 text-primary" />;
      case 'error':
        return <Circle className="h-5 w-5 text-red-600" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const renderStepIndicator = (step: WorkflowStep, index: number) => (
    <div
      key={step.id}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
        step.status === 'active' && "bg-primary/10 border border-primary/20",
        step.status === 'completed' && "bg-green-50 border border-green-200",
        step.status === 'error' && "bg-red-50 border border-red-200",
        "hover:bg-muted/50"
      )}
      onClick={() => handleStepClick(index)}
    >
      <div className="flex items-center gap-3">
        {getStepIcon(step)}
        <div className="flex-1">
          <h4 className="font-medium text-sm">{step.title}</h4>
          <p className="text-xs text-muted-foreground">{step.description}</p>
        </div>
      </div>
      {step.status === 'completed' && (
        <Badge variant="secondary" className="text-xs">
          Complete
        </Badge>
      )}
    </div>
  );

  const renderBreadcrumb = () => (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Button variant="ghost" size="sm" className="flex items-center gap-1">
        <Home className="h-4 w-4" />
        Dashboard
      </Button>
      <ChevronRight className="h-4 w-4" />
      <span>Workflow</span>
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground font-medium">{currentStep?.title}</span>
    </nav>
  );

  const renderProgressBar = () => (
    <div className="space-y-2 mb-6">
      <div className="flex items-center justify-between text-sm">
        <span>Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Step {currentStepIndex + 1} of {workflowSteps.length}</span>
        <span>{completedSteps.size} completed</span>
      </div>
    </div>
  );

  const renderStepContent = () => {
    if (!currentStep) return null;

    const StepComponent = currentStep.component;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <currentStep.icon className="h-5 w-5" />
            {currentStep.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {StepComponent ? (
            <StepComponent {...currentStep.props} />
          ) : (
            <div className="text-center py-8">
              <currentStep.icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">{currentStep.title}</h3>
              <p className="text-muted-foreground">{currentStep.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderNavigation = () => (
    <div className="flex items-center justify-between pt-6 border-t">
      <Button
        variant="outline"
        onClick={handlePrevious}
        disabled={currentStepIndex === 0}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4" />
          Preview
        </Button>
      </div>

      <Button
        onClick={handleNext}
        disabled={currentStep?.status === 'error'}
        className="flex items-center gap-2"
      >
        {currentStepIndex === workflowSteps.length - 1 ? (
          <>
            <Send className="h-4 w-4" />
            Complete Workflow
          </>
        ) : (
          <>
            Next
            <ChevronRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {renderBreadcrumb()}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Step Indicators */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Workflow Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {workflowSteps.map((step, index) => renderStepIndicator(step, index))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Current Step</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {currentStep?.description}
                  </p>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Step {currentStepIndex + 1}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {renderProgressBar()}
              {renderStepContent()}
              {renderNavigation()}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Workflow Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Workflow Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{workflowSteps.length}</div>
              <div className="text-sm text-muted-foreground">Total Steps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedSteps.size}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{workflowSteps.length - completedSteps.size - 1}</div>
              <div className="text-sm text-muted-foreground">Remaining</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 