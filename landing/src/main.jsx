import '@fontsource-variable/fraunces';
import '@fontsource-variable/inter';
import '@fontsource-variable/newsreader';
import './styles/tokens.css';
import './styles/landing.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);
