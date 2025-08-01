import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle, Users } from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalProposals: number;
    approved: number;
    pending: number;
    rejected: number;
    conversionRate: number;
  };
  performance: {
    averageResponseTime: number;
    clientSatisfaction: number;
    teamUtilization: number;
  };
  trends: {
    monthlySubmissions: Array<{ month: string; count: number }>;
    industryBreakdown: Array<{ industry: string; count: number; percentage: number }>;
  };
}

export const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching analytics data
    const fetchAnalytics = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalyticsData({
        overview: {
          totalProposals: 127,
          approved: 89,
          pending: 23,
          rejected: 15,
          conversionRate: 70.1
        },
        performance: {
          averageResponseTime: 3.2,
          clientSatisfaction: 4.6,
          teamUtilization: 82
        },
        trends: {
          monthlySubmissions: [
            { month: 'Jan', count: 18 },
            { month: 'Feb', count: 22 },
            { month: 'Mar', count: 28 },
            { month: 'Apr', count: 31 },
            { month: 'May', count: 28 }
          ],
          industryBreakdown: [
            { industry: 'Technology', count: 45, percentage: 35.4 },
            { industry: 'Healthcare', count: 28, percentage: 22.0 },
            { industry: 'Retail', count: 25, percentage: 19.7 },
            { industry: 'Finance', count: 18, percentage: 14.2 },
            { industry: 'Education', count: 11, percentage: 8.7 }
          ]
        }
      });
      setIsLoading(false);
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of proposal performance and team metrics
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.overview.totalProposals}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +12% from last month
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{analyticsData.overview.approved}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((analyticsData.overview.approved / analyticsData.overview.totalProposals) * 100)}% approval rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{analyticsData.overview.pending}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting manager approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.overview.conversionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +2.1% from last month
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Proposal Status Breakdown</CardTitle>
              <CardDescription>Current distribution of proposal statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Approved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{analyticsData.overview.approved}</span>
                    <Progress 
                      value={(analyticsData.overview.approved / analyticsData.overview.totalProposals) * 100} 
                      className="w-20"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{analyticsData.overview.pending}</span>
                    <Progress 
                      value={(analyticsData.overview.pending / analyticsData.overview.totalProposals) * 100} 
                      className="w-20"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Rejected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{analyticsData.overview.rejected}</span>
                    <Progress 
                      value={(analyticsData.overview.rejected / analyticsData.overview.totalProposals) * 100} 
                      className="w-20"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Response Time</CardTitle>
                <CardDescription>Average time to complete proposals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.performance.averageResponseTime} days</div>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="text-green-600 flex items-center">
                    <TrendingDown className="mr-1 h-3 w-3" />
                    -0.5 days from last month
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Client Satisfaction</CardTitle>
                <CardDescription>Average client rating</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.performance.clientSatisfaction}/5.0</div>
                <div className="flex items-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.floor(analyticsData.performance.clientSatisfaction)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    >
                      ⭐
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team Utilization</CardTitle>
                <CardDescription>Average team capacity usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.performance.teamUtilization}%</div>
                <Progress value={analyticsData.performance.teamUtilization} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Submissions</CardTitle>
                <CardDescription>Proposal submissions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.trends.monthlySubmissions.map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{month.month}</span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(month.count / 31) * 100} 
                          className="w-20"
                        />
                        <span className="text-sm w-8 text-right">{month.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Industry Breakdown</CardTitle>
                <CardDescription>Proposals by industry sector</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.trends.industryBreakdown.map((industry) => (
                    <div key={industry.industry} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{industry.industry}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={industry.percentage} 
                          className="w-20"
                        />
                        <span className="text-sm w-12 text-right">{industry.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};