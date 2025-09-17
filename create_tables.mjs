
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or key not found in .env.local');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  const schema = `
    create table if not exists requests (
      id uuid primary key default gen_random_uuid(),
      user_id uuid,
      caller_name text not null,
      phone text not null,
      address text not null,
      latitude double precision,
      longitude double precision,
      emergency_description text not null,
      priority text check (priority in ('low','medium','high')) default 'medium',
      status text check (status in ('pending','assigned','dispatched','arrived','completed')) default 'pending',
      created_at timestamptz default now()
    );

    create table if not exists ambulances (
      id uuid primary key default gen_random_uuid(),
      identifier text not null unique,
      status text check (status in ('available','en_route','busy','offline')) default 'available',
      last_lat double precision,
      last_lng double precision,
      last_seen_at timestamptz
    );

    create table if not exists assignments (
      id uuid primary key default gen_random_uuid(),
      request_id uuid references requests(id) on delete cascade,
      ambulance_id uuid references ambulances(id) on delete set null,
      assigned_by uuid,
      dispatched_at timestamptz,
      arrived_at timestamptz,
      completed_at timestamptz,
      notes text
    );

    create table if not exists users (
      id uuid primary key,
      full_name text not null,
      phone text,
      role text check (role in ('user','admin')) not null default 'user',
      occupation text,
      address text,
      dob date,
      blood_group text check (blood_group in ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
      genotype text check (genotype in ('AA','AS','SS','AC','SC')),
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    );
  `;

  const { error } = await supabase.rpc('execute_sql', { sql: schema });

  if (error) {
    console.error('Error creating tables:', error);
  } else {
    console.log('Tables created successfully!');
  }
}

createTables();
