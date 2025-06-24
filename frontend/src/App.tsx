// frontend/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StoryEditor from './pages/StoryEditor';
import Feedback from './pages/Feedback';
import './App.css';

import { AuthProvider } from './context/AuthContext'; // <--- IMPORT AuthProvider here

const App: React.FC = () => {
  return (
    <Router> {/* The Router component provides the routing context */}
      <AuthProvider> {/* <--- AuthProvider is now INSIDE the Router context */}
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/editor" element={<StoryEditor />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
};

export default App;