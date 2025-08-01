# Authentication & User Management Plan

## Overview

This document outlines the comprehensive authentication and user management system for PitchForge, including user registration, role-based access control (RBAC), session management, and security protocols.

## 1. User Registration Flow

### Registration Process

#### Step 1: User Registration
```javascript
// Registration endpoint
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "role": "customer", // customer, team_member, team_manager, admin
  "company": "TechCorp Inc", // optional
  "phone": "+1-555-0123" // optional
}
```

#### Step 2: Email Verification
```javascript
// Email verification endpoint
POST /api/v1/auth/verify-email
{
  "token": "email_verification_token",
  "userId": "user_123"
}
```

#### Step 3: Account Activation
```javascript
// Account activation endpoint
POST /api/v1/auth/activate
{
  "userId": "user_123",
  "activationCode": "123456"
}
```

### Registration Flow Diagram

```
User Registration
       ↓
Email Validation
       ↓
Password Strength Check
       ↓
Role Assignment
       ↓
Email Verification
       ↓
Account Activation
       ↓
Welcome Email
       ↓
Dashboard Access
```

### Registration Validation Rules

#### Email Validation
- Must be valid email format
- Must be unique in system
- Domain validation (optional)
- Disposable email check

#### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character
- Not in common password list

#### Name Validation
- Minimum 2 characters
- Maximum 50 characters
- No special characters except spaces and hyphens

## 2. Role-Based Access Control (RBAC)

### User Roles

#### 1. Customer
**Description**: End users who submit project briefs and receive solution pitches

**Permissions**:
- `read:own_briefs` - View own project briefs
- `write:own_briefs` - Create and edit own briefs
- `read:own_pitches` - View solution pitches for own briefs
- `read:own_profile` - View own profile
- `write:own_profile` - Edit own profile

**Access Levels**:
- Dashboard: Customer-specific view
- Brief Management: Upload, edit, track own briefs
- Pitch Viewing: Read-only access to generated pitches
- Profile Management: Self-service profile updates

#### 2. Team Member
**Description**: Team members who work on briefs and generate pitches

**Permissions**:
- `read:assigned_briefs` - View assigned briefs
- `write:assigned_briefs` - Edit assigned briefs
- `read:case_studies` - View case studies
- `write:pitches` - Create and edit pitches
- `read:own_pitches` - View own created pitches
- `read:own_profile` - View own profile
- `write:own_profile` - Edit own profile

**Access Levels**:
- Dashboard: Team member view with assigned tasks
- Brief Processing: Work on assigned briefs
- Case Studies: Access to case study library
- Pitch Generation: Create and edit solution pitches
- Profile Management: Self-service profile updates

#### 3. Team Manager
**Description**: Managers who oversee team members and approve pitches

**Permissions**:
- `read:all_briefs` - View all project briefs
- `write:all_briefs` - Edit all briefs
- `read:all_pitches` - View all pitches
- `write:all_pitches` - Edit and approve pitches
- `read:case_studies` - View case studies
- `write:case_studies` - Create and edit case studies
- `read:team_members` - View team member profiles
- `write:team_members` - Assign briefs to team members
- `read:analytics` - View analytics and reports
- `read:own_profile` - View own profile
- `write:own_profile` - Edit own profile

**Access Levels**:
- Dashboard: Manager view with team overview
- Brief Management: Full access to all briefs
- Team Management: Assign and manage team members
- Pitch Approval: Review and approve pitches
- Case Study Management: Create and manage case studies
- Analytics: View performance metrics

#### 4. Admin
**Description**: System administrators with full access

**Permissions**:
- `*` - All permissions (wildcard)
- `read:all_users` - View all users
- `write:all_users` - Create, edit, delete users
- `read:system_settings` - View system settings
- `write:system_settings` - Modify system settings
- `read:audit_logs` - View audit logs
- `write:audit_logs` - Manage audit logs

**Access Levels**:
- Dashboard: Admin view with system overview
- User Management: Full user administration
- System Settings: Configuration management
- Audit Logs: Security and activity monitoring
- Analytics: Full system analytics

### Permission Matrix

