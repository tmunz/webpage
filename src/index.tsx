

import './variables.styl';
import './index.styl';

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './app/App';


const appElement = document.getElementById('app');
if (appElement) {
  createRoot(appElement).render(
    <StrictMode>
      <script>{`var version = "${process.env.APP_VERSION}"`}</script>
      <Router>
        <App /> 
      </Router>
    </StrictMode>
  );
}

