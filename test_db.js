import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env.local', 'utf-8').split('\n').reduce((acc, line) => {
  const [key, ...value] = line.split('=');
  if (key && value) {
    acc[key.trim()] = value.join('=').trim();
  }
  return acc;
}, {});

// We need an active session to test RLS.
// Since we don't have the user's password, we can't easily sign in.
// Let's just output the env to make sure it's correct.
console.log(env.VITE_SUPABASE_URL);