| Permission | Customer | Team Member | Team Manager | Admin |
|------------|----------|-------------|--------------|-------|
| `read:own_briefs` | ✅ | ❌ | ✅ | ✅ |
| `write:own_briefs` | ✅ | ❌ | ✅ | ✅ |
| `read:assigned_briefs` | ❌ | ✅ | ✅ | ✅ |
| `write:assigned_briefs` | ❌ | ✅ | ✅ | ✅ |
| `read:all_briefs` | ❌ | ❌ | ✅ | ✅ |
| `write:all_briefs` | ❌ | ❌ | ✅ | ✅ |
| `read:own_pitches` | ✅ | ✅ | ✅ | ✅ |
| `write:pitches` | ❌ | ✅ | ✅ | ✅ |
| `read:all_pitches` | ❌ | ❌ | ✅ | ✅ |
| `write:all_pitches` | ❌ | ❌ | ✅ | ✅ |
| `read:case_studies` | ❌ | ✅ | ✅ | ✅ |
| `write:case_studies` | ❌ | ❌ | ✅ | ✅ |
| `read:team_members` | ❌ | ❌ | ✅ | ✅ |
| `write:team_members` | ❌ | ❌ | ✅ | ✅ |
| `read:analytics` | ❌ | ❌ | ✅ | ✅ |
| `read:all_users` | ❌ | ❌ | ❌ | ✅ |
| `write:all_users` | ❌ | ❌ | ❌ | ✅ |
| `read:system_settings` | ❌ | ❌ | ❌ | ✅ |
| `write:system_settings` | ❌ | ❌ | ❌ | ✅ |

## 3. Session Management

### JWT Token Structure

#### Access Token
```javascript
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "user_123",
    "email": "user@example.com",
    "role": "customer",
    "permissions": ["read:own_briefs", "write:own_briefs"],
    "iat": 1640995200,
    "exp": 1640998800, // 1 hour expiration
    "jti": "token_id_123"
  },
  "signature": "HMACSHA256_signature"
}
```

#### Refresh Token
```javascript
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "user_123",
    "tokenType": "refresh",
    "iat": 1640995200,
    "exp": 1641081600, // 24 hour expiration
    "jti": "refresh_token_id_123"
  },
  "signature": "HMACSHA256_signature"
}
```

### Session Configuration

#### Token Expiration
- **Access Token**: 1 hour
- **Refresh Token**: 24 hours
- **Remember Me Token**: 30 days

#### Security Settings
- **Token Rotation**: Enabled
- **Concurrent Sessions**: Limited to 5 per user
- **Session Invalidation**: On password change
- **IP Tracking**: Enabled for security

### Session Management Flow

```javascript
// Login flow
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": false
}

// Response
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "role": "customer",
      "permissions": ["read:own_briefs", "write:own_briefs"]
    }
  }
}
```

### Token Refresh Flow

```javascript
// Refresh token endpoint
POST /api/v1/auth/refresh
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// Response
{
  "success": true,
  "data": {
    "accessToken": "new_access_token",
    "expiresIn": 3600
  }
}
```

## 4. Security Protocols

### Password Security

#### Hashing Algorithm
- **Algorithm**: bcrypt
- **Salt Rounds**: 12
- **Pepper**: Environment variable

#### Password Policy
- Minimum 8 characters
- Maximum 128 characters
- Must contain uppercase, lowercase, number, special character
- Cannot be common password
- Cannot be user's name or email
- Must be different from last 5 passwords

### Multi-Factor Authentication (MFA)

#### TOTP Implementation
```javascript
// Enable MFA
POST /api/v1/auth/mfa/enable
{
  "userId": "user_123"
}

// Response
{
  "success": true,
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCode": "data:image/png;base64,...",
    "backupCodes": ["123456", "234567", "345678"]
  }
}
```

#### MFA Verification
```javascript
// Verify MFA
POST /api/v1/auth/mfa/verify
{
  "userId": "user_123",
  "code": "123456"
}
```

### Rate Limiting

#### Authentication Endpoints
- **Login**: 5 attempts per 15 minutes
- **Register**: 3 attempts per hour
- **Password Reset**: 3 attempts per hour
- **MFA**: 5 attempts per 15 minutes

#### API Endpoints
- **Brief Upload**: 10 requests per hour
- **Pitch Generation**: 20 requests per hour
- **General API**: 100 requests per minute

### Account Lockout

#### Lockout Policy
- **Failed Login Attempts**: 5 attempts
- **Lockout Duration**: 15 minutes
- **Progressive Lockout**: 30 minutes, 1 hour, 24 hours
- **Admin Override**: Available for account unlock

## 5. User Management Operations

### User CRUD Operations

#### Create User
```javascript
POST /api/v1/users
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "name": "Jane Smith",
  "role": "team_member",
  "company": "TechCorp Inc"
}
```

#### Read User
```javascript
GET /api/v1/users/:userId
// Returns user profile with permissions
```

