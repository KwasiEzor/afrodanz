/**
 * Creates an admin user in Supabase Auth + Prisma database.
 *
 * Usage:  npx tsx scripts/seed-admin.ts
 *
 * Required env vars (loaded from .env automatically):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   DATABASE_URL
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const ADMIN_EMAIL = 'admin@afrodanz.com';
const ADMIN_PASSWORD = 'AfroDanz2026!';
const ADMIN_NAME = 'Admin AfroDanz';

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;
  const databaseUrl = process.env.DATABASE_URL;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  if (!databaseUrl) {
    console.error('Missing DATABASE_URL');
    process.exit(1);
  }

  // --- Supabase Admin client ---
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`Creating Supabase user: ${ADMIN_EMAIL}`);

  // Check if user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users.find((u) => u.email === ADMIN_EMAIL);

  let supabaseUserId: string;

  if (existing) {
    console.log('Supabase user already exists, updating...');
    const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { name: ADMIN_NAME },
    });
    if (error) {
      console.error('Failed to update Supabase user:', error.message);
      process.exit(1);
    }
    supabaseUserId = data.user.id;
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { name: ADMIN_NAME },
    });
    if (error) {
      console.error('Failed to create Supabase user:', error.message);
      process.exit(1);
    }
    supabaseUserId = data.user.id;
  }

  console.log(`Supabase user ready: ${supabaseUserId}`);

  // --- Prisma ---
  const pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool as unknown as ConstructorParameters<typeof PrismaPg>[0]);
  const prisma = new PrismaClient({ adapter });

  const user = await prisma.user.upsert({
    where: { supabaseUserId },
    update: {
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
    create: {
      supabaseUserId,
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  console.log(`Prisma admin user ready: ${user.id} (role: ${user.role})`);
  console.log('\n--- Admin credentials ---');
  console.log(`Email:    ${ADMIN_EMAIL}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
  console.log('-------------------------\n');

  await prisma.$disconnect();
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
