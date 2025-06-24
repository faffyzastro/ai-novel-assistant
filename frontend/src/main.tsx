// frontend/src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
// import { AuthProvider } from './context/AuthContext'; // <--- REMOVE THIS IMPORT
import { ToastProvider } from './components/ui/Toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      {/* <AuthProvider>  <--- REMOVE AuthProvider HERE */}
        <ToastProvider>
          <div className="w-full">
            <App /> {/* App now contains AuthProvider */}
          </div>
        </ToastProvider>
      {/* </AuthProvider> <--- REMOVE AuthProvider HERE */}
    </ThemeProvider>
  </React.StrictMode>
);