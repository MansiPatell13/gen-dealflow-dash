import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CaseStudyRecommendations } from './CaseStudyRecommendations';
import { CaseStudyComparison } from './CaseStudyComparison';
import { StructuredBriefDisplay } from '../brief/StructuredBriefDisplay';
import { BookOpen, Star, TrendingUp } from 'lucide-react';

// Sample project brief for demonstration
const sampleBrief = {
  title: "E-commerce Platform Development",
  industry: "Technology",
  budget: "$50,000 - $100,000",
  objectives: "We need a modern e-commerce platform for our retail business. The platform should include user authentication and profiles, product catalog with search and filtering, shopping cart and checkout process, payment integration, and admin dashboard for inventory management.",
  timeline: "3-4 months",
  clientDetails: "TechCorp Inc. - A growing retail company looking to expand online presence"
};

export const CaseStudyRecommendationsDemo: React.FC = () => {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<any>(null);
  const [comparingCaseStudies, setComparingCaseStudies] = useState<any[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const handleCaseStudySelect = (caseStudy: any) => {
    setSelectedCaseStudy(caseStudy);
  };

  const handleCompareCaseStudies = (caseStudies: any[]) => {
    setComparingCaseStudies(caseStudies);
    setShowComparison(true);
  };

  const handleCloseComparison = () => {
    setShowComparison(false);
    setComparingCaseStudies([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Case Study Recommendation System</h2>
          <p className="text-muted-foreground">
            AI-powered case study recommendations based on project brief analysis
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Star className="h-4 w-4" />
          AI-Powered
        </Badge>
      </div>

      <Tabs defaultValue="recommendations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="brief">Project Brief</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Recommended Case Studies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CaseStudyRecommendations
                brief={sampleBrief}
                onCaseStudySelect={handleCaseStudySelect}
                onCompareCaseStudies={handleCompareCaseStudies}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          {showComparison && comparingCaseStudies.length > 0 ? (
            <Card>
              <CardContent className="p-6">
                <CaseStudyComparison
                  caseStudies={comparingCaseStudies}
                  onClose={handleCloseComparison}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Comparison Available</h3>
                <p className="text-muted-foreground">
                  Select case studies from the recommendations tab to compare them.
                </p>
                <Button 
                  onClick={() => {
                    const element = document.querySelector('[data-value="recommendations"]') as HTMLElement;
                    if (element) element.click();
                  }}
                  className="mt-4"
                >
                  View Recommendations
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="brief">
          <Card>
            <CardHeader>
              <CardTitle>Project Brief Analysis</CardTitle>
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
      </Tabs>

      {selectedCaseStudy && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Selected Case Study Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedCaseStudy.title}</h3>
                <Badge variant="outline">{selectedCaseStudy.industry}</Badge>
              </div>
              <p className="text-muted-foreground">{selectedCaseStudy.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Budget:</strong> {selectedCaseStudy.budget}
                </div>
                <div>
                  <strong>Timeline:</strong> {selectedCaseStudy.timeline}
                </div>
              </div>
              <div>
                <strong>Outcome:</strong> {selectedCaseStudy.outcome}
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedCaseStudy.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>System Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">AI-Powered Recommendations</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Industry-based matching (30% weight)</li>
                <li>• Budget compatibility analysis (25% weight)</li>
                <li>• Timeline compatibility (20% weight)</li>
                <li>• Content similarity scoring (25% weight)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Comparison Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Side-by-side case study comparison</li>
                <li>• Detailed and table view options</li>
                <li>• Relevance score visualization</li>
                <li>• Tag-based filtering and analysis</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 