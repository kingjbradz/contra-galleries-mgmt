-- schema.sql
-- Fresh Art Dashboard schema with artwork_images table
-- Single-user dashboard with optional additional users

-- Enable Row Level Security globally
ALTER DATABASE postgres SET row_security = on;

-- Users table (simple auth for dashboard)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user', -- 'superuser' or 'user'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artists table
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artworks table
CREATE TABLE IF NOT EXISTS artworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES artists(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  info TEXT,
  year INT,
  price TEXT,
  signed BOOLEAN DEFAULT FALSE,
  material TEXT,
  dimensions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artwork images table (replaces images array)
CREATE TABLE IF NOT EXISTS artwork_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_cover BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exhibitions table
CREATE TABLE IF NOT EXISTS exhibitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  public BOOLEAN DEFAULT TRUE,
  private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table: exhibitions <-> artworks (many-to-many)
CREATE TABLE IF NOT EXISTS exhibition_artworks (
  exhibition_id UUID REFERENCES exhibitions(id) ON DELETE CASCADE,
  artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
  PRIMARY KEY (exhibition_id, artwork_id)
);

-- Junction table: exhibitions <-> artists (many-to-many)
CREATE TABLE IF NOT EXISTS exhibition_artists (
  exhibition_id UUID REFERENCES exhibitions(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  PRIMARY KEY (exhibition_id, artist_id)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE artwork_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibition_artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibition_artists ENABLE ROW LEVEL SECURITY;

-- User policies:
-- Only superuser can manage users
CREATE POLICY "Superuser can manage all users"
  ON users
  USING (role = 'superuser')
  WITH CHECK (role = 'superuser');

-- Everyone can read and write to artists, artworks, artwork_images, exhibitions
CREATE POLICY "All access to artists" ON artists FOR ALL USING (true);
CREATE POLICY "All access to artworks" ON artworks FOR ALL USING (true);
CREATE POLICY "All access to artwork_images" ON artwork_images FOR ALL USING (true);
CREATE POLICY "All access to exhibitions" ON exhibitions FOR ALL USING (true);
CREATE POLICY "All access to exhibition_artworks" ON exhibition_artworks FOR ALL USING (true);
CREATE POLICY "All access to exhibition_artists" ON exhibition_artists FOR ALL USING (true);
