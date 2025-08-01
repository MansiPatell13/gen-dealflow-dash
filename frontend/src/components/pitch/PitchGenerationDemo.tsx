import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PitchGenerator } from './PitchGenerator';
import { PitchPreview } from './PitchPreview';
import { StructuredBriefDisplay } from '../brief/StructuredBriefDisplay';
import { CaseStudyRecommendations } from '../case-studies/CaseStudyRecommendations';
import { Sparkles, FileText, Eye, BookOpen, Target } from 'lucide-react';

// Sample data for demonstration
const sampleBrief = {
  title: "E-commerce Platform Development",
  industry: "Technology",
  budget: "$50,000 - $100,000",
  objectives: "We need a modern e-commerce platform for our retail business. The platform should include:\n- User authentication and profiles\n- Product catalog with search and filtering\n- Shopping cart and checkout process\n- Payment integration\n- Admin dashboard for inventory management",
  timeline: "3-4 months",
  clientDetails: "TechCorp Inc. - A growing retail company looking to expand online presence"
};

const sampleCaseStudies = [
  {
    id: '1',
    title: 'E-commerce Platform for Retail Chain',
    industry: 'Technology',
    description: 'Developed a comprehensive e-commerce platform for a major retail chain, including user authentication, product catalog, shopping cart, payment integration, and admin dashboard.',
    relevanceScore: 85,
    tags: ['e-commerce', 'retail', 'payment', 'user-management', 'admin-dashboard'],
    outcome: 'Successfully launched platform with 40% increase in online sales within 6 months.',
    budget: '$50,000 - $100,000',
    timeline: '3-4 months',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Healthcare Management System',
    industry: 'Healthcare',
    description: 'Built a patient management system for a healthcare provider, featuring patient records, appointment scheduling, billing integration, and reporting tools.',
    relevanceScore: 45,
    tags: ['healthcare', 'patient-management', 'scheduling', 'billing', 'reporting'],
    outcome: 'Improved patient care efficiency by 35% and reduced administrative overhead.',
    budget: '$100,000 - $250,000',
    timeline: '6-8 months',
    createdAt: '2024-02-20'
  },
  {
    id: '3',
    title: 'Financial Analytics Dashboard',
    industry: 'Finance',
    description: 'Created a real-time financial analytics dashboard for an investment firm, including data visualization, reporting, and automated alerts.',
    relevanceScore: 30,
    tags: ['finance', 'analytics', 'dashboard', 'real-time', 'reporting'],
    outcome: 'Enhanced decision-making capabilities with 50% faster data insights.',
    budget: '$75,000 - $150,000',
    timeline: '4-5 months',
    createdAt: '2024-03-10'
  }
];

interface SolutionPitch {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  caseStudyIds: string[];
  version: number;
}

export const PitchGenerationDemo: React.FC = () => {
  const [generatedPitch, setGeneratedPitch] = useState<SolutionPitch | null>(null);
  const [activeTab, setActiveTab] = useState('generator');

  const handlePitchGenerated = (pitch: SolutionPitch) => {
    setGeneratedPitch(pitch);
    console.log('Pitch generated:', pitch);
  };

  const handlePitchSaved = (pitch: SolutionPitch) => {
    setGeneratedPitch(pitch);
    console.log('Pitch saved:', pitch);
  };

  const handlePitchEdit = () => {
    setActiveTab('generator');
  };

  const handlePitchApprove = () => {
    if (generatedPitch) {
      const approvedPitch = {
        ...generatedPitch,
        status: 'approved' as const,
        updatedAt: new Date().toISOString()
      };
      setGeneratedPitch(approvedPitch);
      console.log('Pitch approved:', approvedPitch);
    }
  };

  const handlePitchReject = () => {
    if (generatedPitch) {
      const rejectedPitch = {
        ...generatedPitch,
        status: 'rejected' as const,
        updatedAt: new Date().toISOString()
      };
      setGeneratedPitch(rejectedPitch);
      console.log('Pitch rejected:', rejectedPitch);
    }
  };

  const handleDownload = () => {
    if (generatedPitch) {
      const blob = new Blob([generatedPitch.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedPitch.title.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleShare = () => {
    if (generatedPitch) {
      const shareData = {
        title: generatedPitch.title,
        text: generatedPitch.content.substring(0, 200) + '...',
        url: window.location.href
      };
      
      if (navigator.share) {
        navigator.share(shareData);
      } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(generatedPitch.content);
        alert('Pitch content copied to clipboard!');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Solution Pitch Generation Demo</h2>
          <p className="text-muted-foreground">
            AI-powered solution pitch generation with case study integration
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Sparkles className="h-4 w-4" />
          AI-Powered
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="generator">Pitch Generator</TabsTrigger>
          <TabsTrigger value="preview">Pitch Preview</TabsTrigger>
          <TabsTrigger value="brief">Project Brief</TabsTrigger>
          <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
        </TabsList>

        <TabsContent value="generator">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Pitch Generator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PitchGenerator
                brief={sampleBrief}
                caseStudies={sampleCaseStudies}
                onPitchGenerated={handlePitchGenerated}
                onPitchSaved={handlePitchSaved}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          {generatedPitch ? (
            <Card>
              <CardContent className="p-6">
                <PitchPreview
                  pitch={generatedPitch}
                  onEdit={handlePitchEdit}
                  onApprove={handlePitchApprove}
                  onReject={handlePitchReject}
                  onDownload={handleDownload}
                  onShare={handleShare}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Pitch Generated</h3>
                <p className="text-muted-foreground mb-4">
                  Generate a pitch first to see the preview
                </p>
                <Button onClick={() => setActiveTab('generator')}>
                  Go to Generator
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="brief">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Project Brief
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StructuredBriefDisplay
                brief={sampleBrief}
                variant="detailed"
                showActions={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="case-studies">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Case Studies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CaseStudyRecommendations
                brief={sampleBrief}
                onCaseStudySelect={(caseStudy) => console.log('Selected:', caseStudy)}
                onCompareCaseStudies={(caseStudies) => console.log('Comparing:', caseStudies)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>System Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">AI-Powered Generation</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Intelligent content generation based on brief</li>
                <li>• Case study integration and references</li>
                <li>• Industry-specific terminology and approach</li>
                <li>• Structured sections with clear formatting</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Preview & Editing</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Multiple view modes (formatted, raw, print)</li>
                <li>• Inline editing capabilities</li>
                <li>• Version control and tracking</li>
                <li>• Export and sharing functionality</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {generatedPitch && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Generated Pitch Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{generatedPitch.title}</div>
                <div className="text-sm text-muted-foreground">Pitch Title</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{generatedPitch.version}</div>
                <div className="text-sm text-muted-foreground">Version</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{generatedPitch.caseStudyIds.length}</div>
                <div className="text-sm text-muted-foreground">Case Studies Used</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 