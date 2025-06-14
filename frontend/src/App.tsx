import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StoryEditor from './pages/StoryEditor';
import Feedback from './pages/Feedback';
import './App.css';

// App component sets up routing for the app using React Router DOM.
// All pages are accessible for demo purposes (no authentication).
const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/editor" element={<StoryEditor />} />
          <Route path="/story/:id/edit" element={<StoryEditor />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/feedback" element={<Feedback />} />
          {/* Default route: redirect to login if not authenticated, otherwise dashboard */}
          <Route path="*" element={<Login />} /> {/* Default to login if no specific route matches, AuthContext will redirect if logged in */}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
