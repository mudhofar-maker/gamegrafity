import pg from 'pg';

export interface FarmerUserRecord {
  id: number | string;
  google_email: string;
  full_name: string;
  password_hash?: string;
  signup_date: string;
  last_sign_in: string | null;
  last_sign_out: string | null;
  avatar_url?: string;
  role: 'owner' | 'peternak';
}

class AuthDatabase {
  private pool: pg.Pool | null = null;
  private isConnectedToPostgres: boolean = false;
  private availableColumns: Set<string> = new Set();
  private inMemoryUsers: FarmerUserRecord[] = [
    {
      id: 1,
      google_email: 'owner@gamegrafity.farm',
      full_name: 'Mudhofar (Founder & Sovereign Owner)',
      password_hash: 'sovereign2026',
      signup_date: new Date(Date.now() - 86400000 * 14).toISOString(),
      last_sign_in: new Date(Date.now() - 3600000 * 2).toISOString(),
      last_sign_out: null,
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'owner'
    },
    {
      id: 2,
      google_email: 'ahmad.zaidan@gamegrafity.id',
      full_name: 'Ahmad Zaidan',
      password_hash: 'peternak123',
      signup_date: new Date(Date.now() - 86400000 * 5).toISOString(),
      last_sign_in: new Date(Date.now() - 3600000 * 6).toISOString(),
      last_sign_out: new Date(Date.now() - 3600000 * 3).toISOString(),
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'peternak'
    }
  ];

  constructor() {
    this.init();
  }

  private hasColumn(colName: string): boolean {
    return this.availableColumns.has(colName.toLowerCase());
  }