#### Update User
```javascript
PUT /api/v1/users/:userId
{
  "name": "Jane Smith Updated",
  "role": "team_manager",
  "status": "active"
}
```

#### Delete User
```javascript
DELETE /api/v1/users/:userId
// Soft delete - marks as inactive
```

### Bulk Operations

#### Bulk User Import
```javascript
POST /api/v1/users/bulk-import
{
  "users": [
    {
      "email": "user1@example.com",
      "name": "User One",
      "role": "team_member"
    },
    {
      "email": "user2@example.com",
      "name": "User Two",
      "role": "customer"
    }
  ]
}
```

#### Bulk Permission Update
```javascript
PUT /api/v1/users/bulk-permissions
{
  "userIds": ["user_123", "user_456"],
  "permissions": ["read:case_studies", "write:pitches"],
  "action": "add" // add, remove, replace
}
```

## 6. Audit and Logging

### Audit Events

#### Authentication Events
- `user.login.success`
- `user.login.failed`
- `user.logout`
- `user.register`
- `user.password_change`
- `user.mfa_enable`
- `user.mfa_disable`

#### Authorization Events
- `permission.granted`
- `permission.revoked`
- `role.changed`
- `access.denied`

#### User Management Events
- `user.created`
- `user.updated`
- `user.deleted`
- `user.status_changed`

### Audit Log Structure

```javascript
{
  "id": "audit_123",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "userId": "user_123",
  "action": "user.login.success",
  "resource": "auth",
  "details": {
    "ip": "192.168.1.100",
    "userAgent": "Mozilla/5.0...",
    "location": "New York, US"
  },
  "metadata": {
    "sessionId": "session_123",
    "requestId": "req_456"
  }
}
```

## 7. Password Reset Flow

### Password Reset Request
```javascript
POST /api/v1/auth/forgot-password
{
  "email": "user@example.com"
}
```

### Password Reset Token
```javascript
// Token sent via email
{
  "token": "reset_token_123",
  "expiresAt": "2024-01-01T13:00:00.000Z",
  "userId": "user_123"
}
```

### Password Reset Completion
```javascript
POST /api/v1/auth/reset-password
{
  "token": "reset_token_123",
  "newPassword": "newSecurePassword123"
}
```

## 8. API Security Headers

### Security Headers Configuration
```javascript
// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### CORS Configuration
```javascript
// CORS settings
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 9. Implementation Checklist

### Phase 1: Basic Authentication
- [ ] User registration endpoint
- [ ] User login endpoint
- [ ] JWT token generation
- [ ] Password hashing with bcrypt
- [ ] Basic role assignment

### Phase 2: Advanced Security
- [ ] Email verification
- [ ] Password reset flow
- [ ] Rate limiting
- [ ] Account lockout
- [ ] Security headers

### Phase 3: RBAC Implementation
- [ ] Permission system
- [ ] Role-based middleware
- [ ] Permission checking utilities
- [ ] User permission matrix

### Phase 4: Session Management
- [ ] Refresh token implementation
- [ ] Token rotation
- [ ] Session tracking
- [ ] Concurrent session limits

### Phase 5: Audit and Monitoring
- [ ] Audit logging
- [ ] Security event tracking
- [ ] User activity monitoring
- [ ] Admin dashboard for user management

## 10. Testing Strategy

### Unit Tests
- Password validation
- JWT token generation/validation
- Permission checking
- Role assignment

### Integration Tests
- Authentication flow
- User registration
- Password reset
- Session management

### Security Tests
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting effectiveness

### Load Tests
- Concurrent user sessions
- Token refresh performance
- Database query optimization
- Memory usage monitoring

## 11. Deployment Considerations

### Environment Variables
```bash
# Authentication
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
BCRYPT_ROUNDS=12

# Security
SESSION_SECRET=your_session_secret_here
COOKIE_SECRET=your_cookie_secret_here

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Database Schema
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'customer',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  email_verified BOOLEAN DEFAULT FALSE,
  mfa_enabled BOOLEAN DEFAULT FALSE,
  mfa_secret VARCHAR(255),
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User permissions table
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  permission VARCHAR(100) NOT NULL,
  granted_at TIMESTAMP DEFAULT NOW(),
  granted_by UUID REFERENCES users(id)
);

-- Sessions table
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  refresh_token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Audit logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100),
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

This comprehensive authentication and user management plan provides a secure, scalable foundation for the PitchForge platform with proper role-based access control, session management, and security protocols. 