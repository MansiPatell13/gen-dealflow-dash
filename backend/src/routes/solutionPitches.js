import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Mock data for solution pitches
let mockSolutionPitches = [
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

// Get all solution pitches (filtered by user role)
router.get('/', authenticateToken, (req, res) => {
  try {
    const { role, email } = req.user;
    let pitches = [...mockSolutionPitches];

    // Filter based on user role
    if (role === 'team_member') {
      pitches = pitches.filter(pitch => pitch.createdBy === email);
    } else if (role === 'customer') {
      pitches = pitches.filter(pitch => pitch.clientEmail === email);
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
    if (role === 'team_member' && pitch.createdBy !== email) {
      return res.status(403).json({ 
        error: 'Access denied' 
      });
    }

    if (role === 'customer' && pitch.clientEmail !== email) {
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

// Create new solution pitch
router.post('/', [
  authenticateToken,
  body('briefId').notEmpty().withMessage('Brief ID is required'),
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('status').isIn(['draft', 'submitted', 'approved', 'rejected']).withMessage('Valid status is required'),
  body('clientEmail').isEmail().withMessage('Valid client email is required')
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

    const { briefId, title, content, status, clientEmail } = req.body;
    const { email } = req.user;

    // Create new pitch
    const newPitch = {
      id: Date.now().toString(),
      briefId,
      title,
      content,
      status,
      createdBy: email,
      clientEmail,
      createdAt: new Date().toISOString()
    };

    // Add to mock data
    mockSolutionPitches.push(newPitch);

    res.status(201).json({
      success: true,
      message: 'Solution pitch created successfully',
      data: newPitch
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
  body('content').optional().trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('status').optional().isIn(['draft', 'submitted', 'approved', 'rejected']).withMessage('Valid status is required'),
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

    // Only team managers can provide feedback
    if (updateData.feedback && role !== 'team_manager') {
      return res.status(403).json({ 
        error: 'Only team managers can provide feedback' 
      });
    }

    // Update pitch
    const updatedPitch = {
      ...pitch,
      ...updateData
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

// Generate solution pitch (AI-powered)
router.post('/generate', authenticateToken, (req, res) => {
  try {
    const { briefId, caseStudyIds } = req.body;
    const { email } = req.user;

    // Mock AI generation - in real app, this would call an AI service
    const generatedPitch = {
      id: Date.now().toString(),
      briefId,
      title: `AI-Generated Solution for Brief ${briefId}`,
      content: `This is an AI-generated solution pitch based on the project brief and relevant case studies. The solution includes:

1. Executive Summary
- Comprehensive approach to the project requirements
- Leveraging industry best practices and proven methodologies

2. Technical Approach
- Modern technology stack selection
- Scalable architecture design
- Security and performance considerations

3. Implementation Plan
- Phased delivery approach
- Clear milestones and deliverables
- Risk mitigation strategies

4. Expected Outcomes
- Measurable business impact
- ROI projections
- Long-term value creation

This solution is tailored to meet the specific requirements outlined in the project brief while incorporating insights from successful similar projects.`,
      status: 'draft',
      createdBy: email,
      createdAt: new Date().toISOString(),
      caseStudyIds: caseStudyIds || []
    };

    // Add to mock data
    mockSolutionPitches.push(generatedPitch);

    res.json({
      success: true,
      message: 'Solution pitch generated successfully',
      data: generatedPitch
    });

  } catch (error) {
    console.error('Generate pitch error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

export default router; 