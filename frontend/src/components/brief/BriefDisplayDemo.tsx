import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StructuredBriefDisplay } from './StructuredBriefDisplay';

// Sample parsed brief data
const sampleBrief = {
  title: "E-commerce Platform Development",
  industry: "Technology",
  budget: "$50,000 - $100,000",
  objectives: "We need a modern e-commerce platform for our retail business. The platform should include:\n- User authentication and profiles\n- Product catalog with search and filtering\n- Shopping cart and checkout process\n- Payment integration\n- Admin dashboard for inventory management",
  timeline: "3-4 months",
  clientDetails: "TechCorp Inc. - A growing retail company looking to expand online presence"
};

export const BriefDisplayDemo: React.FC = () => {
  const [brief, setBrief] = useState(sampleBrief);

  const handleSave = (updatedBrief: typeof sampleBrief) => {
    setBrief(updatedBrief);
    console.log('Brief updated:', updatedBrief);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Brief Display Demo</h2>
        <p className="text-muted-foreground">
          Showcasing the StructuredBriefDisplay component in different variants
        </p>
      </div>

      <Tabs defaultValue="default" className="space-y-4">
        <TabsList>
          <TabsTrigger value="default">Default View</TabsTrigger>
          <TabsTrigger value="compact">Compact View</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
        </TabsList>

        <TabsContent value="default">
          <Card>
            <CardHeader>
              <CardTitle>Default Variant</CardTitle>
            </CardHeader>
            <CardContent>
              <StructuredBriefDisplay
                brief={brief}
                onSave={handleSave}
                variant="default"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compact">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Compact Variant</CardTitle>
              </CardHeader>
              <CardContent>
                <StructuredBriefDisplay
                  brief={brief}
                  onSave={handleSave}
                  variant="compact"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compact (Read-only)</CardTitle>
              </CardHeader>
              <CardContent>
                <StructuredBriefDisplay
                  brief={brief}
                  showActions={false}
                  variant="compact"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detailed">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Variant</CardTitle>
            </CardHeader>
            <CardContent>
              <StructuredBriefDisplay
                brief={brief}
                onSave={handleSave}
                variant="detailed"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Component Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Display Variants</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Default:</strong> Standard form-like layout</li>
                <li>• <strong>Compact:</strong> Condensed view for lists</li>
                <li>• <strong>Detailed:</strong> Full-featured display</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Interactive Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Inline editing capabilities</li>
                <li>• Save/Cancel actions</li>
                <li>• Read-only mode support</li>
                <li>• Responsive design</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 