export class CaseStudy {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.industry = data.industry;
    this.description = data.description;
    this.relevanceScore = data.relevanceScore || 0;
    this.tags = data.tags || [];
    this.outcome = data.outcome;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static getIndustries() {
    return [
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
  }

  static getTags() {
    return [
      'e-commerce',
      'mobile',
      'performance',
      'CRM',
      'integration',
      'automation',
      'healthcare',
      'patient-management',
      'SaaS',
      'cloud',
      'AI',
      'machine-learning',
      'data-analytics',
      'security',
      'scalability'
    ];
  }

  calculateSimilarityScore(projectBrief) {
    let score = 0;
    
    // Industry match (40% weight)
    if (this.industry === projectBrief.industry) {
      score += 40;
    }
    
    // Tag matching (30% weight)
    const briefKeywords = this.extractKeywords(projectBrief.objectives);
    const matchingTags = this.tags.filter(tag => 
      briefKeywords.some(keyword => 
        keyword.toLowerCase().includes(tag.toLowerCase())
      )
    );
    score += (matchingTags.length / this.tags.length) * 30;
    
    // Budget range compatibility (20% weight)
    if (this.isBudgetCompatible(projectBrief.budget)) {
      score += 20;
    }
    
    // Timeline compatibility (10% weight)
    if (this.isTimelineCompatible(projectBrief.timeline)) {
      score += 10;
    }
    
    return Math.round(score);
  }

  extractKeywords(text) {
    return text.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3)
      .map(word => word.replace(/[^\w]/g, ''));
  }

  isBudgetCompatible(budget) {
    // Simple budget compatibility check
    const budgetRanges = {
      '$5,000 - $10,000': 'small',
      '$10,000 - $25,000': 'small-medium',
      '$25,000 - $50,000': 'medium',
      '$50,000 - $100,000': 'medium-large',
      '$100,000 - $250,000': 'large',
      '$250,000+': 'enterprise'
    };
    
    return budgetRanges[budget] || 'medium';
  }

  isTimelineCompatible(timeline) {
    // Simple timeline compatibility check
    const timelineRanges = {
      '1-2 weeks': 'very-short',
      '3-4 weeks': 'short',
      '1-2 months': 'short-medium',
      '2-3 months': 'medium',
      '3-6 months': 'medium-long',
      '6+ months': 'long'
    };
    
    return timelineRanges[timeline] || 'medium';
  }

  isValid() {
    return (
      this.title &&
      this.industry &&
      this.description &&
      this.outcome
    );
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      industry: this.industry,
      description: this.description,
      relevanceScore: this.relevanceScore,
      tags: this.tags,
      outcome: this.outcome,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

// Mock case study data
export const mockCaseStudies = [
  {
    id: '1',
    title: 'Retail Giant E-commerce Transformation',
    industry: 'Retail',
    description: 'Complete overhaul of legacy e-commerce platform resulting in 300% increase in online sales',
    relevanceScore: 95,
    tags: ['e-commerce', 'mobile', 'performance'],
    outcome: '300% increase in online sales, 50% reduction in cart abandonment',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    title: 'SaaS CRM Integration Success',
    industry: 'Technology',
    description: 'Seamless integration of multiple CRM systems for a growing SaaS company',
    relevanceScore: 88,
    tags: ['CRM', 'integration', 'automation'],
    outcome: '40% improvement in lead conversion, 60% reduction in manual tasks',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    title: 'Healthcare Mobile App Development',
    industry: 'Healthcare',
    description: 'Patient management mobile application with telemedicine capabilities',
    relevanceScore: 92,
    tags: ['mobile', 'healthcare', 'patient-management'],
    outcome: 'Improved patient engagement by 200%, reduced appointment no-shows by 30%',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]; 