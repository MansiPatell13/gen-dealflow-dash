import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Mock data for case studies
let mockCaseStudies = [
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

// Get all case studies
router.get('/', authenticateToken, (req, res) => {
  try {
    res.json({
      success: true,
      data: mockCaseStudies,
      count: mockCaseStudies.length
    });

  } catch (error) {
    console.error('Get case studies error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get single case study by ID
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    const caseStudy = mockCaseStudies.find(cs => cs.id === id);
    
    if (!caseStudy) {
      return res.status(404).json({ 
        error: 'Case study not found' 
      });
    }

    res.json({
      success: true,
      data: caseStudy
    });

  } catch (error) {
    console.error('Get case study error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Create new case study
router.post('/', [
  authenticateToken,
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('industry').trim().notEmpty().withMessage('Industry is required'),
  body('description').trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('outcome').trim().isLength({ min: 10 }).withMessage('Outcome must be at least 10 characters'),
  body('tags').isArray({ min: 1 }).withMessage('At least one tag is required'),
  body('budget').optional().trim().notEmpty().withMessage('Budget is required if provided'),
  body('timeline').optional().trim().notEmpty().withMessage('Timeline is required if provided')
], (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { title, industry, description, outcome, tags, budget, timeline } = req.body;

    // Create new case study
    const newCaseStudy = {
      id: Date.now().toString(),
      title,
      industry,
      description,
      outcome,
      tags,
      budget,
      timeline,
      relevanceScore: 0, // Will be calculated when used
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Add to mock data
    mockCaseStudies.push(newCaseStudy);

    res.status(201).json({
      success: true,
      message: 'Case study created successfully',
      data: newCaseStudy
    });

  } catch (error) {
    console.error('Create case study error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Update case study
router.put('/:id', [
  authenticateToken,
  body('title').optional().trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('industry').optional().trim().notEmpty().withMessage('Industry is required'),
  body('description').optional().trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('outcome').optional().trim().isLength({ min: 10 }).withMessage('Outcome must be at least 10 characters'),
  body('tags').optional().isArray({ min: 1 }).withMessage('At least one tag is required'),
  body('budget').optional().trim().notEmpty().withMessage('Budget is required if provided'),
  body('timeline').optional().trim().notEmpty().withMessage('Timeline is required if provided')
], (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    const caseStudyIndex = mockCaseStudies.findIndex(cs => cs.id === id);
    
    if (caseStudyIndex === -1) {
      return res.status(404).json({ 
        error: 'Case study not found' 
      });
    }

    // Update case study
    const updatedCaseStudy = {
      ...mockCaseStudies[caseStudyIndex],
      ...updateData
    };

    mockCaseStudies[caseStudyIndex] = updatedCaseStudy;

    res.json({
      success: true,
      message: 'Case study updated successfully',
      data: updatedCaseStudy
    });

  } catch (error) {
    console.error('Update case study error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Delete case study
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    const caseStudyIndex = mockCaseStudies.findIndex(cs => cs.id === id);
    
    if (caseStudyIndex === -1) {
      return res.status(404).json({ 
        error: 'Case study not found' 
      });
    }

    // Remove from mock data
    mockCaseStudies.splice(caseStudyIndex, 1);

    res.json({
      success: true,
      message: 'Case study deleted successfully'
    });

  } catch (error) {
    console.error('Delete case study error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get case study recommendations for a brief
router.get('/recommendations/:briefId', authenticateToken, (req, res) => {
  try {
    const { briefId } = req.params;
    
    // Mock brief data - in real app, this would come from the database
    const mockBrief = {
      id: briefId,
      title: 'Sample Project',
      industry: 'Technology',
      budget: '$50,000 - $100,000',
      timeline: '3-4 months',
      objectives: 'Build a modern web application'
    };

    // Calculate similarity scores for all case studies
    const scoredCaseStudies = mockCaseStudies.map(caseStudy => {
      let score = 0;
      let totalWeight = 0;

      // Industry match (weight: 30%)
      const industryWeight = 0.3;
      if (mockBrief.industry.toLowerCase() === caseStudy.industry.toLowerCase()) {
        score += industryWeight;
      }
      totalWeight += industryWeight;

      // Budget compatibility (weight: 25%)
      const budgetWeight = 0.25;
      if (mockBrief.budget && caseStudy.budget) {
        // Simple budget comparison
        const briefBudget = mockBrief.budget;
        const caseBudget = caseStudy.budget;
        if (briefBudget === caseBudget) {
          score += budgetWeight;
        }
      }
      totalWeight += budgetWeight;

      // Timeline compatibility (weight: 20%)
      const timelineWeight = 0.2;
      if (mockBrief.timeline && caseStudy.timeline) {
        const briefTimeline = mockBrief.timeline;
        const caseTimeline = caseStudy.timeline;
        if (briefTimeline === caseTimeline) {
          score += timelineWeight;
        }
      }
      totalWeight += timelineWeight;

      // Content similarity (weight: 25%)
      const contentWeight = 0.25;
      const briefWords = mockBrief.objectives.toLowerCase().split(/\s+/);
      const caseWords = caseStudy.description.toLowerCase().split(/\s+/);
      const tagWords = caseStudy.tags.map(tag => tag.toLowerCase());

      let matches = 0;
      let totalWords = briefWords.length;

      briefWords.forEach(word => {
        if (caseWords.includes(word) || tagWords.includes(word)) {
          matches++;
        }
      });

      const contentScore = matches / totalWords;
      score += contentScore * contentWeight;
      totalWeight += contentWeight;

      return {
        ...caseStudy,
        relevanceScore: Math.round((score / totalWeight) * 100)
      };
    });

    // Sort by relevance score and return top recommendations
    const recommendations = scoredCaseStudies
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5);

    res.json({
      success: true,
      data: recommendations
    });

  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

export default router; 