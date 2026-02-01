-- Migration: Create user_admins table for multi-admin functionality
-- Run this SQL in your Neon/PostgreSQL database to enable the admin management feature

-- Create the user_admins table
CREATE TABLE IF NOT EXISTS user_admins (
    id SERIAL PRIMARY KEY,
    owner_user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    admin_user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'admin', -- 'admin', 'editor', 'viewer'
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'pending', 'revoked'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(owner_user_id, admin_user_id)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_admins_owner ON user_admins(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_user_admins_admin ON user_admins(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_user_admins_status ON user_admins(status);

-- Add comments for documentation
COMMENT ON TABLE user_admins IS 'Stores admin relationships between users - allows multiple users to access the same workspace';
COMMENT ON COLUMN user_admins.owner_user_id IS 'The user who owns the workspace/data';
COMMENT ON COLUMN user_admins.admin_user_id IS 'The user who has been granted admin access';
COMMENT ON COLUMN user_admins.role IS 'Permission level: admin (full), editor (edit), viewer (read-only)';
COMMENT ON COLUMN user_admins.status IS 'Status of the admin relationship: active, pending, revoked';
