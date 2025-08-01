import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit3, CheckCircle, X, FileText, Building2, DollarSign, Clock, Target, User, Save, RotateCcw } from 'lucide-react';

interface ParsedBrief {
  title: string;
  industry: string;
  budget: string;
  objectives: string;
  timeline: string;
  clientDetails: string;
}

interface StructuredBriefDisplayProps {
  brief: ParsedBrief;
  onEdit?: (brief: ParsedBrief) => void;
  onSave?: (brief: ParsedBrief) => void;
  onCancel?: () => void;
  isEditing?: boolean;
  showActions?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
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

export const StructuredBriefDisplay: React.FC<StructuredBriefDisplayProps> = ({
  brief,
  onEdit,
  onSave,
  onCancel,
  isEditing = false,
  showActions = true,
  className,
  variant = 'default'
}) => {
  const [editableBrief, setEditableBrief] = useState<ParsedBrief>(brief);
  const [isLocalEditing, setIsLocalEditing] = useState(isEditing);

  const handleFieldChange = (field: keyof ParsedBrief, value: string) => {
    setEditableBrief(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editableBrief);
    }
    setIsLocalEditing(false);
  };

  const handleCancel = () => {
    setEditableBrief(brief);
    setIsLocalEditing(false);
    if (onCancel) {
      onCancel();
    }
  };

  const handleEdit = () => {
    setIsLocalEditing(true);
    if (onEdit) {
      onEdit(editableBrief);
    }
  };

  const isActuallyEditing = isEditing || isLocalEditing;

  const renderCompactView = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{editableBrief.title}</h3>
        <Badge variant="secondary">{editableBrief.industry}</Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span>{editableBrief.budget}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{editableBrief.timeline}</span>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground line-clamp-2">
        {editableBrief.objectives}
      </div>
    </div>
  );

  const renderDetailedView = () => (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">{editableBrief.title}</h3>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Building2 className="h-4 w-4" />
              <span>{editableBrief.industry}</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4" />
              <span>{editableBrief.budget}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{editableBrief.timeline}</span>
            </div>
          </div>
        </div>
        {showActions && !isActuallyEditing && (
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </div>

      <Separator />

      {/* Client Details Section */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <h4 className="font-semibold">Client Details</h4>
        </div>
        {isActuallyEditing ? (
          <Textarea
            value={editableBrief.clientDetails}
            onChange={(e) => handleFieldChange('clientDetails', e.target.value)}
            rows={2}
            placeholder="Provide information about your organization"
          />
        ) : (
          <div className="p-3 bg-muted rounded-md">
            {editableBrief.clientDetails}
          </div>
        )}
      </div>

      {/* Objectives Section */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-muted-foreground" />
          <h4 className="font-semibold">Project Objectives</h4>
        </div>
        {isActuallyEditing ? (
          <Textarea
            value={editableBrief.objectives}
            onChange={(e) => handleFieldChange('objectives', e.target.value)}
            rows={4}
            placeholder="Describe your project goals and requirements"
          />
        ) : (
          <div className="p-3 bg-muted rounded-md whitespace-pre-wrap">
            {editableBrief.objectives}
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && isActuallyEditing && (
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );

  const renderDefaultView = () => (
    <div className="space-y-4">
      {/* Title and Industry */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{editableBrief.title}</h3>
          <Badge variant="secondary">{editableBrief.industry}</Badge>
        </div>
        {showActions && !isActuallyEditing && (
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </div>

      {/* Budget and Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Budget Range</span>
          </Label>
          {isActuallyEditing ? (
            <Select
              value={editableBrief.budget}
              onValueChange={(value) => handleFieldChange('budget', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_RANGES.map((budget) => (
                  <SelectItem key={budget} value={budget}>
                    {budget}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="p-3 bg-muted rounded-md">
              {editableBrief.budget}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Timeline</span>
          </Label>
          {isActuallyEditing ? (
            <Input
              value={editableBrief.timeline}
              onChange={(e) => handleFieldChange('timeline', e.target.value)}
              placeholder="e.g., 3-4 months"
            />
          ) : (
            <div className="p-3 bg-muted rounded-md">
              {editableBrief.timeline}
            </div>
          )}
        </div>
      </div>

      {/* Industry */}
      <div className="space-y-2">
        <Label className="flex items-center space-x-2">
          <Building2 className="h-4 w-4" />
          <span>Industry</span>
        </Label>
        {isActuallyEditing ? (
          <Select
            value={editableBrief.industry}
            onValueChange={(value) => handleFieldChange('industry', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="p-3 bg-muted rounded-md">
            {editableBrief.industry}
          </div>
        )}
      </div>

      {/* Objectives */}
      <div className="space-y-2">
        <Label className="flex items-center space-x-2">
          <Target className="h-4 w-4" />
          <span>Project Objectives</span>
        </Label>
        {isActuallyEditing ? (
          <Textarea
            value={editableBrief.objectives}
            onChange={(e) => handleFieldChange('objectives', e.target.value)}
            rows={3}
            placeholder="Describe your project goals and requirements"
          />
        ) : (
          <div className="p-3 bg-muted rounded-md whitespace-pre-wrap">
            {editableBrief.objectives}
          </div>
        )}
      </div>

      {/* Client Details */}
      <div className="space-y-2">
        <Label className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>Client Details</span>
        </Label>
        {isActuallyEditing ? (
          <Textarea
            value={editableBrief.clientDetails}
            onChange={(e) => handleFieldChange('clientDetails', e.target.value)}
            rows={2}
            placeholder="Provide information about your organization"
          />
        ) : (
          <div className="p-3 bg-muted rounded-md">
            {editableBrief.clientDetails}
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && isActuallyEditing && (
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Project Brief</span>
          {variant === 'compact' && (
            <Badge variant="outline" className="text-xs">Parsed</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {variant === 'compact' && renderCompactView()}
        {variant === 'detailed' && renderDetailedView()}
        {variant === 'default' && renderDefaultView()}
      </CardContent>
    </Card>
  );
}; 