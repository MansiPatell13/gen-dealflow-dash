import jwt from 'jsonwebtoken';
import { User, mockUsers } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required' 
      });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ 
          error: 'Invalid or expired token' 
        });
      }

      // Find user in mock data
      const userData = mockUsers.find(user => user.id === decoded.userId);
      if (!userData) {
        return res.status(404).json({ 
          error: 'User not found' 
        });
      }

      // Add user info to request
      req.user = {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        name: userData.name
      };

      next();
    });

  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ 
      error: 'Internal server error during authentication' 
    });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions' 
      });
    }

    next();
  };
};

export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      });
    }

    const userData = mockUsers.find(user => user.id === req.user.id);
    if (!userData) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    const user = new User(userData);
    if (!user.hasPermission(permission)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions' 
      });
    }

    next();
  };
}; 