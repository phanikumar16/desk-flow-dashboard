import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nazmlmiscsdnnuczfqtg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hem1sbWlzY3Nkbm51Y3pmcXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NTk5NTcsImV4cCI6MjA2NjQzNTk1N30.ki2wTgc9tC7nVTWaTIbBsK51sFzFNcEIlgkvpPZnjD0';

export const supabase = createClient(supabaseUrl, supabaseKey); 