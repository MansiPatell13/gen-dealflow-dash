import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Sparkles, 
  Edit3, 
  Eye, 
  Save, 
  RotateCcw,
  BookOpen,
  Target,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectBrief {
  title: string;
  industry: string;
  budget: string;
  objectives: string;
  timeline: string;
  clientDetails: string;
}

interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  description: string;
  relevanceScore: number;
  tags: string[];
  outcome: string;
  budget?: string;
  timeline?: string;
}

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

interface PitchGeneratorProps {
  brief: ProjectBrief;
  caseStudies: CaseStudy[];
  onPitchGenerated?: (pitch: SolutionPitch) => void;
  onPitchSaved?: (pitch: SolutionPitch) => void;
  className?: string;
}

// Mock pitch generation logic
const generateSolutionPitch = async (
  brief: ProjectBrief, 
  caseStudies: CaseStudy[]
): Promise<SolutionPitch> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const relevantCaseStudies = caseStudies
    .filter(cs => cs.relevanceScore >= 60)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 2);

  const pitchTitle = generatePitchTitle(brief);
  const pitchContent = generatePitchContent(brief, relevantCaseStudies);

  return {
    id: Date.now().toString(),
    title: pitchTitle,
    content: pitchContent,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    caseStudyIds: relevantCaseStudies.map(cs => cs.id),
    version: 1
  };
};

const generatePitchTitle = (brief: ProjectBrief): string => {
  const industryKeywords = {
    'Technology': ['Digital', 'Tech', 'Software', 'Platform'],
    'Healthcare': ['Healthcare', 'Medical', 'Patient', 'Clinical'],
    'Finance': ['Financial', 'Banking', 'Investment', 'Trading'],
    'Retail': ['Retail', 'E-commerce', 'Commerce', 'Shopping'],
    'Manufacturing': ['Manufacturing', 'Production', 'Industrial', 'Factory'],
    'Education': ['Educational', 'Learning', 'Academic', 'Training']
  };

  const keywords = industryKeywords[brief.industry as keyof typeof industryKeywords] || ['Professional'];
  const keyword = keywords[Math.floor(Math.random() * keywords.length)];
  
  return `${keyword} ${brief.title} Solution`;
};

const generatePitchContent = (brief: ProjectBrief, caseStudies: CaseStudy[]): string => {
  const sections = [
    generateExecutiveSummary(brief),
    generateProblemStatement(brief),
    generateSolutionApproach(brief, caseStudies),
    generateTechnicalImplementation(brief),
    generateTimelineAndBudget(brief),
    generateExpectedOutcomes(brief, caseStudies),
    generateCaseStudyIntegration(caseStudies),
    generateCallToAction(brief)
  ];

  return sections.join('\n\n');
};

const generateExecutiveSummary = (brief: ProjectBrief): string => {
  return `# Executive Summary

We are excited to present our comprehensive solution for your ${brief.title} project. Based on our analysis of your requirements and industry best practices, we propose a tailored approach that leverages cutting-edge technology and proven methodologies to deliver exceptional results within your ${brief.timeline} timeline and ${brief.budget} budget.

Our solution addresses your core objectives while ensuring scalability, security, and long-term success.`;
};

const generateProblemStatement = (brief: ProjectBrief): string => {
  return `# Problem Statement

Your organization requires a robust solution that addresses the following key challenges:

${brief.objectives.split('\n').map(obj => `- ${obj.trim()}`).join('\n')}

These requirements demand a sophisticated approach that balances technical excellence with practical business needs.`;
};

const generateSolutionApproach = (brief: ProjectBrief, caseStudies: CaseStudy[]): string => {
  const approach = caseStudies.length > 0 
    ? `Our solution approach is informed by successful implementations in similar ${brief.industry} projects, including our work on "${caseStudies[0].title}" which achieved ${caseStudies[0].outcome}.`
    : `Our solution approach leverages industry best practices and proven methodologies for ${brief.industry} projects.`;

  return `# Solution Approach

${approach}

We will implement a phased approach that ensures:
- **Phase 1**: Requirements analysis and architecture design
- **Phase 2**: Core development and integration
- **Phase 3**: Testing, deployment, and optimization
- **Phase 4**: Training, documentation, and ongoing support`;
};

