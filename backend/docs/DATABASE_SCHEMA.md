# Database Schema Design

## Overview

This document outlines the complete database schema for the PitchForge platform, including all tables, relationships, indexes, and constraints for optimal performance and data integrity.

## Database Technology

- **Database**: PostgreSQL 14+
- **Extensions**: UUID, JSONB, Full-Text Search
- **Connection Pool**: pgBouncer (recommended)
- **Backup**: Automated daily backups with point-in-time recovery

## 1. User Management Tables

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'team_member', 'team_manager', 'admin')),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
  email_verified BOOLEAN DEFAULT FALSE,
  mfa_enabled BOOLEAN DEFAULT FALSE,
  mfa_secret VARCHAR(255),
  company VARCHAR(255),
  phone VARCHAR(50),
  avatar_url TEXT,
  timezone VARCHAR(50) DEFAULT 'UTC',
  language VARCHAR(10) DEFAULT 'en',
  last_login TIMESTAMP,
  login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT users_name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 100)
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_last_login ON users(last_login);
```

### User Permissions Table
```sql
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission VARCHAR(100) NOT NULL,
  granted_at TIMESTAMP DEFAULT NOW(),
  granted_by UUID REFERENCES users(id),
  expires_at TIMESTAMP,
  
  CONSTRAINT user_permissions_unique UNIQUE(user_id, permission)
);

-- Indexes
CREATE INDEX idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX idx_user_permissions_permission ON user_permissions(permission);
CREATE INDEX idx_user_permissions_expires_at ON user_permissions(expires_at);
```

### User Sessions Table
```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token VARCHAR(500) NOT NULL UNIQUE,
  access_token_hash VARCHAR(255),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  device_info JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  
  CONSTRAINT user_sessions_expires_at_future CHECK (expires_at > NOW())
);

-- Indexes
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_refresh_token ON user_sessions(refresh_token);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active) WHERE is_active = TRUE;
```

### Audit Logs Table
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100),
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  location JSONB,
  session_id UUID,
  request_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_request_id ON audit_logs(request_id);
```

## 2. Project Briefs Tables

### Project Briefs Table
```sql
CREATE TABLE project_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  industry VARCHAR(100) NOT NULL,
  budget_min DECIMAL(12,2),
  budget_max DECIMAL(12,2),
  budget_currency VARCHAR(3) DEFAULT 'USD',
  timeline_min_months INTEGER,
  timeline_max_months INTEGER,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES users(id),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  
  -- Parsed content
  objectives JSONB,
  requirements JSONB,
  client_details JSONB,
  technical_specs JSONB,
  constraints JSONB,
  
  -- Processing metadata
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  processing_time_ms INTEGER,
  parsed_at TIMESTAMP,
  
  -- File upload info
  original_file_name VARCHAR(255),
  original_file_size INTEGER,
  original_file_type VARCHAR(100),
  file_hash VARCHAR(64),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT project_briefs_budget_range CHECK (budget_min <= budget_max),
  CONSTRAINT project_briefs_timeline_range CHECK (timeline_min_months <= timeline_max_months)
);

-- Indexes
CREATE INDEX idx_project_briefs_user_id ON project_briefs(user_id);
CREATE INDEX idx_project_briefs_status ON project_briefs(status);
CREATE INDEX idx_project_briefs_industry ON project_briefs(industry);
CREATE INDEX idx_project_briefs_assigned_to ON project_briefs(assigned_to);
CREATE INDEX idx_project_briefs_created_at ON project_briefs(created_at);
CREATE INDEX idx_project_briefs_updated_at ON project_briefs(updated_at);
CREATE INDEX idx_project_briefs_priority ON project_briefs(priority);
CREATE INDEX idx_project_briefs_budget_range ON project_briefs(budget_min, budget_max);
CREATE INDEX idx_project_briefs_timeline_range ON project_briefs(timeline_min_months, timeline_max_months);

-- Full-text search
CREATE INDEX idx_project_briefs_search ON project_briefs USING GIN (
  to_tsvector('english', title || ' ' || COALESCE(array_to_string(objectives, ' '), ''))
);
```

