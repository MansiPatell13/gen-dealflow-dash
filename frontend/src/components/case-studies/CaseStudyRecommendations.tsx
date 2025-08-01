import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  TrendingUp, 
  Target, 
  DollarSign, 
  Clock, 
  Building2, 
  Star, 
  Eye,
  GitCompare,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  description: string;
  relevanceScore: number;
  tags: string[];
  outcome: string;
  budget: string;
  timeline: string;
  createdAt: string;
}

interface ProjectBrief {
  title: string;
  industry: string;
  budget: string;
  objectives: string;
  timeline: string;
  clientDetails: string;
}

interface CaseStudyRecommendationsProps {
  brief: ProjectBrief;
  onCaseStudySelect?: (caseStudy: CaseStudy) => void;
  onCompareCaseStudies?: (caseStudies: CaseStudy[]) => void;
  className?: string;
}

// Mock case studies data - in a real app, this would come from an API
const mockCaseStudies: CaseStudy[] = [
  {
    id: '1',
    title: 'E-commerce Platform for Retail Chain',
    industry: 'Technology',
    description: 'Developed a comprehensive e-commerce platform for a major retail chain, including user authentication, product catalog, shopping cart, payment integration, and admin dashboard.',
    relevanceScore: 0,
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
    relevanceScore: 0,
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
    relevanceScore: 0,
    tags: ['finance', 'analytics', 'dashboard', 'real-time', 'reporting'],
    outcome: 'Enhanced decision-making capabilities with 50% faster data insights.',
    budget: '$75,000 - $150,000',
    timeline: '4-5 months',
    createdAt: '2024-03-10'
  },
  {
    id: '4',
    title: 'Educational Learning Platform',
    industry: 'Education',
    description: 'Developed an online learning platform with course management, student progress tracking, interactive assessments, and video conferencing.',
    relevanceScore: 0,
    tags: ['education', 'learning', 'course-management', 'assessment', 'video'],
    outcome: 'Increased student engagement by 60% and improved learning outcomes.',
    budget: '$60,000 - $120,000',
    timeline: '5-6 months',
    createdAt: '2024-01-30'
  },
  {
    id: '5',
    title: 'Manufacturing Process Optimization',
    industry: 'Manufacturing',
    description: 'Implemented IoT-based process optimization system for a manufacturing plant, including real-time monitoring, predictive maintenance, and quality control.',
    relevanceScore: 0,
    tags: ['manufacturing', 'iot', 'optimization', 'monitoring', 'maintenance'],
    outcome: 'Reduced production costs by 25% and improved quality by 30%.',
    budget: '$150,000 - $300,000',
    timeline: '8-10 months',
    createdAt: '2024-02-15'
  },
  {
    id: '6',
    title: 'Real Estate Management System',
    industry: 'Real Estate',
    description: 'Built a comprehensive property management system with tenant portal, maintenance tracking, financial reporting, and document management.',
    relevanceScore: 0,
    tags: ['real-estate', 'property-management', 'tenant-portal', 'maintenance', 'reporting'],
    outcome: 'Streamlined operations and improved tenant satisfaction scores.',
    budget: '$40,000 - $80,000',
    timeline: '3-4 months',
    createdAt: '2024-03-05'
  }
];

// Similarity scoring algorithm
const calculateSimilarityScore = (brief: ProjectBrief, caseStudy: CaseStudy): number => {
  let score = 0;
  let totalWeight = 0;

  // Industry match (weight: 30%)
  const industryWeight = 0.3;
  if (brief.industry.toLowerCase() === caseStudy.industry.toLowerCase()) {
    score += industryWeight;
  }
  totalWeight += industryWeight;

  // Budget compatibility (weight: 25%)
  const budgetWeight = 0.25;
  const briefBudget = parseBudget(brief.budget);
  const caseBudget = parseBudget(caseStudy.budget);
  if (isBudgetCompatible(briefBudget, caseBudget)) {
    score += budgetWeight;
  }
  totalWeight += budgetWeight;

  // Timeline compatibility (weight: 20%)
  const timelineWeight = 0.2;
  const briefTimeline = parseTimeline(brief.timeline);
  const caseTimeline = parseTimeline(caseStudy.timeline);
  if (isTimelineCompatible(briefTimeline, caseTimeline)) {
    score += timelineWeight;
  }
  totalWeight += timelineWeight;

  // Content similarity (weight: 25%)
  const contentWeight = 0.25;
  const contentScore = calculateContentSimilarity(brief.objectives, caseStudy.description, caseStudy.tags);
  score += contentScore * contentWeight;
  totalWeight += contentWeight;

  return Math.round((score / totalWeight) * 100);
};

const parseBudget = (budget: string): { min: number; max: number } => {
  const numbers = budget.match(/\$?([\d,]+)/g);
  if (numbers && numbers.length >= 2) {
    const min = parseInt(numbers[0].replace(/[$,]/g, ''));
    const max = parseInt(numbers[1].replace(/[$,]/g, ''));
    return { min, max };
  }
  return { min: 0, max: 0 };
};

const parseTimeline = (timeline: string): { min: number; max: number } => {
  const numbers = timeline.match(/(\d+)/g);
  if (numbers && numbers.length >= 2) {
    const min = parseInt(numbers[0]);
    const max = parseInt(numbers[1]);
    return { min, max };
  }
  return { min: 0, max: 0 };
};

const isBudgetCompatible = (briefBudget: { min: number; max: number }, caseBudget: { min: number; max: number }): boolean => {
  return briefBudget.max >= caseBudget.min && briefBudget.min <= caseBudget.max;
};

