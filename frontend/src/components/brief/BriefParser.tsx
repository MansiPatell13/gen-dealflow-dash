import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { FileText, Edit3, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { StructuredBriefDisplay } from './StructuredBriefDisplay';

interface ParsedBrief {
  title: string;
  industry: string;
  budget: string;
  objectives: string;
  timeline: string;
  clientDetails: string;
}

interface BriefParserProps {
  onBriefParsed: (brief: ParsedBrief) => void;
  onBack: () => void;
  className?: string;
  uploadedFile?: File | null;
  pastedText?: string;
}

const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Retail',
  'Manufacturing',
  'Education',
  'Real Estate',
  'Entertainment',
  'Transportation',
  'Energy',
  'Other'
];

const BUDGET_RANGES = [
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000 - $100,000',
  '$100,000 - $250,000',
  '$250,000+'
];

export const BriefParser: React.FC<BriefParserProps> = ({
  onBriefParsed,
  onBack,
  className,
  uploadedFile,
  pastedText
}) => {
  const [isParsing, setIsParsing] = useState(false);
  const [parsedBrief, setParsedBrief] = useState<ParsedBrief | null>(null);
  const [editableBrief, setEditableBrief] = useState<ParsedBrief | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock parsing function - in a real app, this would call an API
  const parseBriefContent = async (content: string): Promise<ParsedBrief> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simple parsing logic - extract information from text
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    
    // Extract title (first line or line containing "project", "brief", "requirement")
    const titleLine = lines.find(line => 
      line.toLowerCase().includes('project') || 
      line.toLowerCase().includes('brief') || 
      line.toLowerCase().includes('requirement') ||
      line.toLowerCase().includes('platform') ||
      line.toLowerCase().includes('system') ||
      line.toLowerCase().includes('app')
    ) || lines[0] || 'Project Brief';

    // Extract budget (look for $ amounts)
    const budgetMatch = content.match(/\$[\d,]+(\s*-\s*\$[\d,]+)?/);
    const budget = budgetMatch ? budgetMatch[0] : '$25,000 - $50,000';

    // Extract timeline (look for time-related words)
    const timelineMatch = content.match(/(\d+\s*-\s*\d+|\d+)\s*(weeks?|months?|days?)/i);
    const timeline = timelineMatch ? timelineMatch[0] : '2-3 months';

    // Extract industry (look for industry keywords)
    const industryKeywords = {
      'Technology': ['tech', 'software', 'app', 'platform', 'system', 'digital'],
      'Healthcare': ['health', 'medical', 'patient', 'hospital', 'clinic'],
      'Finance': ['finance', 'banking', 'payment', 'financial', 'money'],
      'Retail': ['retail', 'e-commerce', 'shop', 'store', 'product'],
      'Manufacturing': ['manufacturing', 'factory', 'production', 'industrial'],
      'Education': ['education', 'learning', 'school', 'university', 'training']
    };

    let detectedIndustry = 'Other';
    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      if (keywords.some(keyword => content.toLowerCase().includes(keyword))) {
        detectedIndustry = industry;
        break;
      }
    }

    // Extract objectives (lines with bullet points or key features)
    const objectiveLines = lines.filter(line => 
      line.startsWith('-') || 
      line.startsWith('•') || 
      line.startsWith('*') ||
      line.toLowerCase().includes('include') ||
      line.toLowerCase().includes('feature') ||
      line.toLowerCase().includes('requirement')
    );
    const objectives = objectiveLines.length > 0 
      ? objectiveLines.join('\n')
      : 'Build a comprehensive solution based on the provided requirements';

    // Extract client details (look for company names or client information)
    const clientMatch = content.match(/(?:company|client|business|organization)[:\s]+([^\n]+)/i);
    const clientDetails = clientMatch ? clientMatch[1] : 'Client details to be provided';

    return {
      title: titleLine,
      industry: detectedIndustry,
      budget,
      objectives,
      timeline,
      clientDetails
    };
  };

  // Auto-parse when component mounts if we have content
  React.useEffect(() => {
    const autoParse = async () => {
      if (uploadedFile) {
        await handleFileParse(uploadedFile);
      } else if (pastedText) {
        await handleTextParse(pastedText);
      }
    };
    autoParse();
  }, []);

  const handleFileParse = async (file: File) => {
    setIsParsing(true);
    setError(null);

    try {
      const content = await readFileContent(file);
      const parsed = await parseBriefContent(content);
      setParsedBrief(parsed);
      setEditableBrief(parsed);
    } catch (err) {
      setError('Failed to parse file. Please try again or paste the content manually.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleTextParse = async (text: string) => {
    setIsParsing(true);
    setError(null);

    try {
      const parsed = await parseBriefContent(text);
      setParsedBrief(parsed);
      setEditableBrief(parsed);
    } catch (err) {
      setError('Failed to parse text. Please try again.');
    } finally {
      setIsParsing(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleFieldChange = (field: keyof ParsedBrief, value: string) => {
    if (editableBrief) {
      setEditableBrief({
        ...editableBrief,
        [field]: value
      });
    }
  };

  const handleConfirm = () => {
    if (editableBrief) {
      onBriefParsed(editableBrief);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditableBrief(parsedBrief);
    setIsEditing(false);
  };

  if (isParsing) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Parsing Brief Content</h3>
          <p className="text-muted-foreground">
            Analyzing your project brief and extracting key information...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!parsedBrief) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Parsed Project Brief</span>
            <Badge variant="secondary">AI Parsed</Badge>
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            {!isEditing ? (
              <Button onClick={handleEdit} variant="outline">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <Button onClick={handleCancelEdit} variant="outline">
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {parsedBrief && (
          <StructuredBriefDisplay
            brief={editableBrief || parsedBrief}
            onEdit={handleEdit}
            onSave={handleConfirm}
            onCancel={onBack}
            isEditing={isEditing}
            showActions={true}
            variant="default"
          />
        )}
      </CardContent>
    </Card>
  );
}; 