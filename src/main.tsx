// Core React imports for rendering the application
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

// Main application component and global styles
import App from './App.tsx';
import './index.css';

// Mount the React application to the root DOM element with StrictMode enabled
// StrictMode highlights potential problems in the application during development
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
