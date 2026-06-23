CREATE TABLE IF NOT EXISTS submissions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  email TEXT,
  team TEXT,
  colors TEXT,
  quantity INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);