import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  TrendingUp, 
  Target, 
  DollarSign, 
  Clock, 
  Building2, 
  Star,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight
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

interface CaseStudyComparisonProps {
  caseStudies: CaseStudy[];
  onClose?: () => void;
  className?: string;
}

export const CaseStudyComparison: React.FC<CaseStudyComparisonProps> = ({
  caseStudies,
  onClose,
  className
}) => {
  if (caseStudies.length < 2) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Insufficient Data for Comparison</h3>
          <p className="text-muted-foreground">Please select at least 2 case studies to compare.</p>
        </CardContent>
      </Card>
    );
  }

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

  const renderComparisonTable = () => {
    const headers = [
      { key: 'title', label: 'Project Title', icon: BookOpen },
      { key: 'industry', label: 'Industry', icon: Building2 },
      { key: 'budget', label: 'Budget', icon: DollarSign },
      { key: 'timeline', label: 'Timeline', icon: Clock },
      { key: 'relevanceScore', label: 'Relevance Score', icon: TrendingUp },
      { key: 'outcome', label: 'Outcome', icon: Target },
      { key: 'tags', label: 'Tags', icon: Star }
    ];

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-medium">Feature</th>
              {caseStudies.map((caseStudy, index) => (
                <th key={caseStudy.id} className="text-left p-4 font-medium">
                  Case Study {index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {headers.map(header => (
              <tr key={header.key} className="border-b">
                <td className="p-4 font-medium flex items-center gap-2">
                  <header.icon className="h-4 w-4 text-muted-foreground" />
                  {header.label}
                </td>
                {caseStudies.map(caseStudy => (
                  <td key={`${caseStudy.id}-${header.key}`} className="p-4">
                    {renderCell(caseStudy, header.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCell = (caseStudy: CaseStudy, key: string) => {
    switch (key) {
      case 'title':
        return (
          <div className="font-medium text-primary">{caseStudy.title}</div>
        );
      
      case 'industry':
        return (
          <Badge variant="secondary">{caseStudy.industry}</Badge>
        );
      
      case 'budget':
        return (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>{caseStudy.budget}</span>
          </div>
        );
      
      case 'timeline':
        return (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{caseStudy.timeline}</span>
          </div>
        );
      
      case 'relevanceScore':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn("flex items-center gap-1", getScoreColor(caseStudy.relevanceScore))}>
                {getScoreIcon(caseStudy.relevanceScore)}
                {caseStudy.relevanceScore}%
              </Badge>
            </div>
            <Progress value={caseStudy.relevanceScore} className="h-2" />
          </div>
        );
      
      case 'outcome':
        return (
          <div className="text-sm text-muted-foreground max-w-xs">
            {caseStudy.outcome}
          </div>
        );
      
      case 'tags':
        return (
          <div className="flex flex-wrap gap-1">
            {caseStudy.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {caseStudy.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{caseStudy.tags.length - 3} more
              </Badge>
            )}
          </div>
        );
      
      default:
        return <span>{caseStudy[key as keyof CaseStudy]}</span>;
    }
  };

  const renderDetailedComparison = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {caseStudies.map((caseStudy, index) => (
        <Card key={caseStudy.id} className="h-fit">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Case Study {index + 1}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{caseStudy.industry}</Badge>
                  <Badge variant="outline" className={cn("flex items-center gap-1", getScoreColor(caseStudy.relevanceScore))}>
                    {getScoreIcon(caseStudy.relevanceScore)}
                    {caseStudy.relevanceScore}% Match
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">{caseStudy.title}</h4>
              <p className="text-sm text-muted-foreground">{caseStudy.description}</p>
            </div>

            <Separator />

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

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Tags</span>
              </div>
              <div className="flex flex-wrap gap-1">
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
  );

  const renderSummary = () => {
    const bestMatch = caseStudies.reduce((best, current) => 
      current.relevanceScore > best.relevanceScore ? current : best
    );

    const avgScore = Math.round(
      caseStudies.reduce((sum, cs) => sum + cs.relevanceScore, 0) / caseStudies.length
    );

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Comparison Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{avgScore}%</div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{bestMatch.relevanceScore}%</div>
              <div className="text-sm text-muted-foreground">Best Match</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{caseStudies.length}</div>
              <div className="text-sm text-muted-foreground">Studies Compared</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Case Study Comparison</h2>
          <p className="text-muted-foreground">
            Detailed comparison of {caseStudies.length} selected case studies
          </p>
        </div>
        {onClose && (
          <Badge variant="secondary" className="cursor-pointer" onClick={onClose}>
            Close Comparison
          </Badge>
        )}
      </div>

      {renderSummary()}

      <Tabs defaultValue="detailed" className="space-y-4">
        <TabsList>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="detailed">
          {renderDetailedComparison()}
        </TabsContent>

        <TabsContent value="table">
          <Card>
            <CardContent className="p-0">
              {renderComparisonTable()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 