### Brief Processing History Table
```sql
CREATE TABLE brief_processing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID NOT NULL REFERENCES project_briefs(id) ON DELETE CASCADE,
  processor_id UUID REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  details JSONB,
  processing_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_brief_processing_history_brief_id ON brief_processing_history(brief_id);
CREATE INDEX idx_brief_processing_history_processor_id ON brief_processing_history(processor_id);
CREATE INDEX idx_brief_processing_history_created_at ON brief_processing_history(created_at);
```

## 3. Case Studies Tables

### Case Studies Table
```sql
CREATE TABLE case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  industry VARCHAR(100) NOT NULL,
  description TEXT,
  content TEXT,
  
  -- Project details
  budget DECIMAL(12,2),
  budget_currency VARCHAR(3) DEFAULT 'USD',
  timeline_months INTEGER,
  team_size INTEGER,
  
  -- Outcomes and metrics
  outcomes JSONB,
  metrics JSONB,
  roi_percentage DECIMAL(5,2),
  
  -- Categorization
  tags TEXT[],
  technologies TEXT[],
  methodologies TEXT[],
  
  -- Similarity scoring
  similarity_algorithm VARCHAR(50),
  similarity_weights JSONB,
  
  -- Metadata
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
  created_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT case_studies_budget_positive CHECK (budget > 0),
  CONSTRAINT case_studies_timeline_positive CHECK (timeline_months > 0),
  CONSTRAINT case_studies_roi_percentage CHECK (roi_percentage >= -100 AND roi_percentage <= 1000)
);

-- Indexes
CREATE INDEX idx_case_studies_industry ON case_studies(industry);
CREATE INDEX idx_case_studies_status ON case_studies(status);
CREATE INDEX idx_case_studies_created_by ON case_studies(created_by);
CREATE INDEX idx_case_studies_created_at ON case_studies(created_at);
CREATE INDEX idx_case_studies_budget ON case_studies(budget);
CREATE INDEX idx_case_studies_timeline_months ON case_studies(timeline_months);
CREATE INDEX idx_case_studies_tags ON case_studies USING GIN(tags);
CREATE INDEX idx_case_studies_technologies ON case_studies USING GIN(technologies);

-- Full-text search
CREATE INDEX idx_case_studies_search ON case_studies USING GIN (
  to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(content, ''))
);
```

### Case Study Similarity Scores Table
```sql
CREATE TABLE case_study_similarity_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID NOT NULL REFERENCES project_briefs(id) ON DELETE CASCADE,
  case_study_id UUID NOT NULL REFERENCES case_studies(id) ON DELETE CASCADE,
  
  -- Similarity scores
  overall_score DECIMAL(3,2) CHECK (overall_score >= 0 AND overall_score <= 1),
  industry_match DECIMAL(3,2) CHECK (industry_match >= 0 AND industry_match <= 1),
  budget_compatibility DECIMAL(3,2) CHECK (budget_compatibility >= 0 AND budget_compatibility <= 1),
  timeline_compatibility DECIMAL(3,2) CHECK (timeline_compatibility >= 0 AND timeline_compatibility <= 1),
  content_similarity DECIMAL(3,2) CHECK (content_similarity >= 0 AND content_similarity <= 1),
  
  -- Detailed scoring
  relevance_factors JSONB,
  keyword_matches TEXT[],
  
  -- Ranking
  rank_position INTEGER,
  is_recommended BOOLEAN DEFAULT FALSE,
  
  calculated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT case_study_similarity_scores_unique UNIQUE(brief_id, case_study_id)
);

-- Indexes
CREATE INDEX idx_case_study_similarity_scores_brief_id ON case_study_similarity_scores(brief_id);
CREATE INDEX idx_case_study_similarity_scores_case_study_id ON case_study_similarity_scores(case_study_id);
CREATE INDEX idx_case_study_similarity_scores_overall_score ON case_study_similarity_scores(overall_score DESC);
CREATE INDEX idx_case_study_similarity_scores_recommended ON case_study_similarity_scores(is_recommended) WHERE is_recommended = TRUE;
CREATE INDEX idx_case_study_similarity_scores_rank_position ON case_study_similarity_scores(rank_position);
```

