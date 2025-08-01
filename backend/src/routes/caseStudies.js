import express from 'express';
import { body, validationResult } from 'express-validator';
import { CaseStudy, mockCaseStudies } from '../models/CaseStudy.js';
import { ProjectBrief, mockProjectBriefs } from '../models/ProjectBrief.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

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

// Get case studies with similarity scores for a specific brief
router.get('/recommendations/:briefId', authenticateToken, (req, res) => {
  try {
    const { briefId } = req.params;
    
    const brief = mockProjectBriefs.find(b => b.id === briefId);
    if (!brief) {
      return res.status(404).json({ 
        error: 'Project brief not found' 
      });
    }

    // Calculate similarity scores for all case studies
    const caseStudiesWithScores = mockCaseStudies.map(study => {
      const caseStudy = new CaseStudy(study);
      const relevanceScore = caseStudy.calculateSimilarityScore(brief);
      
      return {
        ...study,
        relevanceScore
      };
    });

    // Sort by relevance score and return top 3
    const recommendations = caseStudiesWithScores
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3);

    res.json({
      success: true,
      data: recommendations,
      brief: brief
    });

  } catch (error) {
    console.error('Get recommendations error:', error);
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

// Create new case study (team managers only)
router.post('/', [
  authenticateToken,
  requireRole(['team_manager']),
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('industry').isIn(CaseStudy.getIndustries()).withMessage('Valid industry is required'),
  body('description').trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('outcome').trim().isLength({ min: 10 }).withMessage('Outcome must be at least 10 characters'),
  body('tags').isArray().withMessage('Tags must be an array')
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

    const { title, industry, description, outcome, tags } = req.body;

    // Create new case study
    const newCaseStudy = new CaseStudy({
      id: Date.now().toString(),
      title,
      industry,
      description,
      outcome,
      tags: tags || [],
      relevanceScore: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Add to mock data (in real app, save to database)
    mockCaseStudies.push(newCaseStudy);

    res.status(201).json({
      success: true,
      message: 'Case study created successfully',
      data: newCaseStudy.toJSON()
    });

  } catch (error) {
    console.error('Create case study error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Update case study (team managers only)
router.put('/:id', [
  authenticateToken,
  requireRole(['team_manager']),
  body('title').optional().trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('industry').optional().isIn(CaseStudy.getIndustries()).withMessage('Valid industry is required'),
  body('description').optional().trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('outcome').optional().trim().isLength({ min: 10 }).withMessage('Outcome must be at least 10 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
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
      ...updateData,
      updatedAt: new Date()
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

// Delete case study (team managers only)
router.delete('/:id', [
  authenticateToken,
  requireRole(['team_manager'])
], (req, res) => {
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

// Get case study statistics
router.get('/stats/overview', authenticateToken, (req, res) => {
  try {
    const stats = {
      total: mockCaseStudies.length,
      byIndustry: {},
      averageRelevanceScore: 0
    };

    // Calculate industry distribution
    mockCaseStudies.forEach(study => {
      stats.byIndustry[study.industry] = (stats.byIndustry[study.industry] || 0) + 1;
    });

    // Calculate average relevance score
    const totalScore = mockCaseStudies.reduce((sum, study) => sum + (study.relevanceScore || 0), 0);
    stats.averageRelevanceScore = mockCaseStudies.length > 0 ? Math.round(totalScore / mockCaseStudies.length) : 0;

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get case study stats error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

export default router; 