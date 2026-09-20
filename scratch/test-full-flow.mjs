import { createClient } from './frontend/node_modules/@supabase/supabase-js/dist/index.cjs';

const SUPABASE_URL = 'https://dtnauzkkvzgklmafdaqt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0bmF1emtrdnpna2xtYWZkYXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2MzE0NTUsImV4cCI6MjEwNTIwNzQ1NX0.x_AUqEkT4YzNjbnieSvs30oy_Equ6hJzIDN8-wzbUDM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  console.log('--- Testing Supabase Auth ---');
  const testEmail = `artist_${Date.now()}@musify.test`;
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email: testEmail,
    password: 'Password123!',
    options: {
      data: {
        name: 'Supabase Test Artist',
        role: 'ARTIST',
        profile_image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80'
      }
    }
  });

  console.log('Auth registration:', authData?.user ? 'SUCCESS (User ID: ' + authData.user.id + ')' : authErr);

  console.log('\n--- Checking Storage Buckets ---');
  const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
  console.log('Buckets list:', buckets?.map(b => b.name) || [], bErr ? bErr.message : '');

  console.log('\n--- Checking Songs table ---');
  const { data: songs, error: sErr } = await supabase.from('songs').select('*').limit(3);
  console.log('Songs table check:', sErr ? sErr.message : `Found ${songs?.length} songs in Supabase table`);
}

run().catch(console.error);