const generateTechnicalImplementation = (brief: ProjectBrief): string => {
  const techStack = brief.industry === 'Technology' 
    ? 'React, Node.js, PostgreSQL, AWS'
    : brief.industry === 'Healthcare'
    ? 'HIPAA-compliant cloud infrastructure, React Native, Node.js'
    : 'Modern web technologies, cloud-native architecture, microservices';

  return `# Technical Implementation

Our technical approach utilizes:
- **Frontend**: Modern, responsive web application
- **Backend**: Scalable, secure API architecture
- **Database**: Robust data management system
- **Infrastructure**: Cloud-native deployment with ${techStack}
- **Security**: Enterprise-grade security protocols
- **Performance**: Optimized for high availability and scalability`;
};

const generateTimelineAndBudget = (brief: ProjectBrief): string => {
  return `# Timeline and Budget

**Project Timeline**: ${brief.timeline}
- Week 1-2: Discovery and planning
- Week 3-6: Development and testing
- Week 7-8: Deployment and optimization
- Week 9-12: Training and support

**Investment**: ${brief.budget}
- Development: 70% of total budget
- Testing and QA: 15% of total budget
- Deployment and training: 10% of total budget
- Ongoing support: 5% of total budget`;
};

const generateExpectedOutcomes = (brief: ProjectBrief, caseStudies: CaseStudy[]): string => {
  const outcomes = caseStudies.length > 0
    ? `Based on our experience with similar projects, we expect:
- Improved efficiency and productivity
- Enhanced user experience and satisfaction
- Reduced operational costs
- Increased scalability and performance
- Measurable ROI within 6-12 months

Our previous work on "${caseStudies[0].title}" delivered ${caseStudies[0].outcome}, demonstrating our ability to exceed expectations.`
    : `Based on industry best practices and our expertise, we expect:
- Improved efficiency and productivity
- Enhanced user experience and satisfaction
- Reduced operational costs
- Increased scalability and performance
- Measurable ROI within 6-12 months`;

  return `# Expected Outcomes

${outcomes}`;
};

const generateCaseStudyIntegration = (caseStudies: CaseStudy[]): string => {
  if (caseStudies.length === 0) {
    return `# Relevant Experience

Our team brings extensive experience in similar projects, with proven track records of successful implementations and measurable business outcomes.`;
  }

  return `# Relevant Experience

Our solution is informed by successful implementations in similar projects:

${caseStudies.map(cs => `**${cs.title}**
- Industry: ${cs.industry}
- Outcome: ${cs.outcome}
- Key Technologies: ${cs.tags.join(', ')}`).join('\n\n')}

These experiences provide valuable insights and proven methodologies for your project.`;
};

const generateCallToAction = (brief: ProjectBrief): string => {
  return `# Next Steps

We're excited to partner with you on this ${brief.title} project. To move forward:

1. **Review and Approval**: Please review this proposal and provide feedback
2. **Kickoff Meeting**: Schedule a detailed project kickoff session
3. **Contract Finalization**: Complete contract and payment terms
4. **Project Launch**: Begin development within 1-2 weeks of approval

We're confident that our approach will deliver exceptional results that exceed your expectations. Let's discuss how we can bring your vision to life.

**Contact**: Ready to discuss your project in detail
**Timeline**: ${brief.timeline} from project approval
**Investment**: ${brief.budget} total project cost`;
};

