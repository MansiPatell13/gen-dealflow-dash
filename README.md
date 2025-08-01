# PitchForge - Proposal Automation Platform

A comprehensive web application for automating business proposal generation and management, built with React frontend and Node.js backend.

## Project Structure

```
gen-dealflow-dash/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and services
│   │   └── assets/          # Static assets
│   ├── public/              # Public assets
│   └── package.json         # Frontend dependencies
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   └── package.json         # Backend dependencies
└── README.md                # This file
```

## Features

### Core Functionality
- **Project Brief Management**: Upload, parse, and manage project requirements
- **Case Study Recommendations**: AI-powered similarity scoring and recommendations
- **Solution Pitch Generation**: Automated proposal generation with case study integration
- **Role-based Access Control**: Customer, Team Manager, and Team Member roles
- **Workflow Management**: Complete proposal lifecycle management

### User Roles

#### Customer
- Submit project briefs with detailed requirements
- Track proposal status and progress
- Review and approve finalized proposals
- View project history and outcomes

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

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom design system

### Backend
- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **Authentication**: JWT with bcryptjs
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting
- **Documentation**: Comprehensive API documentation

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend will be available at `http://localhost:5173`

### Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your configuration
npm run dev
```

## Deployment

### Netlify Deployment (Frontend)

This project is configured for easy deployment to Netlify. See the [Deployment Guide](DEPLOYMENT.md) for detailed instructions.

**Quick Deployment Steps:**
1. Push your code to a Git repository
2. Connect your repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy!

**Pre-configured for:**
- ✅ SPA routing with React Router
- ✅ Security headers and caching
- ✅ Code splitting and optimization
- ✅ Environment variable support

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md) and [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md).
Backend API will be available at `http://localhost:5000`

## Development

### Frontend Development
- Modern React with TypeScript
- Component-based architecture
- Responsive design with mobile-first approach
- Comprehensive UI component library

### Backend Development
- RESTful API design
- Role-based authentication and authorization
- Comprehensive input validation
- Error handling and logging
- Security best practices

## API Documentation

See [Backend README](./backend/README.md) for complete API documentation including:
- Authentication endpoints
- Project brief management
- Case study recommendations
- Solution pitch generation
- User management
- Statistics and analytics

## Current Status

### ✅ Implemented
- Complete frontend UI with role-based dashboards
- Backend API with authentication and authorization
- Project brief management system
- Case study recommendation engine
- Solution pitch generation
- User role management
- Comprehensive error handling

### 🚧 In Progress
- File upload functionality for project briefs
- Enhanced similarity scoring algorithm
- Real-time notifications
- Advanced analytics dashboard

### 📋 Planned
- Database integration (PostgreSQL/MongoDB)
- File storage system
- Email notifications
- Advanced AI features
- Mobile app development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or support, please open an issue in the repository.
