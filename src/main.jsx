import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Fonts and icons are bundled with the site, so no third-party requests are needed.
import '@fontsource/source-serif-4/400.css';
import '@fontsource/source-serif-4/400-italic.css';
import '@fontsource/source-serif-4/600.css';
import '@phosphor-icons/web/duotone';
import './styles/broadsheet.css';
import './styles/app.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
