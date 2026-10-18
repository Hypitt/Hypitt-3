import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase (Vercel & local development)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Supabase client instance
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Database Schema Reference for Supabase:
 *
 * CREATE TABLE profiles (
 *   id UUID PRIMARY KEY REFERENCES auth.users(id),
 *   name TEXT NOT NULL,
 *   handle TEXT UNIQUE NOT NULL,
 *   avatar TEXT,
 *   generation TEXT,
 *   status TEXT,
 *   bio TEXT,
 *   coins INT DEFAULT 150,
 *   voting_coins INT DEFAULT 100,
 *   creator_reward_coins INT DEFAULT 50,
 *   followers_count INT DEFAULT 0,
 *   following_count INT DEFAULT 0,
 *   battles_won INT DEFAULT 0,
 *   battles_lost INT DEFAULT 0,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * CREATE TABLE competitions (
 *   id TEXT PRIMARY KEY,
 *   title TEXT NOT NULL,
 *   category TEXT NOT NULL,
 *   mode TEXT NOT NULL,
 *   host_id TEXT NOT NULL,
 *   host_name TEXT NOT NULL,
 *   host_handle TEXT NOT NULL,
 *   is_host_competitor BOOLEAN DEFAULT FALSE,
 *   voting_rule TEXT NOT NULL,
 *   judge_selection_mode TEXT NOT NULL,
 *   status TEXT DEFAULT 'live',
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * CREATE TABLE posts (
 *   id TEXT PRIMARY KEY,
 *   author_handle TEXT NOT NULL,
 *   author_name TEXT NOT NULL,
 *   title TEXT NOT NULL,
 *   description TEXT,
 *   type TEXT NOT NULL,
 *   category TEXT NOT NULL,
 *   file_url TEXT,
 *   download_type TEXT DEFAULT 'free',
 *   download_coins INT DEFAULT 0,
 *   likes_count INT DEFAULT 0,
 *   comments_count INT DEFAULT 0,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * CREATE TABLE direct_messages (
 *   id TEXT PRIMARY KEY,
 *   conversation_id TEXT NOT NULL,
 *   sender_handle TEXT NOT NULL,
 *   text TEXT NOT NULL,
 *   reply_to_id TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 */

export async function getSupabaseSession() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (err) {
    console.warn('Supabase getSession notice:', err);
    return null;
  }
}

export async function signInWithGoogleOAuth() {
  if (!supabase) {
    console.info('Supabase not configured, using local mock Google auth');
    return { error: null, provider: 'google' };
  }
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
}
