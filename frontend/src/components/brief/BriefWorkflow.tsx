import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileUploadZone } from './FileUploadZone';
import { BriefParser } from './BriefParser';
import { Upload, FileText, CheckCircle } from 'lucide-react';

interface ParsedBrief {
  title: string;
  industry: string;
  budget: string;
  objectives: string;
  timeline: string;
  clientDetails: string;
}

interface BriefWorkflowProps {
  onBriefComplete: (brief: ParsedBrief) => void;
  onCancel: () => void;
  className?: string;
}

type WorkflowStep = 'upload' | 'parsing' | 'review' | 'complete';

export const BriefWorkflow: React.FC<BriefWorkflowProps> = ({
  onBriefComplete,
  onCancel,
  className
}) => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState<string>('');
  const [parsedBrief, setParsedBrief] = useState<ParsedBrief | null>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setCurrentStep('parsing');
  };

  const handleTextPaste = (text: string) => {
    setPastedText(text);
    setCurrentStep('parsing');
  };

  const handleBriefParsed = (brief: ParsedBrief) => {
    setParsedBrief(brief);
    setCurrentStep('review');
  };

  const handleBriefConfirmed = (brief: ParsedBrief) => {
    setParsedBrief(brief);
    setCurrentStep('complete');
    onBriefComplete(brief);
  };

  const handleClear = () => {
    setUploadedFile(null);
    setPastedText('');
    setParsedBrief(null);
    setCurrentStep('upload');
  };

  const handleBack = () => {
    if (currentStep === 'parsing') {
      setCurrentStep('upload');
    } else if (currentStep === 'review') {
      setCurrentStep('parsing');
    }
  };

  const getStepStatus = (step: WorkflowStep) => {
    const stepOrder: WorkflowStep[] = ['upload', 'parsing', 'review', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: 'upload', label: 'Upload Brief', icon: Upload },
      { key: 'parsing', label: 'Parse Content', icon: FileText },
      { key: 'review', label: 'Review & Edit', icon: CheckCircle }
    ];

    return (
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => {
          const status = getStepStatus(step.key as WorkflowStep);
          const Icon = step.icon;
          
          return (
            <div key={step.key} className="flex items-center">
              <div className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2
                  ${status === 'completed' ? 'bg-primary border-primary text-primary-foreground' : ''}
                  ${status === 'current' ? 'border-primary bg-primary/10 text-primary' : ''}
                  ${status === 'pending' ? 'border-muted-foreground/25 text-muted-foreground' : ''}
                `}>
                  {status === 'completed' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <div className="ml-3">
                  <div className={`
                    text-sm font-medium
                    ${status === 'completed' ? 'text-primary' : ''}
                    ${status === 'current' ? 'text-primary' : ''}
                    ${status === 'pending' ? 'text-muted-foreground' : ''}
                  `}>
                    {step.label}
                  </div>
                  <div className={`
                    text-xs
                    ${status === 'completed' ? 'text-primary' : 'text-muted-foreground'}
                  `}>
                    {status === 'completed' ? 'Completed' : 
                     status === 'current' ? 'In Progress' : 'Pending'}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  w-16 h-0.5 mx-4
                  ${status === 'completed' ? 'bg-primary' : 'bg-muted-foreground/25'}
                `} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <FileUploadZone
            onFileUpload={handleFileUpload}
            onTextPaste={handleTextPaste}
            onClear={handleClear}
          />
        );

             case 'parsing':
         return (
           <BriefParser
             onBriefParsed={handleBriefParsed}
             onBack={handleBack}
             uploadedFile={uploadedFile}
             pastedText={pastedText}
           />
         );

      case 'review':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Review Parsed Brief</h3>
              <Badge variant="secondary">Ready to Submit</Badge>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="space-y-2">
                <div><strong>Title:</strong> {parsedBrief?.title}</div>
                <div><strong>Industry:</strong> {parsedBrief?.industry}</div>
                <div><strong>Budget:</strong> {parsedBrief?.budget}</div>
                <div><strong>Timeline:</strong> {parsedBrief?.timeline}</div>
                <div><strong>Objectives:</strong></div>
                <div className="pl-4 text-sm text-muted-foreground whitespace-pre-wrap">
                  {parsedBrief?.objectives}
                </div>
                <div><strong>Client Details:</strong></div>
                <div className="pl-4 text-sm text-muted-foreground">
                  {parsedBrief?.clientDetails}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleBack}>
                Back to Edit
              </Button>
              <Button onClick={() => parsedBrief && handleBriefConfirmed(parsedBrief)}>
                Submit Brief
              </Button>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="text-lg font-semibold">Brief Submitted Successfully!</h3>
            <p className="text-muted-foreground">
              Your project brief has been processed and is ready for review.
            </p>
            <Button onClick={onCancel}>
              Continue
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Project Brief Upload</CardTitle>
          {currentStep !== 'complete' && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {renderStepIndicator()}
        {renderCurrentStep()}
      </CardContent>
    </Card>
  );
}; 