import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AsterSkApp from './components/AsterSkApp';

// Performance monitoring (optional)
if (process.env.NODE_ENV === 'production') {
  // Add performance monitoring here if needed
  // Example: import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AsterSkApp />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