const isTimelineCompatible = (briefTimeline: { min: number; max: number }, caseTimeline: { min: number; max: number }): boolean => {
  return briefTimeline.max >= caseTimeline.min && briefTimeline.min <= caseTimeline.max;
};

const calculateContentSimilarity = (briefObjectives: string, caseDescription: string, caseTags: string[]): number => {
  const briefWords = briefObjectives.toLowerCase().split(/\s+/);
  const caseWords = caseDescription.toLowerCase().split(/\s+/);
  const tagWords = caseTags.map(tag => tag.toLowerCase());

  let matches = 0;
  let totalWords = briefWords.length;

  briefWords.forEach(word => {
    if (caseWords.includes(word) || tagWords.includes(word)) {
      matches++;
    }
  });

  return matches / totalWords;
};

const getRecommendedCaseStudies = (brief: ProjectBrief, caseStudies: CaseStudy[], limit: number = 3): CaseStudy[] => {
  // Calculate similarity scores for all case studies
  const scoredCaseStudies = caseStudies.map(caseStudy => ({
    ...caseStudy,
    relevanceScore: calculateSimilarityScore(brief, caseStudy)
  }));

  // Sort by relevance score and return top recommendations
  return scoredCaseStudies
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
};

export const CaseStudyRecommendations: React.FC<CaseStudyRecommendationsProps> = ({
  brief,
  onCaseStudySelect,
  onCompareCaseStudies,
  className
}) => {
  const [recommendations, setRecommendations] = useState<CaseStudy[]>([]);
  const [selectedCaseStudies, setSelectedCaseStudies] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('recommendations');

  useEffect(() => {
    const recommended = getRecommendedCaseStudies(brief, mockCaseStudies);
    setRecommendations(recommended);
  }, [brief]);

  const handleCaseStudySelect = (caseStudy: CaseStudy) => {
    if (onCaseStudySelect) {
      onCaseStudySelect(caseStudy);
    }
  };

  const handleCaseStudyToggle = (caseStudyId: string) => {
    const newSelected = new Set(selectedCaseStudies);
    if (newSelected.has(caseStudyId)) {
      newSelected.delete(caseStudyId);
    } else {
      newSelected.add(caseStudyId);
    }
    setSelectedCaseStudies(newSelected);
  };

  const handleCompare = () => {
    const selectedCases = recommendations.filter(cs => selectedCaseStudies.has(cs.id));
    if (onCompareCaseStudies && selectedCases.length >= 2) {
      onCompareCaseStudies(selectedCases);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4" />;
    if (score >= 60) return <AlertCircle className="h-4 w-4" />;
    return <Info className="h-4 w-4" />;
  };

  const renderCaseStudyCard = (caseStudy: CaseStudy, showSelect: boolean = false) => (
    <Card key={caseStudy.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {caseStudy.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">{caseStudy.industry}</Badge>
              <Badge variant="outline" className={cn("flex items-center gap-1", getScoreColor(caseStudy.relevanceScore))}>
                {getScoreIcon(caseStudy.relevanceScore)}
                {caseStudy.relevanceScore}% Match
              </Badge>
            </div>
          </div>
          {showSelect && (
            <Button
              variant={selectedCaseStudies.has(caseStudy.id) ? "default" : "outline"}
              size="sm"
              onClick={() => handleCaseStudyToggle(caseStudy.id)}
            >
              {selectedCaseStudies.has(caseStudy.id) ? "Selected" : "Select"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">{caseStudy.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>{caseStudy.budget}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{caseStudy.timeline}</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Outcome</span>
          </div>
          <p className="text-sm text-muted-foreground">{caseStudy.outcome}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Relevance Score</span>
          </div>
          <div className="space-y-2">
            <Progress value={caseStudy.relevanceScore} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {caseStudy.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCaseStudySelect(caseStudy)}
            className="flex items-center gap-1"
          >
            <Eye className="h-3 w-3" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderComparisonView = () => {
    const selectedCases = recommendations.filter(cs => selectedCaseStudies.has(cs.id));
    
    if (selectedCases.length < 2) {
      return (
                 <div className="text-center py-8">
           <GitCompare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
           <h3 className="text-lg font-medium mb-2">Select Case Studies to Compare</h3>
           <p className="text-muted-foreground">Choose at least 2 case studies to compare their features and outcomes.</p>
         </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Comparison View</h3>
                     <Button onClick={handleCompare} className="flex items-center gap-2">
             <GitCompare className="h-4 w-4" />
             Compare Selected
           </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedCases.map(caseStudy => renderCaseStudyCard(caseStudy, false))}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Recommended Case Studies</h2>
          <p className="text-muted-foreground">
            Based on your project brief, here are the most relevant case studies
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Star className="h-4 w-4" />
          AI-Powered Recommendations
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="recommendations">Top Recommendations</TabsTrigger>
          <TabsTrigger value="compare">Compare Studies</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {recommendations.map(caseStudy => renderCaseStudyCard(caseStudy, true))}
          </div>
        </TabsContent>

        <TabsContent value="compare">
          {renderComparisonView()}
        </TabsContent>
      </Tabs>

      {selectedCaseStudies.size > 0 && (
                 <div className="fixed bottom-4 right-4">
           <Button onClick={handleCompare} className="flex items-center gap-2 shadow-lg">
             <GitCompare className="h-4 w-4" />
             Compare {selectedCaseStudies.size} Studies
           </Button>
         </div>
      )}
    </div>
  );
}; 