# Backend Documentation

## Overview

This directory contains comprehensive documentation for the PitchForge backend API, including API endpoints, authentication, database schema, and development guidelines.

## Documentation Index

### 📚 Core Documentation

#### [API Documentation](./API_DOCUMENTATION.md)
Complete API reference with all endpoints, request/response schemas, error handling, and examples.

**Key Sections:**
- Authentication endpoints
- Project brief management
- Case study recommendations
- Solution pitch generation
- User management
- Template management
- Error responses and rate limiting
- WebSocket events for real-time updates
- SDK examples (JavaScript/TypeScript, Python)

#### [Authentication & User Management Plan](./AUTHENTICATION_PLAN.md)
Comprehensive authentication system design with role-based access control.

**Key Sections:**
- User registration flow
- Role-based access control (RBAC)
- Session management with JWT tokens
- Security protocols and password policies
- Multi-factor authentication (MFA)
- Rate limiting and account lockout
- Audit logging and monitoring
- Implementation checklist

#### [Database Schema Design](./DATABASE_SCHEMA.md)
Complete database schema with tables, relationships, indexes, and performance optimizations.

**Key Sections:**
- User management tables
- Project briefs tables
- Case studies tables with similarity scoring
- Solution pitches tables
- Analytics and reporting tables
- Notifications system
- Database functions and triggers
- Performance optimization strategies
- Backup and recovery procedures

### 🚀 Quick Start Guide

#### Backend Setup
```bash
# Clone the repository
git clone https://github.com/pitchforge/backend.git
cd backend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your configuration

# Start the development server
npm run dev
```

#### Database Setup
```bash
# Create database
createdb pitchforge

# Run migrations
npm run migrate

# Seed with sample data
npm run seed
```

#### API Testing
```bash
# Health check
curl http://localhost:3001/api/v1/health

# Authentication test
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### 🔧 Development Guidelines

#### Code Structure
```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── config/          # Configuration
├── docs/                # Documentation
├── tests/               # Test files
└── scripts/             # Build/deployment scripts
```

#### Environment Variables
```bash
# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pitchforge

# Authentication
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
BCRYPT_ROUNDS=12

# Security
SESSION_SECRET=your_session_secret_here
COOKIE_SECRET=your_cookie_secret_here

# Email (for notifications)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### API Response Format
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

#### Error Response Format
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

### 🔐 Security Features

#### Authentication
- JWT-based authentication
- Refresh token rotation
- Password hashing with bcrypt
- Multi-factor authentication (TOTP)
- Session management with concurrent limits

#### Authorization
- Role-based access control (RBAC)
- Permission-based authorization
- Resource-level permissions
- Dynamic permission checking

#### Security Headers
- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation and sanitization
- SQL injection prevention
- XSS protection

### 📊 Database Features

#### Core Tables
- **Users**: User accounts and profiles
- **Project Briefs**: Client project requirements
- **Case Studies**: Reference projects with similarity scoring
- **Solution Pitches**: Generated proposals
- **Pitch Templates**: Reusable templates
- **Audit Logs**: Security and activity tracking

#### Advanced Features
- Full-text search with PostgreSQL
- JSONB for flexible data storage
- UUID primary keys for security
- Comprehensive indexing strategy
- Database functions for business logic
- Automated maintenance procedures

#### Performance Optimizations
- Connection pooling with pgBouncer
- Query optimization with covering indexes
- Partitioning for large datasets
- Regular VACUUM and ANALYZE
- Backup and recovery procedures

### 🔄 API Workflows

#### Brief Upload & Processing
1. **Upload**: Client uploads brief file or text
2. **Parsing**: AI extracts structured data
3. **Validation**: System validates parsed data
4. **Storage**: Brief stored with metadata
5. **Assignment**: Team manager assigns to team member

#### Case Study Recommendations
1. **Analysis**: System analyzes brief content
2. **Scoring**: Calculates similarity scores
3. **Ranking**: Ranks case studies by relevance
4. **Filtering**: Applies business rules
5. **Delivery**: Returns top recommendations

#### Pitch Generation
1. **Input**: Brief and case studies selected
2. **Template**: Applies appropriate template
3. **Generation**: AI generates pitch content
4. **Integration**: Incorporates case studies
5. **Review**: Team member reviews and edits
6. **Approval**: Manager approves final pitch

### 🧪 Testing Strategy

#### Unit Tests
```bash
# Run unit tests
npm run test:unit

# Run with coverage
npm run test:coverage
```

#### Integration Tests
```bash
# Run integration tests
npm run test:integration

# Run API tests
npm run test:api
```

#### Load Tests
```bash
# Run load tests
npm run test:load

# Performance benchmarks
npm run test:benchmark
```

### 📈 Monitoring & Analytics

#### Application Metrics
- Request/response times
- Error rates and types
- User activity patterns
- API usage statistics
- Database performance metrics

#### Security Monitoring
- Failed authentication attempts
- Suspicious activity detection
- Rate limit violations
- Permission denied events
- Audit log analysis

#### Business Metrics
- Brief processing success rates
- Case study recommendation accuracy
- Pitch generation quality scores
- User engagement metrics
- Team productivity analytics

### 🚀 Deployment

#### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates installed
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Monitoring setup
- [ ] Backup procedures tested
- [ ] Load testing completed

#### Docker Deployment
```bash
# Build image
docker build -t pitchforge-backend .

# Run container
docker run -p 3001:3001 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e JWT_SECRET=your_secret \
  pitchforge-backend
```

#### Environment-Specific Configs
```bash
# Development
NODE_ENV=development
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000

# Production
NODE_ENV=production
LOG_LEVEL=warn
CORS_ORIGIN=https://app.pitchforge.com
```

### 📞 Support & Maintenance

#### Troubleshooting
- Check application logs
- Verify database connectivity
- Test API endpoints
- Review error responses
- Monitor system resources

#### Common Issues
- **Authentication failures**: Check JWT configuration
- **Database errors**: Verify connection and permissions
- **Rate limiting**: Adjust limits for your use case
- **Performance issues**: Review query optimization
- **Security alerts**: Review audit logs

#### Maintenance Tasks
- Regular database backups
- Log rotation and cleanup
- Security updates
- Performance monitoring
- User activity analysis

### 🔗 Related Documentation

#### Frontend Documentation
- [Frontend API Integration](../frontend/docs/API_INTEGRATION.md)
- [Component Library](../frontend/docs/COMPONENTS.md)
- [State Management](../frontend/docs/STATE_MANAGEMENT.md)

#### DevOps Documentation
- [Deployment Guide](../docs/DEPLOYMENT.md)
- [CI/CD Pipeline](../docs/CI_CD.md)
- [Infrastructure Setup](../docs/INFRASTRUCTURE.md)

#### Business Documentation
- [User Guide](../docs/USER_GUIDE.md)
- [Admin Guide](../docs/ADMIN_GUIDE.md)
- [API Integration Guide](../docs/API_INTEGRATION_GUIDE.md)

---

## Contributing

When contributing to the backend:

1. **Follow the coding standards** outlined in the style guide
2. **Write comprehensive tests** for new features
3. **Update documentation** for any API changes
4. **Review security implications** of changes
5. **Test performance impact** of modifications

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## Support

For technical support:
- **Email**: dev-support@pitchforge.com
- **Documentation**: https://docs.pitchforge.com
- **GitHub Issues**: https://github.com/pitchforge/backend/issues
- **Discord**: https://discord.gg/pitchforge

---

*Last updated: January 2024*
*Version: 1.0.0* 