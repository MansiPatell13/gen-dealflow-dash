export class ProjectBrief {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.industry = data.industry;
    this.budget = data.budget;
    this.objectives = data.objectives;
    this.timeline = data.timeline;
    this.clientDetails = data.clientDetails;
    this.status = data.status || 'submitted';
    this.submittedBy = data.submittedBy;
    this.assignedTo = data.assignedTo;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static getStatuses() {
    return ['submitted', 'in_progress', 'completed', 'approved', 'rejected'];
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

  static getBudgetRanges() {
    return [
      '$5,000 - $10,000',
      '$10,000 - $25,000',
      '$25,000 - $50,000',
      '$50,000 - $100,000',
      '$100,000 - $250,000',
      '$250,000+'
    ];
  }

  isValid() {
    return (
      this.title &&
      this.industry &&
      this.budget &&
      this.objectives &&
      this.timeline &&
      this.clientDetails &&
      this.submittedBy
    );
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      industry: this.industry,
      budget: this.budget,
      objectives: this.objectives,
      timeline: this.timeline,
      clientDetails: this.clientDetails,
      status: this.status,
      submittedBy: this.submittedBy,
      assignedTo: this.assignedTo,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

// Mock project brief data
export const mockProjectBriefs = [
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
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
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
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
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
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-25')
  }
]; 