## 4. Solution Pitches Tables

### Solution Pitches Table
```sql
CREATE TABLE solution_pitches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID NOT NULL REFERENCES project_briefs(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id),
  assigned_to UUID REFERENCES users(id),
  
  -- Pitch details
  title VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'rejected', 'submitted')),
  version INTEGER DEFAULT 1,
  
  -- Content sections
  content JSONB NOT NULL,
  template_id UUID,
  
  -- Case study integration
  case_study_ids UUID[],
  case_study_integration JSONB,
  
  -- Generation metadata
  generation_algorithm VARCHAR(50),
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  processing_time_ms INTEGER,
  generated_at TIMESTAMP,
  
  -- Review and approval
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  review_notes TEXT,
  approval_reason TEXT,
  
  -- Customizations
  customizations JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT solution_pitches_version_positive CHECK (version > 0)
);

-- Indexes
CREATE INDEX idx_solution_pitches_brief_id ON solution_pitches(brief_id);
CREATE INDEX idx_solution_pitches_created_by ON solution_pitches(created_by);
CREATE INDEX idx_solution_pitches_assigned_to ON solution_pitches(assigned_to);
CREATE INDEX idx_solution_pitches_status ON solution_pitches(status);
CREATE INDEX idx_solution_pitches_version ON solution_pitches(version);
CREATE INDEX idx_solution_pitches_created_at ON solution_pitches(created_at);
CREATE INDEX idx_solution_pitches_updated_at ON solution_pitches(updated_at);
CREATE INDEX idx_solution_pitches_reviewed_by ON solution_pitches(reviewed_by);
CREATE INDEX idx_solution_pitches_case_study_ids ON solution_pitches USING GIN(case_study_ids);

-- Full-text search
CREATE INDEX idx_solution_pitches_search ON solution_pitches USING GIN (
  to_tsvector('english', title || ' ' || COALESCE(content::text, ''))
);
```

### Pitch Templates Table
```sql
CREATE TABLE pitch_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  industry VARCHAR(100),
  
  -- Template structure
  sections JSONB NOT NULL,
  content_template TEXT NOT NULL,
  variables JSONB,
  
  -- Metadata
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_pitch_templates_industry ON pitch_templates(industry);
CREATE INDEX idx_pitch_templates_is_default ON pitch_templates(is_default) WHERE is_default = TRUE;
CREATE INDEX idx_pitch_templates_is_active ON pitch_templates(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_pitch_templates_created_by ON pitch_templates(created_by);
```

### Pitch Review History Table
```sql
CREATE TABLE pitch_review_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pitch_id UUID NOT NULL REFERENCES solution_pitches(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id),
  
  -- Review details
  action VARCHAR(50) NOT NULL, -- 'approve', 'reject', 'request_changes', 'comment'
  status_from VARCHAR(20),
  status_to VARCHAR(20),
  comments TEXT,
  review_data JSONB,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_pitch_review_history_pitch_id ON pitch_review_history(pitch_id);
CREATE INDEX idx_pitch_review_history_reviewer_id ON pitch_review_history(reviewer_id);
CREATE INDEX idx_pitch_review_history_action ON pitch_review_history(action);
CREATE INDEX idx_pitch_review_history_created_at ON pitch_review_history(created_at);
```

## 5. Analytics and Reporting Tables

