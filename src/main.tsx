import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App.tsx';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CoolCards from './components/CoolCards.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/mtg-pages/" element={<App />} />
        <Route path="/mtg-pages/coolcards" element={<CoolCards />} />
      </Routes>
    </Router>
  </StrictMode>
);
