import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf-8').split('\n').reduce((acc, line) => {
  const [key, ...value] = line.split('=');
  if (key && value) {
    acc[key.trim()] = value.join('=').trim();
  }
  return acc;
}, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('profiles').select('*').eq('email', 'danielwee@gmail.com');
  console.log('Profile data:', data);
  console.log('Error:', error);
}
check();
