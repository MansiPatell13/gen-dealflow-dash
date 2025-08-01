# PitchForge - Project Overview

## Technology Stack

| Category | Tool / Library | Version |
|----------|----------------|---------|
| **Frontend Framework** | React + TypeScript | 18.3.1 |
| **Build Tool** | Vite | 5.4.1 |
| **Styling** | Tailwind CSS | 3.4.11 |
| **UI Components** | Shadcn/UI (Radix UI) | Latest |
| **State Management** | React Query (TanStack Query) | 5.56.2 |
| **Routing** | React Router DOM | 6.26.2 |
| **Form Handling** | React Hook Form + Zod | 7.53.0 + 3.23.8 |
| **Theme Management** | next-themes | 0.3.0 |
| **Hosting** | Netlify | Configured |
| **Version Control** | Git + GitHub | - |

## Project Architecture

### Frontend Structure
```
src/
├── components/
│   ├── analytics/          # Analytics dashboard components
│   ├── assignment/         # Assignment management
│   ├── auth/              # Authentication components
│   ├── case-studies/      # Case study management
│   ├── customer/          # Customer-specific components
│   ├── dashboard/         # Role-based dashboards
│   ├── feedback/          # Feedback system
│   ├── layout/            # Header, navigation
│   ├── meeting/           # Meeting management
│   ├── notifications/     # Notification system
│   ├── pitch/             # Pitch generation
│   ├── proposals/         # Proposal management
│   ├── solution-pitch/    # Solution pitch components
│   ├── team-member/       # Team member components
│   ├── ui/                # Reusable UI components
│   └── workflow/          # Workflow management
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and services
├── pages/                 # Main page components
└── assets/                # Static assets
```

### Backend Structure (Node.js + Express)
```
backend/
├── src/
│   ├── controllers/       # Route controllers
│   ├── models/            # Data models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   └── server.js          # Main server file
├── package.json           # Backend dependencies
└── env.example            # Environment variables
```

## Modules Implemented

### Core Functionality

| Module Name | Description | Status |
|-------------|-------------|--------|
| **User Authentication** | JWT-based auth with role management | ✅ Implemented |
| **Role-Based Dashboards** | Customer, Team Manager, Team Member views | ✅ Implemented |
| **Project Brief Management** | Upload, parse, and manage project requirements | ✅ Implemented |
| **Case Study Recommendations** | AI-powered similarity scoring and recommendations | ✅ Implemented |
| **Solution Pitch Generation** | Automated proposal generation with case study integration | ✅ Implemented |
| **Profile Management** | User profiles with statistics and activity tracking | ✅ Implemented |
| **Settings System** | Account, notifications, appearance, privacy, security | ✅ Implemented |
| **Theme System** | Light/Dark mode with persistent preferences | ✅ Implemented |
| **Notification System** | Real-time notifications for different user roles | ✅ Implemented |

### User Roles & Permissions

#### Customer
- Submit project briefs with detailed requirements
- Track proposal status and progress
- Review and approve finalized proposals
- View project history and outcomes
- Access personalized dashboard

#### Team Manager
- Overview dashboard with project analytics
- Assign projects to team members
- Review and approve solution pitches
- Manage case studies and reference materials
- Monitor team performance and project metrics

#### Team Member
- View assigned projects and tasks
- Create solution pitches based on project briefs
- Access relevant case studies and reference materials
- Submit work for review and approval
- Track personal performance metrics

## API Endpoints (Backend - Implemented)

| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/api/auth/login` | POST | User authentication | ✅ Implemented |
| `/api/auth/register` | POST | User registration | ✅ Implemented |
| `/api/auth/logout` | POST | User logout | ✅ Implemented |
| `/api/project-briefs` | GET/POST | Project brief management | ✅ Implemented |
| `/api/case-studies` | GET/POST | Case study management | ✅ Implemented |
| `/api/solution-pitches` | GET/POST | Solution pitch management | ✅ Implemented |
| `/api/users` | GET/PUT | User management | ✅ Implemented |
| `/api/analytics` | GET | Analytics and statistics | ✅ Implemented |

## Authentication System

### Current Implementation
- **JWT-based authentication** with secure token handling
- **Role-based access control** (customer, team_manager, team_member)
- **Secure middleware** protecting all endpoints
- **Session management** with configurable timeouts
- **Password security** with bcryptjs hashing

### Security Features
- CORS configuration for cross-origin requests
- Rate limiting to prevent abuse
- Input validation with express-validator
- Helmet.js for security headers
- Environment variable management

## Deployment Configuration

### Netlify Deployment (Frontend)
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18
- **Environment Variables**: Configured for VITE_* variables
- **SPA Routing**: Configured with redirects
- **Security Headers**: Implemented
- **Caching**: Optimized for static assets

### Configuration Files
- `netlify.toml` - Netlify build and deployment settings
- `public/_redirects` - SPA routing configuration
- `public/_headers` - Security and caching headers
- `vite.config.ts` - Production build optimization

## Setup & Installation Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/pitchforge.git

# Navigate to project directory
cd pitchforge

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment variables
cp env.example .env

# Edit .env with your configuration
# Start development server
npm run dev
```

### Environment Variables
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Database Configuration (for future implementation)
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=pitchforge
# DB_USER=postgres
# DB_PASSWORD=password
```

## Current Status

### ✅ Implemented Features
- Complete frontend UI with role-based dashboards
- Backend API with authentication and authorization
- Project brief management system
- Case study recommendation engine
- Solution pitch generation
- User role management
- Profile and settings management
- Theme system (light/dark mode)
- Notification system
- Comprehensive error handling
- Netlify deployment configuration

### 🚧 In Progress
- File upload functionality for project briefs
- Enhanced similarity scoring algorithm
- Real-time notifications
- Advanced analytics dashboard

### 📋 Planned Enhancements
- **Database Integration**: PostgreSQL/MongoDB for persistent data
- **File Storage**: Cloud storage for document uploads
- **Email Notifications**: Automated email system
- **Advanced AI Features**: OpenAI integration for pitch generation
- **Mobile App**: React Native mobile application
- **Real-time Collaboration**: WebSocket integration
- **Advanced Analytics**: Business intelligence dashboard
- **API Documentation**: Swagger/OpenAPI documentation
- **Testing Suite**: Unit and integration tests
- **CI/CD Pipeline**: Automated testing and deployment

## Performance Optimizations

### Frontend
- **Code Splitting**: Vendor and UI libraries separated
- **Lazy Loading**: Components loaded on demand
- **Caching**: Static assets cached with long expiration
- **Bundle Optimization**: Tree shaking and minification
- **Image Optimization**: Compressed and optimized images

### Backend
- **Rate Limiting**: Prevents API abuse
- **Caching**: Response caching for frequently accessed data
- **Compression**: Gzip compression for responses
- **Security**: Comprehensive security headers

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions or support, please open an issue in the repository or contact the development team.

---

**PitchForge** - Streamlining proposal generation and management for modern businesses. 