export const PitchGenerator: React.FC<PitchGeneratorProps> = ({
  brief,
  caseStudies,
  onPitchGenerated,
  onPitchSaved,
  className
}) => {
  const [pitch, setPitch] = useState<SolutionPitch | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPitch, setEditedPitch] = useState<SolutionPitch | null>(null);
  const [activeTab, setActiveTab] = useState('preview');

  useEffect(() => {
    if (pitch) {
      setEditedPitch(pitch);
    }
  }, [pitch]);

  const handleGeneratePitch = async () => {
    setIsGenerating(true);
    try {
      const generatedPitch = await generateSolutionPitch(brief, caseStudies);
      setPitch(generatedPitch);
      if (onPitchGenerated) {
        onPitchGenerated(generatedPitch);
      }
    } catch (error) {
      console.error('Failed to generate pitch:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePitch = () => {
    if (editedPitch && onPitchSaved) {
      const savedPitch = {
        ...editedPitch,
        updatedAt: new Date().toISOString(),
        version: editedPitch.version + 1
      };
      onPitchSaved(savedPitch);
      setPitch(savedPitch);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedPitch(pitch);
    setIsEditing(false);
  };

  const handleContentChange = (field: 'title' | 'content', value: string) => {
    if (editedPitch) {
      setEditedPitch({
        ...editedPitch,
        [field]: value
      });
    }
  };

  const renderPitchPreview = () => {
    if (!pitch) {
      return (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Pitch Generated</h3>
          <p className="text-muted-foreground mb-4">
            Generate a solution pitch based on your project brief and case studies
          </p>
          <Button 
            onClick={handleGeneratePitch} 
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Pitch...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Pitch
              </>
            )}
          </Button>
        </div>
      );
    }

    const currentPitch = isEditing ? editedPitch : pitch;
    if (!currentPitch) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              Version {currentPitch.version}
            </Badge>
            <Badge variant={currentPitch.status === 'draft' ? 'secondary' : 'default'}>
              {currentPitch.status}
            </Badge>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Pitch
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Pitch Title</Label>
            {isEditing ? (
              <Input
                value={currentPitch.title}
                onChange={(e) => handleContentChange('title', e.target.value)}
                className="mt-1"
              />
            ) : (
              <h2 className="text-xl font-semibold mt-1">{currentPitch.title}</h2>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium">Pitch Content</Label>
            {isEditing ? (
              <Textarea
                value={currentPitch.content}
                onChange={(e) => handleContentChange('content', e.target.value)}
                rows={20}
                className="mt-1 font-mono text-sm"
              />
            ) : (
              <div className="mt-1 p-4 bg-muted rounded-md whitespace-pre-wrap font-mono text-sm max-h-96 overflow-y-auto">
                {currentPitch.content}
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCancelEdit}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSavePitch}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderCaseStudyIntegration = () => {
    const relevantCaseStudies = caseStudies
      .filter(cs => cs.relevanceScore >= 60)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Case Study Integration</h3>
          <Badge variant="secondary">{relevantCaseStudies.length} Relevant Studies</Badge>
        </div>

        {relevantCaseStudies.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium mb-2">No Relevant Case Studies</h4>
            <p className="text-muted-foreground">
              No case studies with sufficient relevance scores found for this project.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {relevantCaseStudies.map((caseStudy) => (
              <Card key={caseStudy.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{caseStudy.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {caseStudy.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {caseStudy.industry}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {caseStudy.budget}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {caseStudy.timeline}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {caseStudy.relevanceScore}% Match
                    </Badge>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-sm">
                      <strong>Outcome:</strong> {caseStudy.outcome}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {caseStudy.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderProjectBrief = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Project Brief</h3>
        <Badge variant="secondary">{brief.industry}</Badge>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Project Title</Label>
          <p className="text-sm mt-1">{brief.title}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Budget</Label>
            <p className="text-sm mt-1">{brief.budget}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Timeline</Label>
            <p className="text-sm mt-1">{brief.timeline}</p>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Objectives</Label>
          <div className="mt-1 p-3 bg-muted rounded-md whitespace-pre-wrap text-sm">
            {brief.objectives}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Client Details</Label>
          <p className="text-sm mt-1">{brief.clientDetails}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Solution Pitch Generator</h2>
          <p className="text-muted-foreground">
            AI-powered solution pitch generation based on project brief and case studies
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Sparkles className="h-4 w-4" />
          AI-Powered
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="preview">Pitch Preview</TabsTrigger>
          <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
          <TabsTrigger value="brief">Project Brief</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <Card>
            <CardContent className="p-6">
              {renderPitchPreview()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="case-studies">
          <Card>
            <CardContent className="p-6">
              {renderCaseStudyIntegration()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brief">
          <Card>
            <CardContent className="p-6">
              {renderProjectBrief()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 