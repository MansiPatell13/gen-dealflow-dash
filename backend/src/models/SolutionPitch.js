export class SolutionPitch {
  constructor(data) {
    this.id = data.id;
    this.briefId = data.briefId;
    this.title = data.title;
    this.content = data.content;
    this.status = data.status || 'draft';
    this.createdBy = data.createdBy;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.feedback = data.feedback;
    this.clientEmail = data.clientEmail;
    this.caseStudyIds = data.caseStudyIds || [];
    this.version = data.version || 1;
  }

  static getStatuses() {
    return ['draft', 'submitted', 'approved', 'rejected', 'finalized'];
  }

  static generatePitchContent(projectBrief, caseStudies) {
    const industry = projectBrief.industry;
    const budget = projectBrief.budget;
    const objectives = projectBrief.objectives;
    const timeline = projectBrief.timeline;

    let content = `# Solution Proposal: ${projectBrief.title}\n\n`;
    
    content += `## Executive Summary\n\n`;
    content += `Based on your requirements for ${objectives}, we propose a comprehensive solution that aligns with your ${budget} budget and ${timeline} timeline. Our approach leverages industry best practices and proven methodologies to deliver exceptional results.\n\n`;
    
    content += `## Our Approach\n\n`;
    content += `We will implement a structured methodology that includes:\n`;
    content += `- **Discovery Phase**: Deep dive into your current systems and requirements\n`;
    content += `- **Design Phase**: Create detailed technical specifications and user experience design\n`;
    content += `- **Development Phase**: Agile development with regular check-ins and demos\n`;
    content += `- **Testing Phase**: Comprehensive testing and quality assurance\n`;
    content += `- **Deployment Phase**: Smooth transition to production with training and support\n\n`;
    
    if (caseStudies && caseStudies.length > 0) {
      content += `## Relevant Case Studies\n\n`;
      caseStudies.forEach((study, index) => {
        content += `### ${index + 1}. ${study.title}\n`;
        content += `**Industry**: ${study.industry}\n`;
        content += `**Outcome**: ${study.outcome}\n`;
        content += `**Relevance Score**: ${study.relevanceScore}%\n\n`;
      });
    }
    
    content += `## Timeline & Deliverables\n\n`;
    content += `Our proposed timeline of ${timeline} includes:\n`;
    content += `- **Week 1-2**: Project kickoff and requirements finalization\n`;
    content += `- **Week 3-6**: Design and architecture development\n`;
    content += `- **Week 7-12**: Core development and testing\n`;
    content += `- **Week 13-14**: Final testing and deployment preparation\n`;
    content += `- **Week 15-16**: Deployment and knowledge transfer\n\n`;
    
    content += `## Investment\n\n`;
    content += `The total investment for this project is ${budget}, which includes:\n`;
    content += `- Project management and coordination\n`;
    content += `- Technical development and implementation\n`;
    content += `- Quality assurance and testing\n`;
    content += `- Deployment and training\n`;
    content += `- 3 months of post-launch support\n\n`;
    
    content += `## Next Steps\n\n`;
    content += `1. **Review & Approval**: Please review this proposal and provide feedback\n`;
    content += `2. **Contract Finalization**: We'll prepare the final contract and timeline\n`;
    content += `3. **Project Kickoff**: Begin the discovery phase and detailed planning\n\n`;
    
    content += `We're excited about the opportunity to partner with you on this project and look forward to your feedback.\n\n`;
    content += `Best regards,\nThe PitchForge Team`;

    return content;
  }

  isValid() {
    return (
      this.briefId &&
      this.title &&
      this.content &&
      this.createdBy
    );
  }

  canTransitionTo(newStatus) {
    const validTransitions = {
      'draft': ['submitted'],
      'submitted': ['approved', 'rejected'],
      'approved': ['finalized'],
      'rejected': ['draft'],
      'finalized': []
    };
    
    return validTransitions[this.status]?.includes(newStatus) || false;
  }

  toJSON() {
    return {
      id: this.id,
      briefId: this.briefId,
      title: this.title,
      content: this.content,
      status: this.status,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      feedback: this.feedback,
      clientEmail: this.clientEmail,
      caseStudyIds: this.caseStudyIds,
      version: this.version
    };
  }
}

// Mock solution pitch data
export const mockSolutionPitches = [
  {
    id: '1',
    briefId: '1',
    title: 'E-commerce Platform Development Proposal',
    content: 'Comprehensive proposal for modern e-commerce platform...',
    status: 'approved',
    createdBy: 'member@pitchforge.com',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-20'),
    feedback: 'Excellent proposal, approved with minor adjustments',
    clientEmail: 'customer@pitchforge.com',
    caseStudyIds: ['1'],
    version: 1
  },
  {
    id: '2',
    briefId: '2',
    title: 'CRM Integration Solution',
    content: 'Detailed proposal for CRM system integration...',
    status: 'submitted',
    createdBy: 'member@pitchforge.com',
    createdAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-23'),
    feedback: null,
    clientEmail: 'customer@pitchforge.com',
    caseStudyIds: ['2'],
    version: 1
  },
  {
    id: '3',
    briefId: '3',
    title: 'Healthcare Mobile App Development',
    content: 'Comprehensive mobile app development proposal...',
    status: 'finalized',
    createdBy: 'member@pitchforge.com',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-25'),
    feedback: 'Project completed successfully',
    clientEmail: 'customer@pitchforge.com',
    caseStudyIds: ['3'],
    version: 1
  }
]; 