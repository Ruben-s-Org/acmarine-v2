-- seed.sql, idempotent demo data for Phase 1.
-- Uses INSERT OR IGNORE so applying twice is a no-op.

INSERT OR IGNORE INTO users (id, email, name, role, status)
VALUES
  ('usr_admin', 'admin@acmarine.co', 'AC Marine Admin', 'super_admin', 'active'),
  ('usr_alex',  'alex@example.com',  'Alex Yarrow',     'broker',      'active'),
  ('usr_brit',  'brit@example.com',  'Brit Tideway',    'broker',      'active');

INSERT OR IGNORE INTO brokers (id, subdomain, display_name, legal_name, email, phone, bio, license_number, license_state, status, approved_at, broker_of_record_user_id, syndication_enabled)
VALUES
  (
    'brk_alex', 'alex', 'Alex Yarrow Yachts', 'Yarrow Marine LLC',
    'alex@example.com', '+1-305-555-0101',
    'Miami-based broker specializing in offshore cruisers 35-65ft. 14 years on the water.',
    'FL-12345', 'FL', 'approved', unixepoch(), 'usr_alex', 1
  ),
  (
    'brk_brit', 'brit', 'Tideway Brokerage', 'Tideway Brokerage LLC',
    'brit@example.com', '+1-727-555-0102',
    'Sailing yachts and bluewater cruisers, Tampa Bay to the Keys.',
    'FL-67890', 'FL', 'approved', unixepoch(), 'usr_brit', 0
  );

INSERT OR IGNORE INTO subdomains (subdomain, broker_id, reserved)
VALUES ('alex','brk_alex',1), ('brit','brk_brit',1);

INSERT OR IGNORE INTO vessels (id, broker_id, name, make, model, year, length_ft, beam_ft, draft_ft, hull_material, engine_make, engine_model, engine_hours, fuel_type, location, description)
VALUES
  ('vsl_amelia',  'brk_alex', 'Amelia',  'Hatteras', 'GT45',  2019, 45.0, 15.0, 4.3, 'Fiberglass', 'Caterpillar', 'C18',     420,  'Diesel', 'Miami, FL',        'Twin Cat C18 express cruiser, lightly used, full electronics refit 2024.'),
  ('vsl_solstice','brk_alex', 'Solstice','Sea Ray',  'Sundancer 400', 2017, 40.0, 13.0, 3.5, 'Fiberglass', 'Mercury', 'Verado 400 Twin', 380, 'Gas',    'Fort Lauderdale, FL', 'Sundancer 400 with joystick docking and bow thruster.'),
  ('vsl_kestrel', 'brk_brit', 'Kestrel', 'Beneteau', 'Oceanis 46.1',  2021, 46.0, 14.6, 7.5, 'Fiberglass', 'Yanmar',  '57 hp',           220, 'Diesel', 'St. Petersburg, FL', 'Oceanis 46.1, in-mast furling, owner''s version, well-equipped for offshore.'),
  ('vsl_halyard', 'brk_brit', 'Halyard', 'Catalina', '385',           2014, 38.5, 13.2, 6.8, 'Fiberglass', 'Yanmar',  '3JH5E',           780, 'Diesel', 'Tampa, FL',          'Catalina 385 with new standing rigging (2024) and updated electronics.');

INSERT OR IGNORE INTO listings (id, broker_id, vessel_id, slug, headline, asking_price, currency, description, status, published_at, syndicate_yachtworld, syndicate_yatco, syndicate_rightboat)
VALUES
  ('lst_amelia',  'brk_alex','vsl_amelia',  'amelia-hatteras-gt45-2019',           'Hatteras GT45, 2019, lightly used',        595000,  'USD', 'Twin Caterpillar C18 power, 420 hours, full electronics refit 2024. Stabilizers, hydraulic swim platform, ready for the Bahamas.', 'published', unixepoch(), 1, 1, 0),
  ('lst_solstice','brk_alex','vsl_solstice','solstice-sea-ray-sundancer-400-2017', 'Sea Ray Sundancer 400, 2017',              325000,  'USD', 'Twin Mercury Verado 400 outboards with joystick docking. Tower, bow thruster, hardtop.', 'published', unixepoch(), 1, 0, 0),
  ('lst_kestrel', 'brk_brit','vsl_kestrel', 'kestrel-beneteau-oceanis-46-1-2021',  'Beneteau Oceanis 46.1, 2021, owner''s version', 419000, 'USD', 'In-mast furling, Yanmar 57 hp diesel, bow thruster, watermaker, generator, full electronics. Bluewater-equipped.', 'published', unixepoch(), 1, 1, 1),
  ('lst_halyard', 'brk_brit','vsl_halyard', 'halyard-catalina-385-2014',           'Catalina 385, 2014, fresh rigging',         149500,  'USD', 'Catalina 385 with new standing rigging in 2024, B&G electronics, dodger and bimini in good shape, ready to cruise.', 'published', unixepoch(), 0, 0, 0);
