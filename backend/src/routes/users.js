import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Mock users data
let mockUsers = [
  {
    id: '1',
    name: 'John Customer',
    email: 'customer@pitchforge.com',
    role: 'customer',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'manager@pitchforge.com',
    role: 'team_manager',
    createdAt: '2024-01-01'
  },
  {
    id: '3',
    name: 'Mike Developer',
    email: 'member@pitchforge.com',
    role: 'team_member',
    createdAt: '2024-01-01'
  }
];

// Get all users (team managers only)
router.get('/', authenticateToken, (req, res) => {
  try {
    const { role } = req.user;

    // Only team managers can see all users
    if (role !== 'team_manager') {
      return res.status(403).json({ 
        error: 'Access denied' 
      });
    }

    res.json({
      success: true,
      data: mockUsers,
      count: mockUsers.length
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get single user by ID
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { role, email } = req.user;

    const user = mockUsers.find(u => u.id === id);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Check permissions - users can only see their own profile, team managers can see all
    if (role !== 'team_manager' && user.email !== email) {
      return res.status(403).json({ 
        error: 'Access denied' 
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Update user profile
router.put('/:id', [
  authenticateToken,
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('role').optional().isIn(['customer', 'team_member', 'team_manager']).withMessage('Valid role is required')
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

    const userIndex = mockUsers.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    const user = mockUsers[userIndex];

    // Check permissions
    if (role !== 'team_manager' && user.email !== email) {
      return res.status(403).json({ 
        error: 'Access denied' 
      });
    }

    // Only team managers can change roles
    if (updateData.role && role !== 'team_manager') {
      return res.status(403).json({ 
        error: 'Only team managers can change user roles' 
      });
    }

    // Update user
    const updatedUser = {
      ...user,
      ...updateData
    };

    mockUsers[userIndex] = updatedUser;

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Delete user (team managers only)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;

    // Only team managers can delete users
    if (role !== 'team_manager') {
      return res.status(403).json({ 
        error: 'Access denied' 
      });
    }

    const userIndex = mockUsers.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Remove from mock data
    mockUsers.splice(userIndex, 1);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get current user profile
router.get('/profile/me', authenticateToken, (req, res) => {
  try {
    const { email } = req.user;

    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Update current user profile
router.put('/profile/me', [
  authenticateToken,
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().withMessage('Valid email is required')
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

    const { email } = req.user;
    const updateData = req.body;

    const userIndex = mockUsers.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Update user
    const updatedUser = {
      ...mockUsers[userIndex],
      ...updateData
    };

    mockUsers[userIndex] = updatedUser;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

export default router; 