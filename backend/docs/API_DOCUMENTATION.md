# API Documentation

## Overview

This document provides comprehensive API documentation for the PitchForge backend API. All endpoints are RESTful and return JSON responses.

**Base URL**: `http://localhost:3001/api/v1`

**Authentication**: JWT Bearer token required for protected endpoints

## Authentication

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## API Endpoints

### 1. Authentication Endpoints

#### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "customer",
      "permissions": ["read:briefs", "write:briefs"]
    }
  }
}
```

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "Jane Smith",
  "role": "customer"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "2",
      "email": "newuser@example.com",
      "name": "Jane Smith",
      "role": "customer",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### POST /auth/refresh
Refresh JWT token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token_here"
  }
}
```

### 2. Project Brief Endpoints

#### POST /briefs/upload
Upload and parse project brief file or text.

**Request Body:**
```json
{
  "type": "file", // or "text"
  "file": "base64_encoded_file_content", // if type is "file"
  "text": "Project brief text content", // if type is "text"
  "fileName": "brief.pdf", // optional, for file uploads
  "fileType": "application/pdf" // optional, for file uploads
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "briefId": "brief_123",
    "parsedData": {
      "title": "E-commerce Platform Development",
      "industry": "Technology",
      "budget": "$50,000 - $100,000",
      "timeline": "3-6 months",
      "objectives": [
        "Build scalable e-commerce platform",
        "Integrate payment processing",
        "Implement inventory management"
      ],
      "clientDetails": {
        "company": "TechCorp Inc",
        "contact": "john@techcorp.com",
        "phone": "+1-555-0123"
      },
      "requirements": [
        "React frontend",
        "Node.js backend",
        "PostgreSQL database"
      ]
    },
    "confidence": 0.85,
    "processingTime": "2.3s"
  }
}
```

#### GET /briefs
Get all project briefs (filtered by user role).

