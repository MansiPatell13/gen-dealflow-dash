import express from 'express';
import { body, validationResult } from 'express-validator';
import { SolutionPitch, mockSolutionPitches } from '../models/SolutionPitch.js';
import { ProjectBrief, mockProjectBriefs } from '../models/ProjectBrief.js';
import { CaseStudy, mockCaseStudies } from '../models/CaseStudy.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all solution pitches (filtered by user role)
router.get('/', authenticateToken, (req, res) => {
  try {
    const { role, email } = req.user;
    let pitches = [...mockSolutionPitches];

    // Filter based on user role
    if (role === 'customer') {
      pitches = pitches.filter(pitch => pitch.clientEmail === email);
    } else if (role === 'team_member') {
      pitches = pitches.filter(pitch => pitch.createdBy === email);
    }
    // Team managers can see all pitches

    res.json({
      success: true,
      data: pitches,
      count: pitches.length
    });

  } catch (error) {
    console.error('Get pitches error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get single solution pitch by ID
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { role, email } = req.user;

    const pitch = mockSolutionPitches.find(p => p.id === id);
    
    if (!pitch) {
      return res.status(404).json({ 
        error: 'Solution pitch not found' 
      });
    }

    // Check permissions
    if (role === 'customer' && pitch.clientEmail !== email) {
      return res.status(403).json({ 
        error: 'Access denied' 
      });
    }

    if (role === 'team_member' && pitch.createdBy !== email) {
      return res.status(403).json({ 
        error: 'Access denied' 
      });
    }

    res.json({
      success: true,
      data: pitch
    });

  } catch (error) {
    console.error('Get pitch error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Generate solution pitch from brief and case studies
router.post('/generate/:briefId', [
  authenticateToken,
  requireRole(['team_member', 'team_manager'])
], (req, res) => {
  try {
    const { briefId } = req.params;
    const { email } = req.user;

    const brief = mockProjectBriefs.find(b => b.id === briefId);
    if (!brief) {
      return res.status(404).json({ 
        error: 'Project brief not found' 
      });
    }

    // Get recommended case studies
    const caseStudiesWithScores = mockCaseStudies.map(study => {
      const caseStudy = new CaseStudy(study);
      const relevanceScore = caseStudy.calculateSimilarityScore(brief);
      
      return {
        ...study,
        relevanceScore
      };
    });

    const recommendedCaseStudies = caseStudiesWithScores
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3);

    // Generate pitch content
    const content = SolutionPitch.generatePitchContent(brief, recommendedCaseStudies);

    // Create new pitch
    const newPitch = new SolutionPitch({
      id: Date.now().toString(),
      briefId,
      title: `Solution Proposal: ${brief.title}`,
      content,
      status: 'draft',
      createdBy: email,
      clientEmail: brief.submittedBy,
      caseStudyIds: recommendedCaseStudies.map(cs => cs.id),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Add to mock data
    mockSolutionPitches.push(newPitch);

    res.status(201).json({
      success: true,
      message: 'Solution pitch generated successfully',
      data: newPitch.toJSON(),
      recommendedCaseStudies
    });

  } catch (error) {
    console.error('Generate pitch error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Create new solution pitch
router.post('/', [
  authenticateToken,
  requireRole(['team_member', 'team_manager']),
  body('briefId').notEmpty().withMessage('Brief ID is required'),
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('content').trim().isLength({ min: 50 }).withMessage('Content must be at least 50 characters')
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

    const { briefId, title, content, caseStudyIds } = req.body;
    const { email } = req.user;

    // Verify brief exists
    const brief = mockProjectBriefs.find(b => b.id === briefId);
    if (!brief) {
      return res.status(404).json({ 
        error: 'Project brief not found' 
      });
    }

    // Create new pitch
    const newPitch = new SolutionPitch({
      id: Date.now().toString(),
      briefId,
      title,
      content,
      status: 'draft',
      createdBy: email,
      clientEmail: brief.submittedBy,
      caseStudyIds: caseStudyIds || [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Add to mock data
    mockSolutionPitches.push(newPitch);

    res.status(201).json({
      success: true,
      message: 'Solution pitch created successfully',
      data: newPitch.toJSON()
    });

  } catch (error) {
    console.error('Create pitch error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Update solution pitch
router.put('/:id', [
  authenticateToken,
  body('title').optional().trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('content').optional().trim().isLength({ min: 50 }).withMessage('Content must be at least 50 characters'),
  body('status').optional().isIn(SolutionPitch.getStatuses()).withMessage('Valid status is required'),
  body('feedback').optional().trim().isLength({ min: 5 }).withMessage('Feedback must be at least 5 characters')
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
    const { role, email } = req.user;
    const updateData = req.body;

    const pitchIndex = mockSolutionPitches.findIndex(p => p.id === id);
    
    if (pitchIndex === -1) {
      return res.status(404).json({ 
        error: 'Solution pitch not found' 
      });
    }

    const pitch = mockSolutionPitches[pitchIndex];

    // Check permissions
    if (role === 'team_member' && pitch.createdBy !== email) {
      return res.status(403).json({ 
        error: 'Access denied' 
      });
    }

    // Only team managers can change status to approved/rejected
    if (updateData.status && ['approved', 'rejected'].includes(updateData.status) && role !== 'team_manager') {
      return res.status(403).json({ 
        error: 'Only team managers can approve or reject pitches' 
      });
    }

    // Validate status transition
    if (updateData.status && !pitch.canTransitionTo(updateData.status)) {
      return res.status(400).json({ 
        error: 'Invalid status transition' 
      });
    }

    // Update pitch
    const updatedPitch = {
      ...pitch,
      ...updateData,
      updatedAt: new Date()
    };

    mockSolutionPitches[pitchIndex] = updatedPitch;

    res.json({
      success: true,
      message: 'Solution pitch updated successfully',
      data: updatedPitch
    });

  } catch (error) {
    console.error('Update pitch error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Delete solution pitch
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { role, email } = req.user;

    const pitchIndex = mockSolutionPitches.findIndex(p => p.id === id);
    
    if (pitchIndex === -1) {
      return res.status(404).json({ 
        error: 'Solution pitch not found' 
      });
    }

    const pitch = mockSolutionPitches[pitchIndex];

    // Check permissions - only creators can delete their pitches
    if (role !== 'team_member' || pitch.createdBy !== email) {
      return res.status(403).json({ 
        error: 'Access denied' 
      });
    }

    // Remove from mock data
    mockSolutionPitches.splice(pitchIndex, 1);

    res.json({
      success: true,
      message: 'Solution pitch deleted successfully'
    });

  } catch (error) {
    console.error('Delete pitch error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get pitch statistics
router.get('/stats/overview', authenticateToken, (req, res) => {
  try {
    const { role, email } = req.user;
    let pitches = [...mockSolutionPitches];

    // Filter based on user role
    if (role === 'customer') {
      pitches = pitches.filter(pitch => pitch.clientEmail === email);
    } else if (role === 'team_member') {
      pitches = pitches.filter(pitch => pitch.createdBy === email);
    }

    const stats = {
      total: pitches.length,
      draft: pitches.filter(p => p.status === 'draft').length,
      submitted: pitches.filter(p => p.status === 'submitted').length,
      approved: pitches.filter(p => p.status === 'approved').length,
      rejected: pitches.filter(p => p.status === 'rejected').length,
      finalized: pitches.filter(p => p.status === 'finalized').length
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get pitch stats error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

export default router; 