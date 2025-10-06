-- seed_dummy_data.sql
-- Dummy data for Art Dashboard

-- 1. Users (superuser)
INSERT INTO users (username, password_hash, role)
VALUES ('admin', '$2b$12$REPLACE_WITH_HASHED_PASSWORD', 'superuser')
ON CONFLICT (username) DO NOTHING;  -- keep this one

-- 2. Artists
-- No UNIQUE constraint on name, so remove ON CONFLICT
INSERT INTO artists (name, bio)
VALUES
  ('Artist 1', 'Bio for Artist 1'),
  ('Artist 2', 'Bio for Artist 2'),
  ('Artist 3', 'Bio for Artist 3'),
  ('Artist 4', 'Bio for Artist 4'),
  ('Artist 5', 'Bio for Artist 5');

-- 3. Artworks
-- No UNIQUE constraint on title, so remove ON CONFLICT
INSERT INTO artworks (artist_id, title, info, year, price, signed, material, dimensions)
VALUES
  ((SELECT id FROM artists WHERE name='Artist 1' LIMIT 1), 'Artwork 1', 'Info for Artwork 1', 2021, '$100', TRUE, 'Oil on Canvas', '30x40 cm'),
  ((SELECT id FROM artists WHERE name='Artist 1' LIMIT 1), 'Artwork 2', 'Info for Artwork 2', 2022, '$150', FALSE, 'Acrylic', '25x35 cm'),
  
  ((SELECT id FROM artists WHERE name='Artist 2' LIMIT 1), 'Artwork 3', 'Info for Artwork 3', 2020, '$200', TRUE, 'Watercolor', '40x50 cm'),
  ((SELECT id FROM artists WHERE name='Artist 2' LIMIT 1), 'Artwork 4', 'Info for Artwork 4', 2021, '$250', FALSE, 'Oil on Canvas', '30x30 cm'),
  
  ((SELECT id FROM artists WHERE name='Artist 3' LIMIT 1), 'Artwork 5', 'Info for Artwork 5', 2019, '$300', TRUE, 'Acrylic', '50x60 cm'),
  ((SELECT id FROM artists WHERE name='Artist 3' LIMIT 1), 'Artwork 6', 'Info for Artwork 6', 2020, '$350', FALSE, 'Watercolor', '45x55 cm'),
  
  ((SELECT id FROM artists WHERE name='Artist 4' LIMIT 1), 'Artwork 7', 'Info for Artwork 7', 2021, '$400', TRUE, 'Oil on Canvas', '60x70 cm'),
  ((SELECT id FROM artists WHERE name='Artist 4' LIMIT 1), 'Artwork 8', 'Info for Artwork 8', 2022, '$450', FALSE, 'Acrylic', '35x45 cm'),
  
  ((SELECT id FROM artists WHERE name='Artist 5' LIMIT 1), 'Artwork 9', 'Info for Artwork 9', 2020, '$500', TRUE, 'Watercolor', '40x60 cm'),
  ((SELECT id FROM artists WHERE name='Artist 5' LIMIT 1), 'Artwork 10', 'Info for Artwork 10', 2021, '$550', FALSE, 'Oil on Canvas', '50x50 cm');

