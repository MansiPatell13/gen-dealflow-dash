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
    outcome: '300% increase in online sales, 50% reduction in cart abandonment'
  },
  {
    id: '2',
    title: 'SaaS CRM Integration Success',
    industry: 'Technology',
    description: 'Seamless integration of multiple CRM systems for a growing SaaS company',
    relevanceScore: 88,
    tags: ['CRM', 'integration', 'automation'],
    outcome: '40% improvement in lead conversion, 60% reduction in manual tasks'
  },
  {
    id: '3',
    title: 'Healthcare Mobile Solution',
    industry: 'Healthcare',
    description: 'HIPAA-compliant mobile app for patient management and telemedicine',
    relevanceScore: 92,
    tags: ['mobile', 'healthcare', 'compliance'],
    outcome: '85% patient satisfaction increase, 30% reduction in appointment no-shows'
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
    createdAt: '2024-01-21'
  },
  {
    id: '2',
    briefId: '3',
    title: 'Healthcare Mobile App Solution',
    content: 'Our healthcare mobile application will provide secure patient management with HIPAA compliance...',
    status: 'approved',
    createdBy: 'member@pitchforge.com',
    createdAt: '2024-01-18',
    feedback: 'Excellent proposal. Approved for implementation.'
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