  private async refreshAvailableColumns(client: pg.PoolClient) {
    try {
      const res = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'farmers_users';
      `);
      this.availableColumns = new Set(res.rows.map(r => r.column_name.toLowerCase()));
      console.log('[Auth DB] Detected columns in farmers_users:', Array.from(this.availableColumns).join(', '));
    } catch (e: any) {
      console.warn('[Auth DB] Could not inspect columns:', e?.message || e);
    }
  }

  private async init() {
    const databaseUrl = process.env.DATABASE_URI || process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.log('[Auth DB] DATABASE_URI / DATABASE_URL not set in environment. Running on high-performance local memory store with Neon-compatible schema.');
      return;
    }

    try {
      this.pool = new pg.Pool({
        connectionString: databaseUrl,
        ssl: {
          rejectUnauthorized: false
        },
        connectionTimeoutMillis: 5000
      });

      // Test connection and ensure table exists
      const client = await this.pool.connect();
      try {
        // 1. Ensure table exists with core columns
        await client.query(`
          CREATE TABLE IF NOT EXISTS farmers_users (
            id SERIAL PRIMARY KEY,
            google_email VARCHAR(255) UNIQUE NOT NULL,
            full_name VARCHAR(255) NOT NULL,
            signup_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            last_sign_in TIMESTAMP WITH TIME ZONE,
            last_sign_out TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `);

        // 2. Safe non-destructive migrations to add missing columns (e.g. password_hash, avatar_url, role)
        const safeMigrations = [
          'ALTER TABLE farmers_users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);',
          'ALTER TABLE farmers_users ADD COLUMN IF NOT EXISTS avatar_url TEXT;',
          'ALTER TABLE farmers_users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT \'peternak\';',
          'ALTER TABLE farmers_users ADD COLUMN IF NOT EXISTS signup_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;',
          'ALTER TABLE farmers_users ADD COLUMN IF NOT EXISTS last_sign_in TIMESTAMP WITH TIME ZONE;',
          'ALTER TABLE farmers_users ADD COLUMN IF NOT EXISTS last_sign_out TIMESTAMP WITH TIME ZONE;',
          'ALTER TABLE farmers_users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;'
        ];

        for (const migrationSql of safeMigrations) {
          try {
            await client.query(migrationSql);
          } catch (migErr: any) {
            // Ignore if column already exists or syntax difference in specific Postgres versions
          }
        }

        // 3. Inspect and cache existing columns
        await this.refreshAvailableColumns(client);

        // 4. Seed initial user if table is empty, adapting to present columns
        const check = await client.query('SELECT COUNT(*) FROM farmers_users');
        if (parseInt(check.rows[0].count, 10) === 0) {
          const cols = ['google_email', 'full_name'];
          const vals: any[] = ['owner@gamegrafity.farm', 'Mudhofar (Founder & Sovereign Owner)'];

          if (this.hasColumn('password_hash')) {
            cols.push('password_hash');
            vals.push('sovereign2026');
          }
          if (this.hasColumn('signup_date')) {
            cols.push('signup_date');
            vals.push(new Date());
          }
          if (this.hasColumn('last_sign_in')) {
            cols.push('last_sign_in');
            vals.push(new Date());
          }
          if (this.hasColumn('avatar_url')) {
            cols.push('avatar_url');
            vals.push('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80');
          }
          if (this.hasColumn('role')) {
            cols.push('role');
            vals.push('owner');
          }

          const placeholders = vals.map((_, i) => `$${i + 1}`).join(', ');
          await client.query(
            `INSERT INTO farmers_users (${cols.join(', ')}) VALUES (${placeholders})`,
            vals
          );
        }

        this.isConnectedToPostgres = true;
        console.log('[Auth DB] Successfully connected to PostgreSQL / Neon Database (table: farmers_users).');
      } finally {
        client.release();
      }
    } catch (err: any) {
      console.warn('[Auth DB] PostgreSQL connection error, falling back to persistent in-memory store:', err?.message || err);
      this.isConnectedToPostgres = false;
    }
  }

  public getDatabaseStatus() {
    return {
      connectedToPostgres: this.isConnectedToPostgres,
      databaseType: this.isConnectedToPostgres ? 'Neon PostgreSQL (Live via DATABASE_URI)' : 'Local Memory Store (Neon Schema Emulation)',
      hasDatabaseUrl: Boolean(process.env.DATABASE_URI || process.env.DATABASE_URL),
      targetTable: 'farmers_users',
      availableColumns: Array.from(this.availableColumns)
    };
  }

  // Register / Sign In with Google (Gmail)
  public async handleGoogleAuth(googleEmail: string, fullName: string, avatarUrl?: string): Promise<FarmerUserRecord> {
    const email = googleEmail.toLowerCase().trim();
    const now = new Date().toISOString();

    if (this.isConnectedToPostgres && this.pool) {
      try {
        const cols = ['google_email', 'full_name'];
        const vals: any[] = [email, fullName.trim()];
        const updateSets = ['full_name = EXCLUDED.full_name'];

        if (this.hasColumn('signup_date')) {
          cols.push('signup_date');
          vals.push(new Date());
        }
        if (this.hasColumn('last_sign_in')) {
          cols.push('last_sign_in');
          vals.push(new Date());
          updateSets.push('last_sign_in = NOW()');
        }
        if (this.hasColumn('avatar_url')) {
          cols.push('avatar_url');
          vals.push(avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=ea4335&color=fff`);
          updateSets.push('avatar_url = COALESCE(EXCLUDED.avatar_url, farmers_users.avatar_url)');
        }
        if (this.hasColumn('role')) {
          cols.push('role');
          vals.push(email.includes('uangnyagopar') || email.includes('mudhofar') ? 'owner' : 'peternak');
        }

        const placeholders = vals.map((_, i) => `$${i + 1}`).join(', ');
        const query = `
          INSERT INTO farmers_users (${cols.join(', ')})
          VALUES (${placeholders})
          ON CONFLICT (google_email) 
          DO UPDATE SET ${updateSets.join(', ')}
          RETURNING *;
        `;

        const res = await this.pool.query(query, vals);
        const row = res.rows[0];
        return {
          id: row.id,
          google_email: row.google_email,
          full_name: row.full_name,
          signup_date: row.signup_date ? new Date(row.signup_date).toISOString() : now,
          last_sign_in: row.last_sign_in ? new Date(row.last_sign_in).toISOString() : now,
          last_sign_out: row.last_sign_out ? new Date(row.last_sign_out).toISOString() : null,
          avatar_url: row.avatar_url,
          role: row.role || 'peternak'
        };
      } catch (e: any) {
        console.error('[Auth DB] Error in PostgreSQL handleGoogleAuth, using memory fallback:', e?.message || e);
      }
    }

    // Memory Store fallback
    let user = this.inMemoryUsers.find(u => u.google_email.toLowerCase() === email);
    if (!user) {
      user = {
        id: this.inMemoryUsers.length + 1,
        google_email: email,
        full_name: fullName.trim(),
        signup_date: now,
        last_sign_in: now,
        last_sign_out: null,
        avatar_url: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=ea4335&color=fff`,
        role: email.includes('uangnyagopar') || email.includes('mudhofar') ? 'owner' : 'peternak'
      };
      this.inMemoryUsers.push(user);
    } else {
      user.full_name = fullName.trim() || user.full_name;
      user.last_sign_in = now;
      if (avatarUrl) user.avatar_url = avatarUrl;
    }

    return user;
  }

  // Manual Sign In (Email & Password)
  public async handleManualSignIn(email: string, password?: string): Promise<{ success: boolean; user?: FarmerUserRecord; message?: string }> {
    const cleanEmail = email.toLowerCase().trim();
    const now = new Date().toISOString();

    if (this.isConnectedToPostgres && this.pool) {
      try {
        const check = await this.pool.query('SELECT * FROM farmers_users WHERE LOWER(google_email) = $1', [cleanEmail]);
        if (check.rows.length === 0) {
          // If not found, create new row dynamically with only existing columns
          const cols = ['google_email', 'full_name'];
          const vals: any[] = [cleanEmail, cleanEmail.split('@')[0]];

          if (this.hasColumn('password_hash')) {
            cols.push('password_hash');
            vals.push(password || 'default123');
          }
          if (this.hasColumn('signup_date')) {
            cols.push('signup_date');
            vals.push(new Date());
          }
          if (this.hasColumn('last_sign_in')) {
            cols.push('last_sign_in');
            vals.push(new Date());
          }
          if (this.hasColumn('avatar_url')) {
            cols.push('avatar_url');
            vals.push(`https://ui-avatars.com/api/?name=${encodeURIComponent(cleanEmail.split('@')[0])}&background=0d9488&color=fff`);
          }
          if (this.hasColumn('role')) {
            cols.push('role');
            vals.push(cleanEmail.includes('uangnyagopar') || cleanEmail.includes('mudhofar') ? 'owner' : 'peternak');
          }

          const placeholders = vals.map((_, i) => `$${i + 1}`).join(', ');
          const create = await this.pool.query(
            `INSERT INTO farmers_users (${cols.join(', ')}) VALUES (${placeholders}) RETURNING *;`,
            vals
          );
          const row = create.rows[0];
          return {
            success: true,
            user: {
              id: row.id,
              google_email: row.google_email,
              full_name: row.full_name,
              signup_date: row.signup_date ? new Date(row.signup_date).toISOString() : now,
              last_sign_in: row.last_sign_in ? new Date(row.last_sign_in).toISOString() : now,
              last_sign_out: null,
              avatar_url: row.avatar_url,
              role: row.role || 'peternak'
            }
          };
        }

        // Update last_sign_in if column exists
        const idCol = this.hasColumn('id') ? 'id' : 'user_id';
        const targetId = check.rows[0].id ?? check.rows[0].user_id;

        let updateSql = 'UPDATE farmers_users SET ';
        if (this.hasColumn('last_sign_in')) {
          updateSql += 'last_sign_in = NOW() ';
        } else {
          updateSql += 'full_name = full_name ';
        }
        updateSql += `WHERE ${idCol} = $1 RETURNING *;`;

        const update = await this.pool.query(updateSql, [targetId]);
        const row = update.rows[0];
        return {
          success: true,
          user: {
            id: row.id ?? row.user_id,
            google_email: row.google_email,
            full_name: row.full_name,
            signup_date: row.signup_date ? new Date(row.signup_date).toISOString() : now,
            last_sign_in: row.last_sign_in ? new Date(row.last_sign_in).toISOString() : now,
            last_sign_out: row.last_sign_out ? new Date(row.last_sign_out).toISOString() : null,
            avatar_url: row.avatar_url,
            role: row.role || 'peternak'
          }
        };
      } catch (err: any) {
        console.error('[Auth DB] PostgreSQL sign-in error:', err?.message || err);
      }
    }

    // Memory Store fallback
    let user = this.inMemoryUsers.find(u => u.google_email.toLowerCase() === cleanEmail);
    if (!user) {
      user = {
        id: this.inMemoryUsers.length + 1,
        google_email: cleanEmail,
        full_name: cleanEmail.split('@')[0].replace(/[-_.]/g, ' '),
        password_hash: password || 'default123',
        signup_date: now,
        last_sign_in: now,
        last_sign_out: null,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanEmail.split('@')[0])}&background=0d9488&color=fff`,
        role: cleanEmail.includes('uangnyagopar') || cleanEmail.includes('mudhofar') ? 'owner' : 'peternak'
      };
      this.inMemoryUsers.push(user);
    } else {
      user.last_sign_in = now;
    }

    return { success: true, user };
  }

  // Manual Sign Up (New User Registration)
  public async handleManualSignUp(email: string, fullName: string, password?: string): Promise<{ success: boolean; user?: FarmerUserRecord; message?: string }> {
    const cleanEmail = email.toLowerCase().trim();
    const cleanName = fullName.trim();
    const now = new Date().toISOString();

    if (this.isConnectedToPostgres && this.pool) {
      try {
        const check = await this.pool.query('SELECT * FROM farmers_users WHERE LOWER(google_email) = $1', [cleanEmail]);
        if (check.rows.length > 0) {
          // Already registered, update last_sign_in if column exists
          const idCol = this.hasColumn('id') ? 'id' : 'user_id';
          const targetId = check.rows[0].id ?? check.rows[0].user_id;

          let updateSql = 'UPDATE farmers_users SET full_name = $1 ';
          if (this.hasColumn('last_sign_in')) {
            updateSql += ', last_sign_in = NOW() ';
          }
          updateSql += `WHERE ${idCol} = $2 RETURNING *;`;

          const update = await this.pool.query(updateSql, [cleanName, targetId]);
          const row = update.rows[0];
          return {
            success: true,
            user: {
              id: row.id ?? row.user_id,
              google_email: row.google_email,
              full_name: row.full_name,
              signup_date: row.signup_date ? new Date(row.signup_date).toISOString() : now,
              last_sign_in: row.last_sign_in ? new Date(row.last_sign_in).toISOString() : now,
              last_sign_out: row.last_sign_out ? new Date(row.last_sign_out).toISOString() : null,
              avatar_url: row.avatar_url,
              role: row.role || 'peternak'
            }
          };
        }

        const cols = ['google_email', 'full_name'];
        const vals: any[] = [cleanEmail, cleanName];

        if (this.hasColumn('password_hash')) {
          cols.push('password_hash');
          vals.push(password || 'default123');
        }
        if (this.hasColumn('signup_date')) {
          cols.push('signup_date');
          vals.push(new Date());
        }
        if (this.hasColumn('last_sign_in')) {
          cols.push('last_sign_in');
          vals.push(new Date());
        }
        if (this.hasColumn('avatar_url')) {
          cols.push('avatar_url');
          vals.push(`https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=0284c7&color=fff`);
        }
        if (this.hasColumn('role')) {
          cols.push('role');
          vals.push(cleanEmail.includes('uangnyagopar') || cleanEmail.includes('mudhofar') ? 'owner' : 'peternak');
        }

        const placeholders = vals.map((_, i) => `$${i + 1}`).join(', ');
        const insert = await this.pool.query(
          `INSERT INTO farmers_users (${cols.join(', ')}) VALUES (${placeholders}) RETURNING *;`,
          vals
        );
        const row = insert.rows[0];
        return {
          success: true,
          user: {
            id: row.id,
            google_email: row.google_email,
            full_name: row.full_name,
            signup_date: row.signup_date ? new Date(row.signup_date).toISOString() : now,
            last_sign_in: row.last_sign_in ? new Date(row.last_sign_in).toISOString() : now,
            last_sign_out: null,
            avatar_url: row.avatar_url,
            role: row.role || 'peternak'
          }
        };
      } catch (err: any) {
        console.error('[Auth DB] PostgreSQL sign-up error:', err?.message || err);
      }
    }

    // Memory Store fallback
    let existing = this.inMemoryUsers.find(u => u.google_email.toLowerCase() === cleanEmail);
    if (existing) {
      existing.full_name = cleanName;
      existing.last_sign_in = now;
      return { success: true, user: existing };
    }

    const newUser: FarmerUserRecord = {
      id: this.inMemoryUsers.length + 1,
      google_email: cleanEmail,
      full_name: cleanName,
      password_hash: password || 'default123',
      signup_date: now,
      last_sign_in: now,
      last_sign_out: null,
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=0284c7&color=fff`,
      role: cleanEmail.includes('uangnyagopar') || cleanEmail.includes('mudhofar') ? 'owner' : 'peternak'
    };
    this.inMemoryUsers.push(newUser);
    return { success: true, user: newUser };
  }

  // Handle Sign Out: Updates last_sign_out column
  public async handleSignOut(email: string): Promise<boolean> {
    const cleanEmail = email.toLowerCase().trim();
    const now = new Date().toISOString();

    if (this.isConnectedToPostgres && this.pool) {
      try {
        if (this.hasColumn('last_sign_out')) {
          await this.pool.query(`
            UPDATE farmers_users 
            SET last_sign_out = NOW() 
            WHERE LOWER(google_email) = $1;
          `, [cleanEmail]);
        }
        return true;
      } catch (err: any) {
        console.error('[Auth DB] PostgreSQL sign-out update error:', err?.message || err);
      }
    }

    const user = this.inMemoryUsers.find(u => u.google_email.toLowerCase() === cleanEmail);
    if (user) {
      user.last_sign_out = now;
      return true;
    }
    return false;
  }

  // List all users in farmers_users
  public async getAllUsers(): Promise<FarmerUserRecord[]> {
    if (this.isConnectedToPostgres && this.pool) {
      try {
        const orderCol = this.hasColumn('signup_date')
          ? 'signup_date'
          : (this.hasColumn('id') ? 'id' : (this.hasColumn('user_id') ? 'user_id' : 'google_email'));

        const res = await this.pool.query(`SELECT * FROM farmers_users ORDER BY ${orderCol} DESC`);
        return res.rows.map(row => ({
          id: row.id ?? row.user_id ?? 1,
          google_email: row.google_email,
          full_name: row.full_name,
          signup_date: row.signup_date ? new Date(row.signup_date).toISOString() : new Date().toISOString(),
          last_sign_in: row.last_sign_in ? new Date(row.last_sign_in).toISOString() : null,
          last_sign_out: row.last_sign_out ? new Date(row.last_sign_out).toISOString() : null,
          avatar_url: row.avatar_url,
          role: row.role || 'peternak'
        }));
      } catch (err: any) {
        console.error('[Auth DB] Error fetching all users:', err?.message || err);
      }
    }

    return this.inMemoryUsers;
  }
}

export const authDb = new AuthDatabase();
