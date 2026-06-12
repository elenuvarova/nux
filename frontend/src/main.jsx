import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/inter';
import '@fontsource-variable/newsreader';
import './styles/tokens.css';
import './styles/global.css';
import App from './App.jsx';
import { AuthProvider } from './lib/useAuth.jsx';
import { CuratorProvider } from './lib/useCurator.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CuratorProvider>
          <App />
        </CuratorProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
