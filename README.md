# PitchForge - Proposal Automation Platform

A comprehensive web application for automating business proposal generation and management, built with React frontend and Node.js backend.

## Deployed Site
https://pitchforge.netlify.app/

## 🚀 Overview

PitchForge is a modern SaaS platform designed to streamline the proposal generation process for businesses. It provides role-based dashboards, automated case study recommendations, and intelligent pitch generation to help teams create compelling proposals faster and more effectively.

## 🎯 Problem Statement & Solution

### The Challenge
Traditional proposal generation is:
- **Time-consuming**: Manual research and writing takes weeks
- **Inconsistent**: Quality varies based on individual expertise
- **Repetitive**: Teams recreate similar content repeatedly
- **Error-prone**: Manual processes lead to missed opportunities

### Our Solution
PitchForge addresses these challenges through:
- **Automated Workflows**: Streamlined proposal generation process
- **AI-Powered Recommendations**: Smart case study matching
- **Role-Based Collaboration**: Clear responsibilities and workflows
- **Template System**: Consistent, high-quality outputs
- **Analytics & Insights**: Performance tracking and optimization

## 🏗️ Architecture & Design Approach

### Design Philosophy
Our approach follows these core principles:

1. **User-Centric Design**: Every feature is designed around user workflows
2. **Scalable Architecture**: Modular components for easy maintenance
3. **Performance First**: Optimized for speed and responsiveness
4. **Accessibility**: WCAG compliant design patterns
5. **Mobile-First**: Responsive design for all devices

### Technical Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   External      │
│   (React/TS)    │◄──►│   (Node.js)     │◄──►│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Components │    │   Authentication│    │   AI Services   │
│   State Mgmt    │    │   Business Logic│    │   File Storage  │
│   Routing       │    │   Data Models   │    │   Analytics     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎨 Design Thought Process

### Initial Design Prompts & Brainstorming

When designing PitchForge, I used these key prompts to guide the design process:

#### 1. User Experience Design
```
"Design a proposal automation platform that feels intuitive for three distinct user types:
- Customers who need proposals quickly
- Team Managers who oversee the process
- Team Members who create the content

Focus on reducing cognitive load and creating clear workflows."
```

#### 2. Visual Design System
```
"Create a modern, professional design system that:
- Builds trust and credibility
- Supports both light and dark themes
- Scales across different screen sizes
- Maintains consistency across all components"
```

#### 3. Information Architecture
```
"Organize the application so that:
- Users can find what they need in 3 clicks or less
- Related information is grouped logically
- Navigation feels natural and predictable
- The interface adapts to user roles and permissions"
```

### Design Decisions & Rationale

#### 1. **Role-Based Dashboards**
**Decision**: Separate dashboards for each user role
**Rationale**: 
- Reduces cognitive load by showing only relevant information
- Improves user efficiency and satisfaction
- Enables role-specific features and workflows

#### 2. **Card-Based Layout**
**Decision**: Use card components for content organization
**Rationale**:
- Provides clear visual hierarchy
- Easy to scan and understand
- Flexible for different content types
- Consistent with modern web design patterns

#### 3. **Dark/Light Theme Support**
**Decision**: Implement theme switching with persistence
**Rationale**:
- Improves accessibility and user preference
- Reduces eye strain in different lighting conditions
- Modern expectation for professional applications

#### 4. **Progressive Disclosure**
**Decision**: Show essential information first, details on demand
**Rationale**:
- Prevents overwhelming users with too much information
- Allows for exploration and discovery
- Maintains clean, uncluttered interfaces

## 🛠️ Technology Stack

### Frontend Technologies

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | React + TypeScript | 18.3.1 | Core application framework |
| **Build Tool** | Vite | 5.4.1 | Fast development and building |
| **Styling** | Tailwind CSS | 3.4.11 | Utility-first CSS framework |
| **UI Components** | Shadcn/UI + Radix UI | Latest | Accessible component library |
| **State Management** | React Query (TanStack) | 5.56.2 | Server state management |
| **Routing** | React Router DOM | 6.26.2 | Client-side routing |
| **Forms** | React Hook Form + Zod | 7.53.0 + 3.23.8 | Form handling and validation |
| **Theming** | next-themes | 0.3.0 | Theme management |
| **Charts** | Recharts | 2.12.7 | Data visualization |
| **Icons** | Lucide React | 0.462.0 | Consistent iconography |

### Backend Technologies

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Runtime** | Node.js | 18+ | JavaScript runtime |
| **Framework** | Express.js | Latest | Web application framework |
| **Authentication** | JWT + bcryptjs | Latest | Secure authentication |
| **Validation** | Express-validator | Latest | Input validation |
| **Security** | Helmet + CORS | Latest | Security middleware |
| **Rate Limiting** | Express-rate-limit | Latest | API protection |

### Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting and quality |
| **TypeScript** | Type safety and developer experience |
| **Prettier** | Code formatting |
| **Git** | Version control |
| **Netlify** | Frontend hosting and deployment |

## 📁 Project Structure

```
pitchforge/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Base UI components (shadcn/ui)
│   │   ├── layout/          # Layout components (Header, Navigation)
│   │   ├── dashboard/       # Role-based dashboard components
│   │   ├── auth/            # Authentication components
│   │   ├── case-studies/    # Case study management
│   │   ├── pitch/           # Pitch generation components
│   │   ├── proposals/       # Proposal management
│   │   ├── analytics/       # Analytics and reporting
│   │   ├── notifications/   # Notification system
│   │   └── workflow/        # Workflow management
│   ├── pages/               # Main page components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and services
│   ├── assets/              # Static assets
│   └── styles/              # Global styles
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # Data models
│   │   ├── middleware/      # Express middleware
│   │   └── utils/           # Utility functions
│   └── package.json
├── public/                  # Public assets
├── docs/                    # Documentation
└── deployment/              # Deployment configurations
```

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher (or **yarn** 1.22.0 or higher)
- **Git** for version control

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pitchforge.git
   cd pitchforge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```


3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎯 Key Features

### Role-Based Access Control
- **Customer Dashboard**: Submit briefs, track progress, review proposals
- **Team Manager Dashboard**: Oversee projects, assign tasks, monitor performance
- **Team Member Dashboard**: Create pitches, access resources, submit work

### Intelligent Proposal Generation
- **Case Study Matching**: AI-powered similarity scoring
- **Template System**: Consistent, professional proposals
- **Collaboration Tools**: Team review and approval workflows

### Analytics & Insights
- **Performance Tracking**: Success rates and metrics
- **Project Analytics**: Timeline and budget tracking
- **Team Analytics**: Productivity and quality metrics

### User Experience
- **Responsive Design**: Works on all devices
- **Dark/Light Themes**: User preference support
- **Real-time Updates**: Live notifications and status changes
- **Accessibility**: WCAG compliant design

## 🔧 Development Workflow

### Code Organization
- **Feature-based structure**: Components organized by feature
- **Shared components**: Reusable UI components in `/components/ui`
- **Custom hooks**: Business logic in `/hooks`
- **Type safety**: Full TypeScript implementation

### Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode

# Deployment
npm run deploy:netlify   # Deploy to Netlify
```

### Code Quality Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Consistent code formatting
- **Component Testing**: Unit tests for critical components

## 🚀 Deployment

### Netlify Deployment

This project is pre-configured for Netlify deployment:

1. **Connect to Git**: Link your GitHub repository to Netlify
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18
3. **Environment Variables**: Add any `VITE_*` variables
4. **Deploy**: Netlify will automatically build and deploy

### Configuration Files
- `netlify.toml`: Build and deployment settings
- `public/_redirects`: SPA routing configuration
- `public/_headers`: Security and caching headers

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow our coding standards
4. **Test your changes**: Ensure all tests pass
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**: Provide clear description of changes

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure accessibility compliance

## 📊 Performance Optimizations

### Frontend Optimizations
- **Code Splitting**: Vendor and feature-based chunks
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Compressed and optimized assets
- **Caching**: Static assets cached with long expiration
- **Bundle Analysis**: Regular bundle size monitoring

### Backend Optimizations
- **Rate Limiting**: API abuse prevention
- **Caching**: Response caching for frequently accessed data
- **Compression**: Gzip compression for responses
- **Security**: Comprehensive security headers

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Granular permission system
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Cross-origin request security
- **Rate Limiting**: API abuse prevention
- **Security Headers**: Helmet.js security middleware

## 📈 Future Roadmap

### Phase 1: Core Features ✅
- [x] User authentication and authorization
- [x] Role-based dashboards
- [x] Basic proposal generation
- [x] Case study management

### Phase 2: Advanced Features 🚧
- [ ] AI-powered pitch generation
- [ ] Real-time collaboration
- [ ] Advanced analytics
- [ ] Mobile application

### Phase 3: Enterprise Features 📋
- [ ] Multi-tenant architecture
- [ ] Advanced integrations
- [ ] White-label solutions
- [ ] API marketplace

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md)
- [API Documentation](./backend/README.md)
- [Component Library](./docs/components.md)
- [Architecture Guide](./docs/architecture.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check our [docs](./docs/) directory
- **Issues**: Report bugs via [GitHub Issues](https://github.com/yourusername/pitchforge/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/yourusername/pitchforge/discussions)
- **Email**: support@pitchforge.com

---

**PitchForge** - Streamlining proposal generation and management for modern businesses.

