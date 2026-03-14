CREATE TABLE IF NOT EXISTS prices (
  id          TEXT PRIMARY KEY,
  laptop_id   TEXT NOT NULL,
  retailer    TEXT NOT NULL,
  price_chf   REAL NOT NULL,
  price_type  TEXT,
  url         TEXT,
  note        TEXT,
  date_added  TEXT NOT NULL,
  is_user_added INTEGER NOT NULL DEFAULT 0,
  source      TEXT NOT NULL DEFAULT 'seed'
);

CREATE INDEX IF NOT EXISTS idx_prices_laptop_id ON prices(laptop_id);
CREATE INDEX IF NOT EXISTS idx_prices_source ON prices(source);
