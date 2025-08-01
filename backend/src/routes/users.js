import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { User, mockUsers } from '../models/User.js';

const router = express.Router();

// Get all users (team managers only)
router.get('/', [
  authenticateToken,
  requireRole(['team_manager'])
], (req, res) => {
  try {
    const users = mockUsers.map(user => new User(user).toJSON());

    res.json({
      success: true,
      data: users,
      count: users.length
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { role, email } = req.user;

    const userData = mockUsers.find(u => u.id === id);
    
    if (!userData) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Check permissions - users can only view their own profile or team managers can view all
    if (role !== 'team_manager' && userData.email !== email) {
      return res.status(403).json({ 
        error: 'Access denied' 
      });
    }

    const user = new User(userData);

    res.json({
      success: true,
      data: user.toJSON()
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get user permissions
router.get('/:id/permissions', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { role, email } = req.user;

    const userData = mockUsers.find(u => u.id === id);
    
    if (!userData) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Check permissions
    if (role !== 'team_manager' && userData.email !== email) {
      return res.status(403).json({ 
        error: 'Access denied' 
      });
    }

    const user = new User(userData);
    const permissions = User.getRolePermissions(user.role);

    res.json({
      success: true,
      data: {
        userId: user.id,
        role: user.role,
        permissions
      }
    });

  } catch (error) {
    console.error('Get user permissions error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get user statistics
router.get('/stats/overview', [
  authenticateToken,
  requireRole(['team_manager'])
], (req, res) => {
  try {
    const stats = {
      total: mockUsers.length,
      byRole: {
        customer: 0,
        team_manager: 0,
        team_member: 0
      }
    };

    // Calculate role distribution
    mockUsers.forEach(user => {
      stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
    });

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get team members (for assignment purposes)
router.get('/team/members', [
  authenticateToken,
  requireRole(['team_manager'])
], (req, res) => {
  try {
    const teamMembers = mockUsers
      .filter(user => user.role === 'team_member')
      .map(user => new User(user).toJSON());

    res.json({
      success: true,
      data: teamMembers,
      count: teamMembers.length
    });

  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

export default router; 