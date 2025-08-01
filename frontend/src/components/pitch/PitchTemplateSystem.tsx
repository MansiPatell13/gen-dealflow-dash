import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Settings, 
  Palette, 
  Copy,
  Edit3,
  Eye,
  Star,
  Plus,
  Trash2,
  Save,
  Download,
  Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PitchTemplate {
  id: string;
  name: string;
  description: string;
  industry: string;
  sections: string[];
  content: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PitchTemplateSystemProps {
  onTemplateSelect?: (template: PitchTemplate) => void;
  onTemplateSave?: (template: PitchTemplate) => void;
  onTemplateDelete?: (templateId: string) => void;
  className?: string;
}

// Mock pitch templates
const mockTemplates: PitchTemplate[] = [
  {
    id: '1',
    name: 'Technology Solution Template',
    description: 'Comprehensive template for technology projects with technical focus',
    industry: 'Technology',
    sections: ['Executive Summary', 'Problem Statement', 'Technical Approach', 'Implementation', 'Timeline', 'Outcomes'],
    content: `# Executive Summary

We are excited to present our comprehensive technology solution for your project. Our approach leverages cutting-edge technologies and proven methodologies to deliver exceptional results.

# Problem Statement

Your organization requires a robust technology solution that addresses key challenges and drives business transformation.

# Technical Approach

Our solution utilizes modern technology stack and best practices to ensure scalability, security, and performance.

# Implementation

We will implement a phased approach with clear milestones and deliverables.

# Timeline

Detailed project timeline with key milestones and deliverables.

# Expected Outcomes

Measurable results and ROI projections for your technology investment.`,
    isDefault: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Healthcare Solution Template',
    description: 'HIPAA-compliant template for healthcare projects',
    industry: 'Healthcare',
    sections: ['Executive Summary', 'Problem Statement', 'Compliance Approach', 'Implementation', 'Timeline', 'Outcomes'],
    content: `# Executive Summary

We are excited to present our comprehensive healthcare solution that prioritizes patient care and regulatory compliance.

# Problem Statement

Your healthcare organization requires a solution that addresses patient care challenges while maintaining HIPAA compliance.

# Compliance Approach

Our solution ensures full HIPAA compliance and data security throughout the implementation.

# Implementation

We will implement with healthcare-specific considerations and compliance requirements.

# Timeline

Detailed project timeline with compliance checkpoints and milestones.

# Expected Outcomes

Improved patient care outcomes and operational efficiency while maintaining compliance.`,
    isDefault: false,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '3',
    name: 'Finance Solution Template',
    description: 'Security-focused template for financial services projects',
    industry: 'Finance',
    sections: ['Executive Summary', 'Problem Statement', 'Security Approach', 'Implementation', 'Timeline', 'Outcomes'],
    content: `# Executive Summary

We are excited to present our comprehensive financial solution that prioritizes security and regulatory compliance.

# Problem Statement

Your financial organization requires a solution that addresses operational challenges while maintaining security standards.

# Security Approach

Our solution implements enterprise-grade security and compliance measures.

# Implementation

We will implement with financial industry standards and security requirements.

# Timeline

Detailed project timeline with security reviews and compliance milestones.

# Expected Outcomes

Enhanced operational efficiency and security while maintaining regulatory compliance.`,
    isDefault: false,
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01'
  }
];

export const PitchTemplateSystem: React.FC<PitchTemplateSystemProps> = ({
  onTemplateSelect,
  onTemplateSave,
  onTemplateDelete,
  className
}) => {
  const [templates, setTemplates] = useState<PitchTemplate[]>(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<PitchTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PitchTemplate | null>(null);
  const [activeTab, setActiveTab] = useState('browse');

  const handleTemplateSelect = (template: PitchTemplate) => {
    setSelectedTemplate(template);
    if (onTemplateSelect) {
      onTemplateSelect(template);
    }
  };

  const handleEditTemplate = (template: PitchTemplate) => {
    setEditingTemplate({ ...template });
    setIsEditing(true);
    setActiveTab('edit');
  };

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      const updatedTemplate = {
        ...editingTemplate,
        updatedAt: new Date().toISOString()
      };

      setTemplates(prev => 
        prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t)
      );

      if (onTemplateSave) {
        onTemplateSave(updatedTemplate);
      }

      setIsEditing(false);
      setEditingTemplate(null);
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      if (onTemplateDelete) {
        onTemplateDelete(templateId);
      }
    }
  };

  const handleCreateTemplate = () => {
    const newTemplate: PitchTemplate = {
      id: Date.now().toString(),
      name: 'New Template',
      description: 'Custom pitch template',
      industry: 'Technology',
      sections: ['Executive Summary', 'Problem Statement', 'Solution Approach', 'Implementation', 'Timeline', 'Outcomes'],
      content: `# Executive Summary

[Your executive summary here]

# Problem Statement

[Your problem statement here]

# Solution Approach

[Your solution approach here]

# Implementation

[Your implementation details here]

# Timeline

[Your timeline here]

# Expected Outcomes

[Your expected outcomes here]`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setEditingTemplate(newTemplate);
    setIsEditing(true);
    setActiveTab('edit');
  };

  const renderTemplateCard = (template: PitchTemplate) => (
    <Card key={template.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {template.name}
              {template.isDefault && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Default
                </Badge>
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{template.industry}</Badge>
              <Badge variant="outline">{template.sections.length} sections</Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTemplateSelect(template)}
            >
              <Eye className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditTemplate(template)}
            >
              <Edit3 className="h-3 w-3" />
            </Button>
            {!template.isDefault && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteTemplate(template.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          Updated: {new Date(template.updatedAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );

  const renderTemplateEditor = () => {
    if (!editingTemplate) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              value={editingTemplate.name}
              onChange={(e) => setEditingTemplate({
                ...editingTemplate,
                name: e.target.value
              })}
            />
          </div>
          <div>
            <Label htmlFor="template-industry">Industry</Label>
            <Select
              value={editingTemplate.industry}
              onValueChange={(value) => setEditingTemplate({
                ...editingTemplate,
                industry: value
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="template-description">Description</Label>
          <Textarea
            id="template-description"
            value={editingTemplate.description}
            onChange={(e) => setEditingTemplate({
              ...editingTemplate,
                description: e.target.value
            })}
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="template-content">Template Content</Label>
          <Textarea
            id="template-content"
            value={editingTemplate.content}
            onChange={(e) => setEditingTemplate({
              ...editingTemplate,
                content: e.target.value
            })}
            rows={15}
            className="font-mono text-sm"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveTemplate}>
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
        </div>
      </div>
    );
  };

  const renderTemplatePreview = () => {
    if (!selectedTemplate) {
      return (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Template Selected</h3>
          <p className="text-muted-foreground">
            Select a template to preview its content
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{selectedTemplate.name}</h3>
            <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy Template
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Separator />

        <div className="bg-muted p-4 rounded-md">
          <h4 className="font-semibold mb-2">Template Sections</h4>
          <div className="flex flex-wrap gap-2">
            {selectedTemplate.sections.map((section, index) => (
              <Badge key={index} variant="outline">
                {section}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Template Content</h4>
          <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
            {selectedTemplate.content}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pitch Template System</h2>
          <p className="text-muted-foreground">
            Manage and customize pitch templates for different industries
          </p>
        </div>
        <Button onClick={handleCreateTemplate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="browse">Browse Templates</TabsTrigger>
          <TabsTrigger value="edit">Edit Template</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(template => renderTemplateCard(template))}
          </div>
        </TabsContent>

        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                {isEditing ? 'Edit Template' : 'Template Editor'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? renderTemplateEditor() : (
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Template Selected for Editing</h3>
                  <p className="text-muted-foreground">
                    Select a template from the browse tab to edit it
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardContent className="p-6">
              {renderTemplatePreview()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 