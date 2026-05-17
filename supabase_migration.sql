-- Drop existing tables if they exist
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;

-- Create Users table
CREATE TABLE users (
    uid TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    display_name TEXT,
    photo_url TEXT,
    health_id TEXT UNIQUE NOT NULL,
    created_at BIGINT NOT NULL,
    last_login BIGINT NOT NULL
);

-- Create Messages table
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users(uid) ON DELETE CASCADE NOT NULL,
    role TEXT CHECK (role IN ('user', 'model')) NOT NULL,
    text TEXT NOT NULL,
    timestamp BIGINT NOT NULL,
    is_emergency BOOLEAN DEFAULT FALSE
);

-- Create indexes for performance
CREATE INDEX idx_messages_user_timestamp ON messages(user_id, timestamp ASC);

-- Enable Row Level Security (RLS) optionally (or bypass via Service Role Key)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for service role key access (Service Role bypasses RLS by default, but these are helpful if using Anon key)
CREATE POLICY "Allow service role full access on users" ON users FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service role full access on messages" ON messages FOR ALL TO service_role USING (true) WITH CHECK (true);
