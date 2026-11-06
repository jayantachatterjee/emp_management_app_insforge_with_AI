import { createClient } from '@insforge/sdk';

const baseUrl = import.meta.env.VITE_INSFORGE_BASE_URL;
const anonKey = import.meta.env.VITE_INSFORGE_ANON_KEY;

if (!baseUrl) {
  console.warn('VITE_INSFORGE_BASE_URL is not defined in environment variables.');
}

export const insforge = createClient({
  baseUrl: baseUrl || 'https://nyst562j.us-east.insforge.app',
  anonKey: anonKey || '',
});
