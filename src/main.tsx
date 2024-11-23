import { StrictMode, useReducer } from 'react';
import { reducer, initialState } from './reducer.ts';
import { createRoot } from 'react-dom/client';
import App from './components/App.tsx';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CoolCards from './components/old/CoolCards.tsx';
import BanPage from './components/BanPage.tsx';

createRoot(document.getElementById('root')!).render(<App />);
