-- 0001_init.sql
-- Initial schema for acmarine.co (multi-tenant yacht brokerage).
-- All tables idempotent (IF NOT EXISTS). Foreign keys are explicit.
-- Vessel is a first-class entity linked to contacts and deals (spec §3).

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id           TEXT PRIMARY KEY,
  email        TEXT NOT NULL UNIQUE,
  name         TEXT,
  role         TEXT NOT NULL DEFAULT 'broker' CHECK (role IN ('super_admin','broker_of_record','broker','staff')),
  broker_id    TEXT REFERENCES brokers(id) ON DELETE SET NULL,
  created_at   INTEGER NOT NULL DEFAULT (unixepoch()),
  last_login_at INTEGER,
  status       TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','invited'))
);

CREATE TABLE IF NOT EXISTS brokers (
  id              TEXT PRIMARY KEY,
  subdomain       TEXT NOT NULL UNIQUE,
  display_name    TEXT NOT NULL,
  legal_name      TEXT,
  email           TEXT NOT NULL,
  phone           TEXT,
  bio             TEXT,
  avatar_url      TEXT,
  cover_url       TEXT,
  license_number  TEXT,
  license_state   TEXT,
  license_expires INTEGER,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','suspended','archived')),
  approved_at     INTEGER,
  broker_of_record_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  theme           TEXT,
  syndication_enabled INTEGER NOT NULL DEFAULT 0,
  created_at      INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at      INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_brokers_subdomain ON brokers(subdomain);
CREATE INDEX IF NOT EXISTS idx_brokers_status ON brokers(status);

CREATE TABLE IF NOT EXISTS subdomains (
  subdomain   TEXT PRIMARY KEY,
  broker_id   TEXT NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  reserved    INTEGER NOT NULL DEFAULT 0,
  blocked     INTEGER NOT NULL DEFAULT 0,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS vessels (
  id            TEXT PRIMARY KEY,
  broker_id     TEXT NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  owner_contact_id TEXT REFERENCES contacts(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  make          TEXT,
  model         TEXT,
  year          INTEGER,
  length_ft     REAL,
  beam_ft       REAL,
  draft_ft      REAL,
  hull_material TEXT,
  hull_id       TEXT,
  engine_make   TEXT,
  engine_model  TEXT,
  engine_hours  INTEGER,
  fuel_type     TEXT,
  location      TEXT,
  description   TEXT,
  spec          TEXT,
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','sold','archived','draft')),
  created_at    INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at    INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_vessels_broker ON vessels(broker_id);
CREATE INDEX IF NOT EXISTS idx_vessels_status ON vessels(status);

CREATE TABLE IF NOT EXISTS listings (
  id            TEXT PRIMARY KEY,
  broker_id     TEXT NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  vessel_id     TEXT NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
  slug          TEXT NOT NULL,
  headline      TEXT NOT NULL,
  asking_price  INTEGER,
  currency      TEXT NOT NULL DEFAULT 'USD',
  description   TEXT,
  status        TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','sold','withdrawn')),
  published_at  INTEGER,
  syndicate_yachtworld INTEGER NOT NULL DEFAULT 0,
  syndicate_yatco      INTEGER NOT NULL DEFAULT 0,
  syndicate_rightboat  INTEGER NOT NULL DEFAULT 0,
  created_at    INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at    INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE (broker_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_listings_broker ON listings(broker_id);
CREATE INDEX IF NOT EXISTS idx_listings_vessel ON listings(vessel_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_published ON listings(status, published_at);

CREATE TABLE IF NOT EXISTS media (
  id            TEXT PRIMARY KEY,
  vessel_id     TEXT NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
  listing_id    TEXT REFERENCES listings(id) ON DELETE SET NULL,
  blob_key      TEXT NOT NULL,
  kind          TEXT NOT NULL DEFAULT 'image' CHECK (kind IN ('image','video','doc')),
  alt           TEXT,
  width         INTEGER,
  height        INTEGER,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  is_cover      INTEGER NOT NULL DEFAULT 0,
  created_at    INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_media_vessel ON media(vessel_id);
CREATE INDEX IF NOT EXISTS idx_media_listing ON media(listing_id);

CREATE TABLE IF NOT EXISTS contacts (
  id            TEXT PRIMARY KEY,
  broker_id     TEXT NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  kind          TEXT NOT NULL DEFAULT 'buyer' CHECK (kind IN ('buyer','seller','both','vendor')),
  name          TEXT NOT NULL,
  email         TEXT,
  phone         TEXT,
  notes         TEXT,
  prefs         TEXT,
  created_at    INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at    INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_contacts_broker ON contacts(broker_id);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(broker_id, email);

CREATE TABLE IF NOT EXISTS deals (
  id            TEXT PRIMARY KEY,
  broker_id     TEXT NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  vessel_id     TEXT NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
  buyer_contact_id TEXT REFERENCES contacts(id) ON DELETE SET NULL,
  seller_contact_id TEXT REFERENCES contacts(id) ON DELETE SET NULL,
  stage         TEXT NOT NULL DEFAULT 'inquiry' CHECK (stage IN ('inquiry','showing','offer','survey','sea_trial','closing','closed_won','closed_lost')),
  offer_amount  INTEGER,
  agreed_amount INTEGER,
  currency      TEXT NOT NULL DEFAULT 'USD',
  co_broker_id  TEXT REFERENCES brokers(id) ON DELETE SET NULL,
  expected_close INTEGER,
  closed_at     INTEGER,
  notes         TEXT,
  created_at    INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at    INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_deals_broker_stage ON deals(broker_id, stage);
CREATE INDEX IF NOT EXISTS idx_deals_vessel ON deals(vessel_id);

CREATE TABLE IF NOT EXISTS documents (
  id            TEXT PRIMARY KEY,
  broker_id     TEXT NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  deal_id       TEXT REFERENCES deals(id) ON DELETE SET NULL,
  kind          TEXT NOT NULL DEFAULT 'purchase_sale',
  blob_key      TEXT NOT NULL,
  pdf_hash      TEXT,
  signed_at     INTEGER,
  signer_name   TEXT,
  signer_email  TEXT,
  signer_ip     TEXT,
  signer_user_agent TEXT,
  audit_trail   TEXT,
  created_at    INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_documents_deal ON documents(deal_id);
CREATE INDEX IF NOT EXISTS idx_documents_broker ON documents(broker_id);

CREATE TABLE IF NOT EXISTS commissions (
  id            TEXT PRIMARY KEY,
  deal_id       TEXT NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  gross_amount  INTEGER NOT NULL,
  co_broke_split_bps INTEGER NOT NULL DEFAULT 5000,
  house_take_bps     INTEGER NOT NULL DEFAULT 1000,
  broker_net    INTEGER NOT NULL,
  currency      TEXT NOT NULL DEFAULT 'USD',
  calculated_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_commissions_deal ON commissions(deal_id);

CREATE TABLE IF NOT EXISTS leads (
  id            TEXT PRIMARY KEY,
  broker_id     TEXT NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  listing_id    TEXT REFERENCES listings(id) ON DELETE SET NULL,
  vessel_id     TEXT REFERENCES vessels(id) ON DELETE SET NULL,
  source        TEXT NOT NULL DEFAULT 'microsite' CHECK (source IN ('microsite','marketplace','syndication','manual','show')),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  message       TEXT,
  ip            TEXT,
  user_agent    TEXT,
  status        TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','closed')),
  first_response_at INTEGER,
  notification_email_status TEXT,
  notification_email_error  TEXT,
  created_at    INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_leads_broker_status ON leads(broker_id, status);
CREATE INDEX IF NOT EXISTS idx_leads_listing ON leads(listing_id);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(broker_id, created_at);

CREATE TABLE IF NOT EXISTS activities (
  id          TEXT PRIMARY KEY,
  broker_id   TEXT NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  user_id     TEXT REFERENCES users(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL,
  entity_id   TEXT NOT NULL,
  action      TEXT NOT NULL,
  payload     TEXT,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_activities_broker_time ON activities(broker_id, created_at);
CREATE INDEX IF NOT EXISTS idx_activities_entity ON activities(entity_type, entity_id);

CREATE TABLE IF NOT EXISTS escrow_deposits (
  id            TEXT PRIMARY KEY,
  deal_id       TEXT NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  amount        INTEGER NOT NULL,
  currency      TEXT NOT NULL DEFAULT 'USD',
  received_at   INTEGER,
  released_at   INTEGER,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','held','released','refunded')),
  notes         TEXT,
  created_at    INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_escrow_deal ON escrow_deposits(deal_id);

CREATE TABLE IF NOT EXISTS billing (
  id            TEXT PRIMARY KEY,
  broker_id     TEXT NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan          TEXT NOT NULL DEFAULT 'free',
  status        TEXT NOT NULL DEFAULT 'active',
  current_period_end INTEGER,
  mrr_cents     INTEGER NOT NULL DEFAULT 0,
  created_at    INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at    INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_billing_broker ON billing(broker_id);

CREATE TABLE IF NOT EXISTS syndication_runs (
  id            TEXT PRIMARY KEY,
  broker_id     TEXT NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  channel       TEXT NOT NULL CHECK (channel IN ('yachtworld','yatco','rightboat')),
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','running','success','failed')),
  blob_key      TEXT,
  listing_count INTEGER,
  error         TEXT,
  started_at    INTEGER NOT NULL DEFAULT (unixepoch()),
  finished_at   INTEGER
);
CREATE INDEX IF NOT EXISTS idx_syndication_broker_time ON syndication_runs(broker_id, started_at);