### User Activity Logs Table
```sql
CREATE TABLE user_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id UUID,
  
  -- Activity details
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100),
  resource_id UUID,
  details JSONB,
  
  -- Performance metrics
  response_time_ms INTEGER,
  request_size_bytes INTEGER,
  response_size_bytes INTEGER,
  
  -- Technical details
  ip_address INET,
  user_agent TEXT,
  device_info JSONB,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX idx_user_activity_logs_action ON user_activity_logs(action);
CREATE INDEX idx_user_activity_logs_created_at ON user_activity_logs(created_at);
CREATE INDEX idx_user_activity_logs_resource ON user_activity_logs(resource, resource_id);
```

### System Metrics Table
```sql
CREATE TABLE system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL(10,4),
  metric_unit VARCHAR(20),
  tags JSONB,
  
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_system_metrics_name ON system_metrics(metric_name);
CREATE INDEX idx_system_metrics_recorded_at ON system_metrics(recorded_at);
CREATE INDEX idx_system_metrics_tags ON system_metrics USING GIN(tags);
```

## 6. Notifications Table

### Notifications Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Notification details
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  data JSONB,
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  is_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP,
  
  -- Delivery
  delivery_method VARCHAR(20) DEFAULT 'in_app' CHECK (delivery_method IN ('in_app', 'email', 'sms', 'push')),
  delivery_status VARCHAR(20) DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'failed', 'delivered')),
  
  -- Expiration
  expires_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT notifications_expires_at_future CHECK (expires_at IS NULL OR expires_at > NOW())
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_expires_at ON notifications(expires_at);
```

## 7. Database Functions and Triggers

### Updated At Trigger Function
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

### Apply Updated At Trigger
```sql
-- Apply to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_briefs_updated_at BEFORE UPDATE ON project_briefs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_case_studies_updated_at BEFORE UPDATE ON case_studies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_solution_pitches_updated_at BEFORE UPDATE ON solution_pitches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pitch_templates_updated_at BEFORE UPDATE ON pitch_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Similarity Score Calculation Function
```sql
CREATE OR REPLACE FUNCTION calculate_similarity_score(
  brief_industry VARCHAR(100),
  brief_budget_min DECIMAL(12,2),
  brief_budget_max DECIMAL(12,2),
  brief_timeline_min INTEGER,
  brief_timeline_max INTEGER,
  case_study_industry VARCHAR(100),
  case_study_budget DECIMAL(12,2),
  case_study_timeline_months INTEGER
)
RETURNS DECIMAL(3,2) AS $$
DECLARE
  industry_score DECIMAL(3,2);
  budget_score DECIMAL(3,2);
  timeline_score DECIMAL(3,2);
  overall_score DECIMAL(3,2);
BEGIN
  -- Industry match (exact = 1.0, similar = 0.7, different = 0.3)
  IF brief_industry = case_study_industry THEN
    industry_score := 1.0;
  ELSIF brief_industry IN ('Technology', 'Software') AND case_study_industry IN ('Technology', 'Software') THEN
    industry_score := 0.7;
  ELSE
    industry_score := 0.3;
  END IF;
  
  -- Budget compatibility
  IF case_study_budget BETWEEN brief_budget_min AND brief_budget_max THEN
    budget_score := 1.0;
  ELSIF case_study_budget >= brief_budget_min * 0.8 AND case_study_budget <= brief_budget_max * 1.2 THEN
    budget_score := 0.8;
  ELSE
    budget_score := 0.3;
  END IF;
  
  -- Timeline compatibility
  IF case_study_timeline_months BETWEEN brief_timeline_min AND brief_timeline_max THEN
    timeline_score := 1.0;
  ELSIF case_study_timeline_months >= brief_timeline_min * 0.8 AND case_study_timeline_months <= brief_timeline_max * 1.2 THEN
    timeline_score := 0.8;
  ELSE
    timeline_score := 0.3;
  END IF;
  
  -- Weighted overall score
  overall_score := (industry_score * 0.4) + (budget_score * 0.3) + (timeline_score * 0.3);
  
  RETURN ROUND(overall_score, 2);
END;
$$ LANGUAGE plpgsql;
```

## 8. Database Views

