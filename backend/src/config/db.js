// This file sets up ONE shared connection to the PostgreSQL database.
// Every other file that needs to talk to the database imports "pool" from here,
// instead of each opening its own separate connection.

import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Most hosted Postgres providers (Render, Railway, Neon, Supabase) require SSL.
  // If you're running Postgres on your own machine locally, you can remove this.
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// This function makes sure the tables we need actually exist.
// It's safe to run every time the server starts - "IF NOT EXISTS" means
// it won't wipe out data that's already there.
export const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS prayer_requests (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      request TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ministries (
      id SERIAL PRIMARY KEY,
      name_en TEXT NOT NULL DEFAULT '',
      description_en TEXT NOT NULL DEFAULT '',
      name_fr TEXT NOT NULL DEFAULT '',
      description_fr TEXT NOT NULL DEFAULT '',
      name_sw TEXT NOT NULL DEFAULT '',
      description_sw TEXT NOT NULL DEFAULT '',
      leader_name TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  // Covers ministries tables created before this column existed.
  await pool.query(`ALTER TABLE ministries ADD COLUMN IF NOT EXISTS leader_name TEXT DEFAULT ''`);
  // Lets a ministry be created/edited one language at a time - the other
  // two language columns fall back to '' instead of requiring a value.
  await pool.query(`
    ALTER TABLE ministries
      ALTER COLUMN name_en SET DEFAULT '',
      ALTER COLUMN description_en SET DEFAULT '',
      ALTER COLUMN name_fr SET DEFAULT '',
      ALTER COLUMN description_fr SET DEFAULT '',
      ALTER COLUMN name_sw SET DEFAULT '',
      ALTER COLUMN description_sw SET DEFAULT ''
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ministry_members (
      id SERIAL PRIMARY KEY,
      ministry_id INTEGER NOT NULL REFERENCES ministries(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ministry_activities (
      id SERIAL PRIMARY KEY,
      ministry_id INTEGER NOT NULL REFERENCES ministries(id) ON DELETE CASCADE,
      description TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ministry_plans (
      id SERIAL PRIMARY KEY,
      ministry_id INTEGER NOT NULL REFERENCES ministries(id) ON DELETE CASCADE,
      description TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // --- Ministry committee, services, and service attendance - applies
  // to every ministry via its ministry_id ---

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ministry_committee (
      id SERIAL PRIMARY KEY,
      ministry_id INTEGER NOT NULL REFERENCES ministries(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      role TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ministry_services (
      id SERIAL PRIMARY KEY,
      ministry_id INTEGER NOT NULL REFERENCES ministries(id) ON DELETE CASCADE,
      service_date DATE NOT NULL,
      notes TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Attendance links back to the ministry's own "members" roster (the
  // same list managed in the Members section), so attendance is always
  // marked against someone already listed as part of the ministry.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ministry_service_attendance (
      id SERIAL PRIMARY KEY,
      service_id INTEGER NOT NULL REFERENCES ministry_services(id) ON DELETE CASCADE,
      ministry_member_id INTEGER NOT NULL REFERENCES ministry_members(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // --- Migration for anyone whose ministry_service_attendance table
  // already existed before the ministry_member_id column was added to it.
  const hasMinistryMemberIdColumn = await pool.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'ministry_service_attendance' AND column_name = 'ministry_member_id'
  `);
  if (hasMinistryMemberIdColumn.rows.length === 0) {
    console.log("Adding missing ministry_member_id column to ministry_service_attendance...");
    await pool.query(`
      ALTER TABLE ministry_service_attendance
      ADD COLUMN ministry_member_id INTEGER REFERENCES ministry_members(id) ON DELETE CASCADE
    `);
  }

  // Clean-up: an earlier fix mistakenly added a "member_id" column (wrong
  // name) alongside the real "ministry_member_id" column. Remove it if present.
  await pool.query(`ALTER TABLE ministry_service_attendance DROP COLUMN IF EXISTS member_id`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS gallery_images (
      id SERIAL PRIMARY KEY,
      image_url TEXT NOT NULL,
      caption_en TEXT DEFAULT '',
      caption_fr TEXT DEFAULT '',
      caption_sw TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS sermons (
      id SERIAL PRIMARY KEY,
      title_en TEXT NOT NULL,
      title_fr TEXT NOT NULL,
      title_sw TEXT NOT NULL,
      speaker TEXT NOT NULL,
      description_en TEXT DEFAULT '',
      description_fr TEXT DEFAULT '',
      description_sw TEXT DEFAULT '',
      sermon_date DATE,
      file_url TEXT NOT NULL,
      file_type TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // --- Migration for anyone who already ran the OLD single-language
  // version of this table (just "title" and "description" columns).
  const oldSermonsColumn = await pool.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'sermons' AND column_name = 'title'
  `);

  if (oldSermonsColumn.rows.length > 0) {
    console.log("Upgrading sermons table for multi-language support...");

    await pool.query(`ALTER TABLE sermons ADD COLUMN IF NOT EXISTS title_en TEXT`);
    await pool.query(`ALTER TABLE sermons ADD COLUMN IF NOT EXISTS title_fr TEXT`);
    await pool.query(`ALTER TABLE sermons ADD COLUMN IF NOT EXISTS title_sw TEXT`);
    await pool.query(`ALTER TABLE sermons ADD COLUMN IF NOT EXISTS description_en TEXT`);
    await pool.query(`ALTER TABLE sermons ADD COLUMN IF NOT EXISTS description_fr TEXT`);
    await pool.query(`ALTER TABLE sermons ADD COLUMN IF NOT EXISTS description_sw TEXT`);

    // Copy the old single-language text into the "en" columns, and use
    // the same text as a placeholder for fr/sw so nothing is blank -
    // you'll want to edit these sermons afterward to add real translations.
    await pool.query(`
      UPDATE sermons SET
        title_en = title, title_fr = title, title_sw = title,
        description_en = description, description_fr = description, description_sw = description
      WHERE title_en IS NULL
    `);

    await pool.query(`ALTER TABLE sermons DROP COLUMN IF EXISTS title`);
    await pool.query(`ALTER TABLE sermons DROP COLUMN IF EXISTS description`);

    console.log("Sermons table upgraded.");
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS members (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      whatsapp TEXT DEFAULT '',
      email TEXT DEFAULT '',
      address TEXT DEFAULT '',
      status TEXT DEFAULT '',
      testimony TEXT DEFAULT '',
      life_story TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  // Covers anyone who already had the "members" table from before these
  // columns existed - adds them in place without touching existing rows.
  await pool.query(`ALTER TABLE members ADD COLUMN IF NOT EXISTS status TEXT DEFAULT ''`);
  await pool.query(`ALTER TABLE members ADD COLUMN IF NOT EXISTS testimony TEXT DEFAULT ''`);
  await pool.query(`ALTER TABLE members ADD COLUMN IF NOT EXISTS life_story TEXT DEFAULT ''`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS communion_sessions (
      id SERIAL PRIMARY KEY,
      session_date DATE NOT NULL,
      notes TEXT DEFAULT '',
      verse_read TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // --- Migration for anyone who already had this table without the
  // verse_read column (added after the table was first created).
  await pool.query(`ALTER TABLE communion_sessions ADD COLUMN IF NOT EXISTS verse_read TEXT DEFAULT ''`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS communion_attendance (
      id SERIAL PRIMARY KEY,
      session_id INTEGER NOT NULL REFERENCES communion_sessions(id) ON DELETE CASCADE,
      member_name TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS choir_members (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      whatsapp TEXT DEFAULT '',
      group_name TEXT NOT NULL DEFAULT 'central',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query(`ALTER TABLE choir_members ADD COLUMN IF NOT EXISTS group_name TEXT NOT NULL DEFAULT 'central'`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS choir_practice_sessions (
      id SERIAL PRIMARY KEY,
      session_date DATE NOT NULL,
      notes TEXT DEFAULT '',
      group_name TEXT NOT NULL DEFAULT 'central',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query(`ALTER TABLE choir_practice_sessions ADD COLUMN IF NOT EXISTS group_name TEXT NOT NULL DEFAULT 'central'`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS choir_attendance (
      id SERIAL PRIMARY KEY,
      session_id INTEGER NOT NULL REFERENCES choir_practice_sessions(id) ON DELETE CASCADE,
      choir_member_id INTEGER NOT NULL REFERENCES choir_members(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // The list of choirs itself used to be a fixed list of 3 in the code.
  // It's now a real table, so a new choir can be added from the admin
  // page instead of needing a code change. "slug" is the plain-text
  // identifier stored on each member/session's existing group_name
  // column, so this stays fully compatible with data already saved
  // under the old hardcoded "central" / "youth" / "children" system.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS choir_groups (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name_en TEXT NOT NULL,
      name_fr TEXT NOT NULL,
      name_sw TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  const { rows: choirGroupCount } = await pool.query("SELECT COUNT(*) FROM choir_groups");
  if (parseInt(choirGroupCount[0].count, 10) === 0) {
    await pool.query(`
      INSERT INTO choir_groups (slug, name_en, name_fr, name_sw) VALUES
      ('central', 'Central Choir', 'Chorale Centrale', 'Kwaya Kuu'),
      ('youth', 'Youth Choir', 'Chorale des Jeunes', 'Kwaya ya Vijana'),
      ('children', 'Children''s Choir', 'Chorale des Enfants', 'Kwaya ya Watoto')
    `);
    console.log("Seeded default choir groups.");
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tithes (
      id SERIAL PRIMARY KEY,
      member_name TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      payment_date DATE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // --- Church Elders' Council (Baraza / Comité des Anciens) ---

  await pool.query(`
    CREATE TABLE IF NOT EXISTS elders (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      whatsapp TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS elder_meetings (
      id SERIAL PRIMARY KEY,
      meeting_date DATE NOT NULL,
      notes TEXT DEFAULT '',
      minutes TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  // Covers elder_meetings tables created before this column existed.
  await pool.query(`ALTER TABLE elder_meetings ADD COLUMN IF NOT EXISTS minutes TEXT DEFAULT ''`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS elder_meeting_attendance (
      id SERIAL PRIMARY KEY,
      meeting_id INTEGER NOT NULL REFERENCES elder_meetings(id) ON DELETE CASCADE,
      elder_id INTEGER NOT NULL REFERENCES elders(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS elder_plans (
      id SERIAL PRIMARY KEY,
      description TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // --- Finance / Caisse: every entrance (income) and exit (expense) of money ---

  await pool.query(`
    CREATE TABLE IF NOT EXISTS finance_transactions (
      id SERIAL PRIMARY KEY,
      type TEXT NOT NULL CHECK (type IN ('in', 'out')),
      amount NUMERIC NOT NULL,
      description TEXT DEFAULT '',
      transaction_date DATE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // --- Baptism Register (Kitabu cha Ubatizo / Registre de Baptême) ---

  await pool.query(`
    CREATE TABLE IF NOT EXISTS baptisms (
      id SERIAL PRIMARY KEY,
      member_name TEXT NOT NULL,
      method TEXT DEFAULT '',
      baptism_date DATE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // --- Contributions: who contributed, what kind, how much, and when ---

  await pool.query(`
    CREATE TABLE IF NOT EXISTS contributions (
      id SERIAL PRIMARY KEY,
      contributor_name TEXT NOT NULL,
      kind TEXT DEFAULT '',
      amount NUMERIC NOT NULL,
      contribution_date DATE NOT NULL,
      fulfilled BOOLEAN DEFAULT FALSE,
      fulfilled_date DATE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`ALTER TABLE contributions ADD COLUMN IF NOT EXISTS project_id INTEGER`);

  // Migration for existing contribution records. Old contribution
  // records are treated as already given so the new status feature
  // does not incorrectly mark historical records as unpaid.
  const contributionFulfilledColumn = await pool.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'contributions'
      AND column_name = 'fulfilled'
  `);

  if (contributionFulfilledColumn.rows.length === 0) {
    await pool.query(`
      ALTER TABLE contributions
      ADD COLUMN fulfilled BOOLEAN DEFAULT TRUE
    `);
    await pool.query(`
      ALTER TABLE contributions
      ADD COLUMN fulfilled_date DATE
    `);
  } else {
    await pool.query(`
      ALTER TABLE contributions
      ADD COLUMN IF NOT EXISTS fulfilled_date DATE
    `);
  }

  // New contribution records start as not yet given.
  await pool.query(`
    ALTER TABLE contributions
    ALTER COLUMN fulfilled SET DEFAULT FALSE
  `);

  // --- Projects (e.g. "Church Building Project") that pledges can be
  // raised toward, each with a fundraising goal.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contribution_projects (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      goal_amount NUMERIC DEFAULT 0,
      project_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`ALTER TABLE contribution_projects ADD COLUMN IF NOT EXISTS project_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER`);
  await pool.query(`ALTER TABLE contributions ADD COLUMN IF NOT EXISTS project_id INTEGER REFERENCES contribution_projects(id) ON DELETE SET NULL`);

  // --- Pledges: a promise from someone to give a certain amount
  // (optionally toward a specific project), which starts as
  // unfulfilled and gets ticked once the money actually comes in.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pledges (
      id SERIAL PRIMARY KEY,
      contributor_name TEXT NOT NULL,
      project_id INTEGER REFERENCES contribution_projects(id) ON DELETE SET NULL,
      amount NUMERIC NOT NULL,
      pledge_date DATE,
      fulfilled BOOLEAN DEFAULT FALSE,
      fulfilled_date DATE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // --- Migration for anyone who already ran the OLD single-language
  // version of this table (just "name" and "description" columns).
  // We check if that old column still exists, and if so, upgrade the
  // table in place instead of losing your existing data.
  const oldColumn = await pool.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'ministries' AND column_name = 'name'
  `);

  if (oldColumn.rows.length > 0) {
    console.log("Upgrading ministries table for multi-language support...");

    await pool.query(`ALTER TABLE ministries ADD COLUMN IF NOT EXISTS name_en TEXT`);
    await pool.query(`ALTER TABLE ministries ADD COLUMN IF NOT EXISTS description_en TEXT`);
    await pool.query(`ALTER TABLE ministries ADD COLUMN IF NOT EXISTS name_fr TEXT`);
    await pool.query(`ALTER TABLE ministries ADD COLUMN IF NOT EXISTS description_fr TEXT`);
    await pool.query(`ALTER TABLE ministries ADD COLUMN IF NOT EXISTS name_sw TEXT`);
    await pool.query(`ALTER TABLE ministries ADD COLUMN IF NOT EXISTS description_sw TEXT`);

    // Copy the old single-language text into the "en" columns so nothing is lost.
    await pool.query(`
      UPDATE ministries SET name_en = name, description_en = description
      WHERE name_en IS NULL
    `);

    // Fill in French/Swahili for the 6 starter ministries specifically
    // (anything you added yourself will just show English until you
    // edit it in the admin page and add the other languages).
    const translations = [
      ["Children's Ministry", "Ministère des Enfants", "Nourrir les jeunes cœurs de vérité biblique à travers chants, histoires et jeux.", "Huduma ya Watoto", "Kulea mioyo michanga kwa kweli za Kibiblia kupitia nyimbo, hadithi na michezo."],
      ["Youth Ministry", "Ministère de la Jeunesse", "Équiper les adolescents et jeunes adultes à marcher avec audace avec Christ.", "Huduma ya Vijana", "Kuwawezesha vijana kutembea kwa ujasiri pamoja na Kristo."],
      ["Women's Fellowship", "Communion des Femmes", "Une sororité de prière, de discipulat et de soutien mutuel.", "Ushirika wa Wanawake", "Undugu wa maombi, ufundishaji, na msaada wa pamoja."],
      ["Men's Fellowship", "Communion des Hommes", "Former des hommes d'intégrité, de foi et de leadership pieux.", "Ushirika wa Wanaume", "Kujenga wanaume wenye uadilifu, imani, na uongozi wa kimungu."],
      ["Choir & Worship", "Chorale et Louange", "Conduire la congrégation dans une louange et une adoration sincères.", "Kwaya na Ibada", "Kuongoza kutaniko katika sifa na ibada ya moyoni."],
      ["Outreach & Missions", "Évangélisation et Missions", "Partager l'amour de Christ par le service dans notre communauté et au-delà.", "Uinjilisti na Utume", "Kushiriki upendo wa Kristo kwa huduma katika jamii yetu na kwingineko."],
    ];

    for (const [nameEn, nameFr, descFr, nameSw, descSw] of translations) {
      await pool.query(
        `UPDATE ministries
         SET name_fr = $2, description_fr = $3, name_sw = $4, description_sw = $5
         WHERE name_en = $1 AND name_fr IS NULL`,
        [nameEn, nameFr, descFr, nameSw, descSw]
      );
    }

    // Anything still missing fr/sw (a ministry you added yourself, for
    // example) just falls back to a copy of the English text for now.
    await pool.query(`
      UPDATE ministries SET name_fr = name_en WHERE name_fr IS NULL;
      UPDATE ministries SET description_fr = description_en WHERE description_fr IS NULL;
      UPDATE ministries SET name_sw = name_en WHERE name_sw IS NULL;
      UPDATE ministries SET description_sw = description_en WHERE description_sw IS NULL;
    `);

    await pool.query(`ALTER TABLE ministries DROP COLUMN IF EXISTS name`);
    await pool.query(`ALTER TABLE ministries DROP COLUMN IF EXISTS description`);

    console.log("Ministries table upgraded.");
  }

  // Seed the ministries table with starter content, but ONLY if it's
  // completely empty - this runs every time the server starts, so we
  // don't want to re-add these every single time.
  const { rows } = await pool.query("SELECT COUNT(*) FROM ministries");
  if (parseInt(rows[0].count, 10) === 0) {
    await pool.query(`
      INSERT INTO ministries (name_en, description_en, name_fr, description_fr, name_sw, description_sw, sort_order) VALUES
      ('Children''s Ministry', 'Nurturing young hearts with biblical truth through songs, stories, and play.', 'Ministère des Enfants', 'Nourrir les jeunes cœurs de vérité biblique à travers chants, histoires et jeux.', 'Huduma ya Watoto', 'Kulea mioyo michanga kwa kweli za Kibiblia kupitia nyimbo, hadithi na michezo.', 1),
      ('Youth Ministry', 'Equipping teenagers and young adults to walk boldly with Christ.', 'Ministère de la Jeunesse', 'Équiper les adolescents et jeunes adultes à marcher avec audace avec Christ.', 'Huduma ya Vijana', 'Kuwawezesha vijana kutembea kwa ujasiri pamoja na Kristo.', 2),
      ('Women''s Fellowship', 'A sisterhood of prayer, discipleship, and mutual support.', 'Communion des Femmes', 'Une sororité de prière, de discipulat et de soutien mutuel.', 'Ushirika wa Wanawake', 'Undugu wa maombi, ufundishaji, na msaada wa pamoja.', 3),
      ('Men''s Fellowship', 'Building men of integrity, faith, and godly leadership.', 'Communion des Hommes', 'Former des hommes d''intégrité, de foi et de leadership pieux.', 'Ushirika wa Wanaume', 'Kujenga wanaume wenye uadilifu, imani, na uongozi wa kimungu.', 4),
      ('Choir & Worship', 'Leading the congregation in heartfelt praise and worship.', 'Chorale et Louange', 'Conduire la congrégation dans une louange et une adoration sincères.', 'Kwaya na Ibada', 'Kuongoza kutaniko katika sifa na ibada ya moyoni.', 5),
      ('Outreach & Missions', 'Sharing Christ''s love through service in our community and beyond.', 'Évangélisation et Missions', 'Partager l''amour de Christ par le service dans notre communauté et au-delà.', 'Uinjilisti na Utume', 'Kushiriki upendo wa Kristo kwa huduma katika jamii yetu na kwingineko.', 6)
    `);
    console.log("Seeded default ministries.");
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title_en TEXT NOT NULL,
      title_fr TEXT DEFAULT '',
      title_sw TEXT DEFAULT '',
      description_en TEXT DEFAULT '',
      description_fr TEXT DEFAULT '',
      description_sw TEXT DEFAULT '',
      location_en TEXT DEFAULT '',
      location_fr TEXT DEFAULT '',
      location_sw TEXT DEFAULT '',
      event_date DATE,
      event_time TEXT DEFAULT '',
      image_url TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  // Covers events tables created before this column existed.
  await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT ''`);

  console.log("Database tables ready.");
};
