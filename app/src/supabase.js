import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

// Same project, same publishable key and same tables as the web shop.
export const SUPABASE_URL = 'https://xmxwbcemtzntkgueiwon.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_hDBXSfLHICtZ_QQVX63pFA_DxbItYED';
export const WEB_ORIGIN = 'https://basira-provisions.pages.dev';
export const AUTH_REDIRECT = 'basira://auth/callback';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
});

// Keep the session fresh while the app is in the foreground.
AppState.addEventListener('change', (state) => {
  if (state === 'active') supabase.auth.startAutoRefresh();
  else supabase.auth.stopAutoRefresh();
});
