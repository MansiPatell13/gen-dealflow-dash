export interface ProjectBrief {
  id: string;
  title: string;
  industry: string;
  budget: string;
  objectives: string;
  timeline: string;
  clientDetails: string;
  status: 'submitted' | 'in_progress' | 'completed' | 'approved';
  submittedBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  description: string;
  relevanceScore: number;
  tags: string[];
  outcome: string;
  budget?: string;
  timeline?: string;
  createdAt?: string;
}

export interface SolutionPitch {
  id: string;
  briefId: string;
  title: string;
  content: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  createdBy: string;
  createdAt: string;
  feedback?: string;
  clientEmail?: string;
  caseStudyIds?: string[];
  version?: number;
}

export const mockProjectBriefs: ProjectBrief[] = [
  {
    id: '1',
    title: 'E-commerce Platform Development',
    industry: 'Retail',
    budget: '$50,000 - $100,000',
    objectives: 'Build a modern e-commerce platform with mobile responsiveness',
    timeline: '3-4 months',
    clientDetails: 'TechCorp Inc. - Mid-size retailer looking to expand online',
    status: 'in_progress',
    submittedBy: 'customer@pitchforge.com',
    assignedTo: 'member@pitchforge.com',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    title: 'CRM System Integration',
    industry: 'Technology',
    budget: '$25,000 - $50,000',
    objectives: 'Integrate existing CRM with new marketing automation tools',
    timeline: '6-8 weeks',
    clientDetails: 'DataFlow Solutions - SaaS company with 500+ users',
    status: 'submitted',
    submittedBy: 'customer@pitchforge.com',
    createdAt: '2024-01-22',
    updatedAt: '2024-01-22'
  },
  {
    id: '3',
    title: 'Mobile App Development',
    industry: 'Healthcare',
    budget: '$75,000 - $150,000',
    objectives: 'Create patient management mobile application',
    timeline: '4-6 months',
    clientDetails: 'HealthTech Partners - Healthcare provider network',
    status: 'completed',
    submittedBy: 'customer@pitchforge.com',
    assignedTo: 'member@pitchforge.com',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-25'
  }
];

export const mockCaseStudies: CaseStudy[] = [
  {
    id: '1',
    title: 'Retail Giant E-commerce Transformation',
    industry: 'Retail',
    description: 'Complete overhaul of legacy e-commerce platform resulting in 300% increase in online sales',
    relevanceScore: 95,
    tags: ['e-commerce', 'mobile', 'performance'],
    outcome: '300% increase in online sales, 50% reduction in cart abandonment',
    budget: '$50,000 - $100,000',
    timeline: '3-4 months',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'SaaS CRM Integration Success',
    industry: 'Technology',
    description: 'Seamless integration of multiple CRM systems for a growing SaaS company',
    relevanceScore: 88,
    tags: ['CRM', 'integration', 'automation'],
    outcome: '40% improvement in lead conversion, 60% reduction in manual tasks',
    budget: '$25,000 - $50,000',
    timeline: '6-8 weeks',
    createdAt: '2024-02-20'
  },
  {
    id: '3',
    title: 'Healthcare Mobile Solution',
    industry: 'Healthcare',
    description: 'HIPAA-compliant mobile app for patient management and telemedicine',
    relevanceScore: 92,
    tags: ['mobile', 'healthcare', 'compliance'],
    outcome: '85% patient satisfaction increase, 30% reduction in appointment no-shows',
    budget: '$75,000 - $150,000',
    timeline: '4-6 months',
    createdAt: '2024-03-10'
  }
];

export const mockSolutionPitches: SolutionPitch[] = [
  {
    id: '1',
    briefId: '1',
    title: 'Modern E-commerce Platform Proposal',
    content: 'We propose building a scalable e-commerce platform using React, Node.js, and cloud infrastructure...',
    status: 'submitted',
    createdBy: 'member@pitchforge.com',
    createdAt: '2024-01-21',
    clientEmail: 'customer@pitchforge.com'
  },
  {
    id: '2',
    briefId: '3',
    title: 'Healthcare Mobile App Solution',
    content: 'Our healthcare mobile application will provide secure patient management with HIPAA compliance...',
    status: 'approved',
    createdBy: 'member@pitchforge.com',
    createdAt: '2024-01-18',
    feedback: 'Excellent proposal. Approved for implementation.',
    clientEmail: 'customer@pitchforge.com'
  }
];

// Mock API functions
export const fetchProjectBriefs = async (userRole?: string, userId?: string): Promise<ProjectBrief[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (userRole === 'customer') {
    return mockProjectBriefs.filter(brief => brief.submittedBy === userId);
  }
  
  return mockProjectBriefs;
};

export const fetchCaseStudies = async (): Promise<CaseStudy[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockCaseStudies;
};

export const fetchSolutionPitches = async (briefId?: string): Promise<SolutionPitch[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (briefId) {
    return mockSolutionPitches.filter(pitch => pitch.briefId === briefId);
  }
  
  return mockSolutionPitches;
};

export const submitProjectBrief = async (brief: Omit<ProjectBrief, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProjectBrief> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newBrief: ProjectBrief = {
    ...brief,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  };
  
  mockProjectBriefs.push(newBrief);
  return newBrief;
};

// Similarity scoring algorithm for case study recommendations
export const calculateSimilarityScore = (brief: ProjectBrief, caseStudy: CaseStudy): number => {
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
  const caseBudget = parseBudget(caseStudy.budget || '$0 - $0');
  if (isBudgetCompatible(briefBudget, caseBudget)) {
    score += budgetWeight;
  }
  totalWeight += budgetWeight;

  // Timeline compatibility (weight: 20%)
  const timelineWeight = 0.2;
  const briefTimeline = parseTimeline(brief.timeline);
  const caseTimeline = parseTimeline(caseStudy.timeline || '0-0 months');
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

export const getRecommendedCaseStudies = async (brief: ProjectBrief, limit: number = 3): Promise<CaseStudy[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Calculate similarity scores for all case studies
  const scoredCaseStudies = mockCaseStudies.map(caseStudy => ({
    ...caseStudy,
    relevanceScore: calculateSimilarityScore(brief, caseStudy)
  }));

  // Sort by relevance score and return top recommendations
  return scoredCaseStudies
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
};

// Solution Pitch Generation
export const generateSolutionPitch = async (
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
    createdBy: 'member@pitchforge.com',
    createdAt: new Date().toISOString(),
    briefId: brief.id || 'temp-brief-id',
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