-- 4. Artwork images
INSERT INTO artwork_images (artwork_id, url, is_cover)
VALUES
  ((SELECT id FROM artworks WHERE title='Artwork 1' LIMIT 1), 'https://m.media-amazon.com/images/I/61kflNHbV-L._AC_SY300_SX300_QL70_FMwebp_.jpg', TRUE),
  ((SELECT id FROM artworks WHERE title='Artwork 1' LIMIT 1), 'https://m.media-amazon.com/images/I/61kflNHbV-L._AC_SY300_SX300_QL70_FMwebp_.jpg', FALSE),
  
  ((SELECT id FROM artworks WHERE title='Artwork 2' LIMIT 1), 'https://m.media-amazon.com/images/I/61kflNHbV-L._AC_SY300_SX300_QL70_FMwebp_.jpg', TRUE),
  ((SELECT id FROM artworks WHERE title='Artwork 2' LIMIT 1), 'https://m.media-amazon.com/images/I/61kflNHbV-L._AC_SY300_SX300_QL70_FMwebp_.jpg', FALSE),

  -- continue similarly for Artwork 3 → Artwork 10
  ((SELECT id FROM artworks WHERE title='Artwork 3' LIMIT 1), 'https://m.media-amazon.com/images/I/61kflNHbV-L._AC_SY300_SX300_QL70_FMwebp_.jpg', TRUE),
  ((SELECT id FROM artworks WHERE title='Artwork 3' LIMIT 1), 'https://m.media-amazon.com/images/I/61kflNHbV-L._AC_SY300_SX300_QL70_FMwebp_.jpg', FALSE),

  ((SELECT id FROM artworks WHERE title='Artwork 4' LIMIT 1), 'https://m.media-amazon.com/images/I/61kflNHbV-L._AC_SY300_SX300_QL70_FMwebp_.jpg', TRUE),
  ((SELECT id FROM artworks WHERE title='Artwork 4' LIMIT 1), 'https://m.media-amazon.com/images/I/61kflNHbV-L._AC_SY300_SX300_QL70_FMwebp_.jpg', FALSE),

  ((SELECT id FROM artworks WHERE title='Artwork 5' LIMIT 1), 'https://m.media-amazon.com/images/I/61kflNHbV-L._AC_SY300_SX300_QL70_FMwebp_.jpg', TRUE),
  ((SELECT id FROM artworks WHERE title='Artwork 5' LIMIT 1), 'https://m.media-amazon.com/images/I/61kflNHbV-L._AC_SY300_SX300_QL70_FMwebp_.jpg', FALSE);

-- 5. Exhibitions
INSERT INTO exhibitions (name, description, public, private)
VALUES
  ('Exhibition 1', 'Description for Exhibition 1', TRUE, FALSE),
  ('Exhibition 2', 'Description for Exhibition 2', TRUE, FALSE),
  ('Exhibition 3', 'Description for Exhibition 3', TRUE, FALSE)
ON CONFLICT (name) DO NOTHING;  -- optional for exhibitions

-- 6. Link artworks to exhibitions
INSERT INTO exhibition_artworks (exhibition_id, artwork_id)
VALUES
  ((SELECT id FROM exhibitions WHERE name='Exhibition 1' LIMIT 1), (SELECT id FROM artworks WHERE title='Artwork 1' LIMIT 1)),
  ((SELECT id FROM exhibitions WHERE name='Exhibition 1' LIMIT 1), (SELECT id FROM artworks WHERE title='Artwork 2' LIMIT 1)),
  ((SELECT id FROM exhibitions WHERE name='Exhibition 2' LIMIT 1), (SELECT id FROM artworks WHERE title='Artwork 3' LIMIT 1)),
  ((SELECT id FROM exhibitions WHERE name='Exhibition 2' LIMIT 1), (SELECT id FROM artworks WHERE title='Artwork 4' LIMIT 1)),
  ((SELECT id FROM exhibitions WHERE name='Exhibition 3' LIMIT 1), (SELECT id FROM artworks WHERE title='Artwork 5' LIMIT 1)),
  ((SELECT id FROM exhibitions WHERE name='Exhibition 3' LIMIT 1), (SELECT id FROM artworks WHERE title='Artwork 6' LIMIT 1));

-- 7. Link artists to exhibitions
INSERT INTO exhibition_artists (exhibition_id, artist_id)
VALUES
  ((SELECT id FROM exhibitions WHERE name='Exhibition 1' LIMIT 1), (SELECT id FROM artists WHERE name='Artist 1' LIMIT 1)),
  ((SELECT id FROM exhibitions WHERE name='Exhibition 1' LIMIT 1), (SELECT id FROM artists WHERE name='Artist 2' LIMIT 1)),
  ((SELECT id FROM exhibitions WHERE name='Exhibition 2' LIMIT 1), (SELECT id FROM artists WHERE name='Artist 3' LIMIT 1)),
  ((SELECT id FROM exhibitions WHERE name='Exhibition 2' LIMIT 1), (SELECT id FROM artists WHERE name='Artist 4' LIMIT 1)),
  ((SELECT id FROM exhibitions WHERE name='Exhibition 3' LIMIT 1), (SELECT id FROM artists WHERE name='Artist 5' LIMIT 1));
