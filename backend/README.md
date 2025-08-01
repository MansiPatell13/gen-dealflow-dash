# PitchForge Backend API

A comprehensive RESTful API for the PitchForge proposal automation platform.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Project Brief Management**: CRUD operations for project briefs with role-based filtering
- **Case Study Management**: Case study CRUD with similarity scoring and recommendations
- **Solution Pitch Generation**: AI-powered pitch generation with case study integration
- **User Management**: Role-based user management and permissions
- **Statistics & Analytics**: Comprehensive reporting and analytics endpoints

## Tech Stack

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **Authentication**: JWT with bcryptjs
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting
- **Documentation**: JSDoc (planned)

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

### Project Briefs
- `GET /api/project-briefs` - Get all briefs (filtered by role)
- `GET /api/project-briefs/:id` - Get single brief
- `POST /api/project-briefs` - Create new brief
- `PUT /api/project-briefs/:id` - Update brief
- `DELETE /api/project-briefs/:id` - Delete brief
- `GET /api/project-briefs/stats/overview` - Get brief statistics

### Case Studies
- `GET /api/case-studies` - Get all case studies
- `GET /api/case-studies/:id` - Get single case study
- `GET /api/case-studies/recommendations/:briefId` - Get recommendations for brief
- `POST /api/case-studies` - Create case study (team managers only)
- `PUT /api/case-studies/:id` - Update case study (team managers only)
- `DELETE /api/case-studies/:id` - Delete case study (team managers only)
- `GET /api/case-studies/stats/overview` - Get case study statistics

### Solution Pitches
- `GET /api/solution-pitches` - Get all pitches (filtered by role)
- `GET /api/solution-pitches/:id` - Get single pitch
- `POST /api/solution-pitches/generate/:briefId` - Generate pitch from brief
- `POST /api/solution-pitches` - Create new pitch
- `PUT /api/solution-pitches/:id` - Update pitch
- `DELETE /api/solution-pitches/:id` - Delete pitch
- `GET /api/solution-pitches/stats/overview` - Get pitch statistics

### Users
- `GET /api/users` - Get all users (team managers only)
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/permissions` - Get user permissions
- `GET /api/users/stats/overview` - Get user statistics
- `GET /api/users/team/members` - Get team members

## User Roles & Permissions

### Customer
- Create and manage own project briefs
- View own solution pitches
- Update own profile

### Team Member
- View assigned project briefs
- Create and edit solution pitches
- Access case studies
- View own profile

### Team Manager
- View all project briefs and pitches
- Assign briefs to team members
- Approve/reject solution pitches
- Manage case studies
- View analytics and statistics
- Manage team members

## Data Models

### User
```javascript
{
  id: string,
  name: string,
  email: string,
  role: 'customer' | 'team_manager' | 'team_member',
  createdAt: Date,
  updatedAt: Date
}
```

### Project Brief
```javascript
{
  id: string,
  title: string,
  industry: string,
  budget: string,
  objectives: string,
  timeline: string,
  clientDetails: string,
  status: 'submitted' | 'in_progress' | 'completed' | 'approved' | 'rejected',
  submittedBy: string,
  assignedTo?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Case Study
```javascript
{
  id: string,
  title: string,
  industry: string,
  description: string,
  relevanceScore: number,
  tags: string[],
  outcome: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Solution Pitch
```javascript
{
  id: string,
  briefId: string,
  title: string,
  content: string,
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'finalized',
  createdBy: string,
  clientEmail: string,
  caseStudyIds: string[],
  feedback?: string,
  version: number,
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

All API endpoints return consistent error responses:

```javascript
{
  "error": "Error message",
  "details": [] // Validation errors if applicable
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Granular permissions per user role
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Protection**: Cross-origin resource sharing protection
- **Helmet Security**: Security headers middleware

## Development

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Environment Variables
See `env.example` for all available environment variables.

## Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Configure proper JWT secret
3. Set up database connection (future)
4. Configure CORS origins
5. Set up proper logging

### Docker (Future)
```bash
docker build -t pitchforge-backend .
docker run -p 5000:5000 pitchforge-backend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details 