import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Standalone marketing landing — deploys independently of the app (own Coolify
// app / subdomain). Shares the app's design tokens (src/styles/tokens.css copied
// verbatim) so it matches nux.ontwrpn.com exactly.
export default defineConfig({
  plugins: [react()],
});