**Query Parameters:**
- `status`: Filter by status (pending, in_progress, completed)
- `industry`: Filter by industry
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "briefs": [
      {
        "id": "brief_123",
        "title": "E-commerce Platform Development",
        "status": "in_progress",
        "industry": "Technology",
        "budget": "$50,000 - $100,000",
        "timeline": "3-6 months",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T12:00:00.000Z",
        "assignedTo": "member@example.com",
        "progress": 75
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

#### GET /briefs/:id
Get specific project brief details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "brief_123",
    "title": "E-commerce Platform Development",
    "status": "in_progress",
    "industry": "Technology",
    "budget": "$50,000 - $100,000",
    "timeline": "3-6 months",
    "objectives": [
      "Build scalable e-commerce platform",
      "Integrate payment processing"
    ],
    "clientDetails": {
      "company": "TechCorp Inc",
      "contact": "john@techcorp.com"
    },
    "requirements": [
      "React frontend",
      "Node.js backend"
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z",
    "assignedTo": "member@example.com",
    "progress": 75
  }
}
```

#### PUT /briefs/:id
Update project brief.

**Request Body:**
```json
{
  "title": "Updated E-commerce Platform",
  "status": "completed",
  "budget": "$75,000 - $125,000",
  "objectives": [
    "Build scalable e-commerce platform",
    "Integrate payment processing",
    "Add mobile app"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "brief_123",
    "title": "Updated E-commerce Platform",
    "status": "completed",
    "updatedAt": "2024-01-01T15:00:00.000Z"
  }
}
```

### 3. Case Study Endpoints

#### GET /case-studies
Get all case studies.

**Query Parameters:**
- `industry`: Filter by industry
- `tags`: Filter by tags (comma-separated)
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "caseStudies": [
      {
        "id": "case_123",
        "title": "E-commerce Platform for RetailCorp",
        "industry": "Technology",
        "description": "Built scalable e-commerce platform with payment integration",
        "tags": ["e-commerce", "payment", "scalable"],
        "budget": "$80,000",
        "timeline": "4 months",
        "outcomes": [
          "40% increase in sales",
          "Improved user experience"
        ],
        "similarityScore": 0.92,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

#### GET /case-studies/recommendations/:briefId
Get case study recommendations for a specific brief.

**Response:**
```json
{
  "success": true,
  "data": {
    "briefId": "brief_123",
    "recommendations": [
      {
        "id": "case_123",
        "title": "E-commerce Platform for RetailCorp",
        "industry": "Technology",
        "similarityScore": 0.92,
        "relevanceFactors": {
          "industryMatch": 1.0,
          "budgetCompatibility": 0.85,
          "timelineCompatibility": 0.90,
          "contentSimilarity": 0.88
        },
        "description": "Built scalable e-commerce platform with payment integration",
        "tags": ["e-commerce", "payment", "scalable"],
        "budget": "$80,000",
        "timeline": "4 months"
      }
    ],
    "totalRecommendations": 5,
    "processingTime": "1.2s"
  }
}
```

#### POST /case-studies
Create new case study.

**Request Body:**
```json
{
  "title": "Healthcare Management System",
  "industry": "Healthcare",
  "description": "Built HIPAA-compliant healthcare management system",
  "tags": ["healthcare", "HIPAA", "management"],
  "budget": "$120,000",
  "timeline": "6 months",
  "outcomes": [
    "Improved patient care",
    "Reduced administrative overhead"
  ],
  "content": "Detailed case study content..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "case_456",
    "title": "Healthcare Management System",
    "industry": "Healthcare",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Solution Pitch Endpoints

#### POST /pitches/generate/:briefId
Generate solution pitch for a brief.

**Request Body:**
```json
{
  "templateId": "template_123", // optional
  "caseStudyIds": ["case_123", "case_456"], // optional
  "customizations": {
    "tone": "professional",
    "length": "detailed",
    "focus": "technical"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pitchId": "pitch_123",
    "title": "E-commerce Platform Solution",
    "content": {
      "executiveSummary": "Comprehensive e-commerce solution...",
      "problemStatement": "Your organization requires...",
      "solutionApproach": "Our solution leverages...",
      "technicalImplementation": "We will implement...",
      "timelineAndBudget": "Project timeline: 4-6 months...",
      "expectedOutcomes": "Expected results include...",
      "caseStudyIntegration": "Based on similar projects...",
      "callToAction": "We look forward to..."
    },
    "status": "draft",
    "version": 1,
    "generatedAt": "2024-01-01T12:00:00.000Z",
    "processingTime": "3.5s",
    "confidence": 0.88
  }
}
```

#### GET /pitches
Get all solution pitches.

**Query Parameters:**
- `status`: Filter by status (draft, review, approved, rejected)
- `briefId`: Filter by brief ID
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "pitches": [
      {
        "id": "pitch_123",
        "title": "E-commerce Platform Solution",
        "briefId": "brief_123",
        "status": "review",
        "version": 1,
        "createdAt": "2024-01-01T12:00:00.000Z",
        "updatedAt": "2024-01-01T15:00:00.000Z",
        "assignedTo": "member@example.com"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "pages": 2
    }
  }
}
```

#### GET /pitches/:id
Get specific pitch details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "pitch_123",
    "title": "E-commerce Platform Solution",
    "briefId": "brief_123",
    "status": "review",
    "version": 1,
    "content": {
      "executiveSummary": "Comprehensive e-commerce solution...",
      "problemStatement": "Your organization requires...",
      "solutionApproach": "Our solution leverages...",
      "technicalImplementation": "We will implement...",
      "timelineAndBudget": "Project timeline: 4-6 months...",
      "expectedOutcomes": "Expected results include...",
      "caseStudyIntegration": "Based on similar projects...",
      "callToAction": "We look forward to..."
    },
    "caseStudyIds": ["case_123", "case_456"],
    "templateId": "template_123",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T15:00:00.000Z",
    "assignedTo": "member@example.com"
  }
}
```

#### PUT /pitches/:id
Update pitch content or status.

**Request Body:**
```json
{
  "content": {
    "executiveSummary": "Updated executive summary...",
    "problemStatement": "Updated problem statement..."
  },
  "status": "approved"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "pitch_123",
    "status": "approved",
    "version": 2,
    "updatedAt": "2024-01-01T16:00:00.000Z"
  }
}
```

### 5. User Management Endpoints

#### GET /users
Get all users (admin only).

**Query Parameters:**
- `role`: Filter by role
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "1",
        "email": "user@example.com",
        "name": "John Doe",
        "role": "customer",
        "status": "active",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "lastLogin": "2024-01-01T12:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

#### GET /users/:id
Get specific user details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer",
    "status": "active",
    "permissions": ["read:briefs", "write:briefs"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastLogin": "2024-01-01T12:00:00.000Z"
  }
}
```

#### PUT /users/:id
Update user details.

**Request Body:**
```json
{
  "name": "John Smith",
  "role": "team_member",
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "John Smith",
    "role": "team_member",
    "updatedAt": "2024-01-01T16:00:00.000Z"
  }
}
```

### 6. Template Management Endpoints

#### GET /templates
Get all pitch templates.

**Query Parameters:**
- `industry`: Filter by industry
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "template_123",
        "name": "Technology Solution Template",
        "description": "Comprehensive template for technology projects",
        "industry": "Technology",
        "sections": ["Executive Summary", "Problem Statement", "Technical Approach"],
        "isDefault": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "pages": 2
    }
  }
}
```

