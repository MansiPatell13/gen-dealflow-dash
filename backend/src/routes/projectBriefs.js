import express from 'express';
import { body, validationResult } from 'express-validator';
import { ProjectBrief, mockProjectBriefs } from '../models/ProjectBrief.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all project briefs (filtered by user role)
router.get('/', authenticateToken, (req, res) => {
  try {
    const { role, email } = req.user;
    let briefs = [...mockProjectBriefs];

    // Filter based on user role
    if (role === 'customer') {
      briefs = briefs.filter(brief => brief.submittedBy === email);
    } else if (role === 'team_member') {
      briefs = briefs.filter(brief => brief.assignedTo === email);
    }
    // Team managers can see all briefs

    res.json({
      success: true,
      data: briefs,
      count: briefs.length
    });

  } catch (error) {
    console.error('Get briefs error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get single project brief by ID
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { role, email } = req.user;

    const brief = mockProjectBriefs.find(b => b.id === id);
    
    if (!brief) {
      return res.status(404).json({ 
        error: 'Project brief not found' 
      });
    }

    // Check permissions
    if (role === 'customer' && brief.submittedBy !== email) {
      return res.status(403).json({ 
        error: 'Access denied' 
      });
    }

    if (role === 'team_member' && brief.assignedTo !== email) {
      return res.status(403).json({ 
        error: 'Access denied' 
      });
    }

    res.json({
      success: true,
      data: brief
    });

  } catch (error) {
    console.error('Get brief error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Create new project brief
router.post('/', [
  authenticateToken,
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('industry').isIn(ProjectBrief.getIndustries()).withMessage('Valid industry is required'),
  body('budget').isIn(ProjectBrief.getBudgetRanges()).withMessage('Valid budget range is required'),
  body('objectives').trim().isLength({ min: 10 }).withMessage('Objectives must be at least 10 characters'),
  body('timeline').trim().notEmpty().withMessage('Timeline is required'),
  body('clientDetails').trim().isLength({ min: 10 }).withMessage('Client details must be at least 10 characters')
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

    const { title, industry, budget, objectives, timeline, clientDetails } = req.body;
    const { email } = req.user;

    // Create new brief
    const newBrief = new ProjectBrief({
      id: Date.now().toString(),
      title,
      industry,
      budget,
      objectives,
      timeline,
      clientDetails,
      status: 'submitted',
      submittedBy: email,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Add to mock data (in real app, save to database)
    mockProjectBriefs.push(newBrief);

    res.status(201).json({
      success: true,
      message: 'Project brief created successfully',
      data: newBrief.toJSON()
    });

  } catch (error) {
    console.error('Create brief error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Update project brief
router.put('/:id', [
  authenticateToken,
  body('title').optional().trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('industry').optional().isIn(ProjectBrief.getIndustries()).withMessage('Valid industry is required'),
  body('budget').optional().isIn(ProjectBrief.getBudgetRanges()).withMessage('Valid budget range is required'),
  body('objectives').optional().trim().isLength({ min: 10 }).withMessage('Objectives must be at least 10 characters'),
  body('timeline').optional().trim().notEmpty().withMessage('Timeline is required'),
  body('clientDetails').optional().trim().isLength({ min: 10 }).withMessage('Client details must be at least 10 characters'),
  body('status').optional().isIn(ProjectBrief.getStatuses()).withMessage('Valid status is required'),
  body('assignedTo').optional().isEmail().withMessage('Valid email is required for assignment')
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

    const briefIndex = mockProjectBriefs.findIndex(b => b.id === id);
    
    if (briefIndex === -1) {
      return res.status(404).json({ 
        error: 'Project brief not found' 
      });
    }

    const brief = mockProjectBriefs[briefIndex];

    // Check permissions
    if (role === 'customer' && brief.submittedBy !== email) {
      return res.status(403).json({ 
        error: 'Access denied' 
      });
    }

    // Only team managers can assign briefs
    if (updateData.assignedTo && role !== 'team_manager') {
      return res.status(403).json({ 
        error: 'Only team managers can assign briefs' 
      });
    }

    // Update brief
    const updatedBrief = {
      ...brief,
      ...updateData,
      updatedAt: new Date()
    };

    mockProjectBriefs[briefIndex] = updatedBrief;

    res.json({
      success: true,
      message: 'Project brief updated successfully',
      data: updatedBrief
    });

  } catch (error) {
    console.error('Update brief error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Delete project brief
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { role, email } = req.user;

    const briefIndex = mockProjectBriefs.findIndex(b => b.id === id);
    
    if (briefIndex === -1) {
      return res.status(404).json({ 
        error: 'Project brief not found' 
      });
    }

    const brief = mockProjectBriefs[briefIndex];

    // Check permissions - only customers can delete their own briefs
    if (role !== 'customer' || brief.submittedBy !== email) {
      return res.status(403).json({ 
        error: 'Access denied' 
      });
    }

    // Remove from mock data
    mockProjectBriefs.splice(briefIndex, 1);

    res.json({
      success: true,
      message: 'Project brief deleted successfully'
    });

  } catch (error) {
    console.error('Delete brief error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get brief statistics
router.get('/stats/overview', authenticateToken, (req, res) => {
  try {
    const { role, email } = req.user;
    let briefs = [...mockProjectBriefs];

    // Filter based on user role
    if (role === 'customer') {
      briefs = briefs.filter(brief => brief.submittedBy === email);
    } else if (role === 'team_member') {
      briefs = briefs.filter(brief => brief.assignedTo === email);
    }

    const stats = {
      total: briefs.length,
      submitted: briefs.filter(b => b.status === 'submitted').length,
      inProgress: briefs.filter(b => b.status === 'in_progress').length,
      completed: briefs.filter(b => b.status === 'completed').length,
      approved: briefs.filter(b => b.status === 'approved').length,
      rejected: briefs.filter(b => b.status === 'rejected').length
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

export default router; 