### Active Users View
```sql
CREATE VIEW active_users AS
SELECT 
  id,
  email,
  name,
  role,
  company,
  last_login,
  created_at
FROM users 
WHERE status = 'active' AND email_verified = TRUE;
```

### Brief Summary View
```sql
CREATE VIEW brief_summary AS
SELECT 
  pb.id,
  pb.title,
  pb.industry,
  pb.status,
  pb.priority,
  pb.progress,
  u.name as created_by_name,
  u.email as created_by_email,
  a.name as assigned_to_name,
  pb.created_at,
  pb.updated_at
FROM project_briefs pb
JOIN users u ON pb.user_id = u.id
LEFT JOIN users a ON pb.assigned_to = a.id;
```

### Pitch Summary View
```sql
CREATE VIEW pitch_summary AS
SELECT 
  sp.id,
  sp.title,
  sp.status,
  sp.version,
  sp.confidence_score,
  pb.title as brief_title,
  pb.industry as brief_industry,
  c.name as created_by_name,
  a.name as assigned_to_name,
  r.name as reviewed_by_name,
  sp.created_at,
  sp.updated_at
FROM solution_pitches sp
JOIN project_briefs pb ON sp.brief_id = pb.id
JOIN users c ON sp.created_by = c.id
LEFT JOIN users a ON sp.assigned_to = a.id
LEFT JOIN users r ON sp.reviewed_by = r.id;
```

## 9. Database Maintenance

### Vacuum and Analyze
```sql
-- Create maintenance function
CREATE OR REPLACE FUNCTION maintenance_cleanup()
RETURNS void AS $$
BEGIN
  -- Vacuum tables
  VACUUM ANALYZE users;
  VACUUM ANALYZE project_briefs;
  VACUUM ANALYZE case_studies;
  VACUUM ANALYZE solution_pitches;
  VACUUM ANALYZE audit_logs;
  
  -- Clean up old sessions
  DELETE FROM user_sessions WHERE expires_at < NOW() - INTERVAL '30 days';
  
  -- Clean up old audit logs (keep last 90 days)
  DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Clean up old notifications (keep last 30 days)
  DELETE FROM notifications WHERE created_at < NOW() - INTERVAL '30 days' AND is_read = TRUE;
END;
$$ LANGUAGE plpgsql;
```

### Partitioning Strategy (for large datasets)
```sql
-- Example: Partition audit_logs by month
CREATE TABLE audit_logs_y2024m01 PARTITION OF audit_logs
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE audit_logs_y2024m02 PARTITION OF audit_logs
FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
```

## 10. Backup and Recovery

### Backup Strategy
```bash
#!/bin/bash
# Daily backup script

# Full backup
pg_dump -h localhost -U postgres -d pitchforge -F c -f /backups/pitchforge_$(date +%Y%m%d).dump

# WAL archiving for point-in-time recovery
# Configure in postgresql.conf:
# archive_mode = on
# archive_command = 'cp %p /var/lib/postgresql/wal/%f'
```

### Recovery Procedures
```sql
-- Point-in-time recovery example
-- pg_restore -h localhost -U postgres -d pitchforge -v /backups/pitchforge_20240101.dump

-- Data consistency check
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN email_verified = TRUE THEN 1 END) as verified_users,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_users
FROM users;
```

## 11. Performance Optimization

### Query Optimization
```sql
-- Add covering indexes for common queries
CREATE INDEX idx_project_briefs_user_status_created ON project_briefs(user_id, status, created_at DESC);

-- Add partial indexes for active records
CREATE INDEX idx_project_briefs_active ON project_briefs(user_id, created_at) WHERE status = 'active';

-- Add composite indexes for filtering
CREATE INDEX idx_case_studies_industry_status_budget ON case_studies(industry, status, budget) WHERE status = 'active';
```

### Connection Pooling
```ini
# pgBouncer configuration
[databases]
pitchforge = host=localhost port=5432 dbname=pitchforge

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 20
```

This comprehensive database schema provides a solid foundation for the PitchForge platform with proper indexing, constraints, and performance optimizations for scalability and data integrity. 