#### POST /templates
Create new template.

**Request Body:**
```json
{
  "name": "Custom Template",
  "description": "Custom template for specific needs",
  "industry": "Technology",
  "sections": ["Executive Summary", "Problem Statement", "Solution Approach"],
  "content": "Template content with placeholders..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "template_456",
    "name": "Custom Template",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

### Common Error Codes
- `AUTHENTICATION_ERROR`: Invalid or missing authentication
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `VALIDATION_ERROR`: Invalid input data
- `NOT_FOUND`: Resource not found
- `INTERNAL_ERROR`: Server error
- `RATE_LIMIT_EXCEEDED`: Too many requests

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **Brief upload**: 10 requests per hour
- **Pitch generation**: 20 requests per hour
- **Other endpoints**: 100 requests per minute

## Pagination

All list endpoints support pagination with the following response format:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## WebSocket Events (Real-time Updates)

### Connection
```javascript
const socket = io('http://localhost:3001');
```

### Events
- `brief:updated`: Brief status or content updated
- `pitch:generated`: New pitch generated
- `case_study:added`: New case study added
- `user:notification`: New notification for user

### Example Event Data
```json
{
  "type": "brief:updated",
  "data": {
    "briefId": "brief_123",
    "status": "completed",
    "progress": 100,
    "updatedAt": "2024-01-01T16:00:00.000Z"
  }
}
```

## SDK Examples

### JavaScript/TypeScript
```javascript
import { PitchForgeAPI } from '@pitchforge/sdk';

const api = new PitchForgeAPI({
  baseURL: 'http://localhost:3001/api/v1',
  token: 'your_jwt_token'
});

// Upload brief
const brief = await api.briefs.upload({
  type: 'text',
  text: 'Project brief content...'
});

// Generate pitch
const pitch = await api.pitches.generate(brief.id, {
  templateId: 'template_123'
});
```

### Python
```python
import requests

class PitchForgeAPI:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {'Authorization': f'Bearer {token}'}
    
    def upload_brief(self, text):
        response = requests.post(
            f'{self.base_url}/briefs/upload',
            json={'type': 'text', 'text': text},
            headers=self.headers
        )
        return response.json()

# Usage
api = PitchForgeAPI('http://localhost:3001/api/v1', 'your_token')
brief = api.upload_brief('Project brief content...')
```

## Testing

### Health Check
```bash
curl http://localhost:3001/api/v1/health
```

### Authentication Test
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### Brief Upload Test
```bash
curl -X POST http://localhost:3001/api/v1/briefs/upload \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json" \
  -d '{"type": "text", "text": "Test project brief"}'
```

## Versioning

API versioning is handled through URL path:
- Current version: `/api/v1/`
- Future versions: `/api/v2/`, `/api/v3/`, etc.

## Deprecation Policy

- Endpoints will be deprecated with 6 months notice
- Deprecated endpoints will return a warning header
- New versions will maintain backward compatibility where possible

## Support

For API support and questions:
- Email: api-support@pitchforge.com
- Documentation: https://docs.pitchforge.com/api
- GitHub Issues: https://github.com/pitchforge/api/issues 