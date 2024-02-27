import React from 'react';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App';
import { createRoot } from 'react-dom/client'; // Import createRoot from ReactDOM

// Use createRoot method to render the root component
const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
