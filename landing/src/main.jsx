import './styles/fonts.css';
import './styles/tokens.css';
import './styles/landing.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { initAnalytics, track } from './lib/analytics.js';

// Microsoft Clarity — same project as the app, so the landing and product share
// one funnel. landing_view is the entry beacon for the marketing page.
initAnalytics();
track('landing_view');

createRoot(document.getElementById('root')).render(<App />);
