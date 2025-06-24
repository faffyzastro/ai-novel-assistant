import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { NavLink, useLocation } from 'react-router-dom';
import { FiMenu, FiHome, FiEdit, FiUser, FiLogOut, FiBell, FiSettings, FiPlus } from 'react-icons/fi';

const navLinks = [
  { name: 'Dashboard', icon: FiHome, to: '/dashboard' },
  { name: 'Story Editor', icon: FiEdit, to: '/editor' },
  { name: 'Login', icon: FiUser, to: '/login' },
  { name: 'Register', icon: FiSettings, to: '/register' },
  { name: 'Feedback', icon: FiBell, to: '/feedback' },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';
  const [showWelcome, setShowWelcome] = useState(
    () => isDashboard && sessionStorage.getItem('ai-novel-welcome') !== 'dismissed'
  );

  return (
    <div className="w-screen min-h-screen flex flex-col bg-gradient-to-br from-[#1a2236] via-[#232946] to-[#121826] dark:from-[#181c2a] dark:via-[#232946] dark:to-[#121826] transition-all duration-300">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 w-screen flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-[#232946]/80 backdrop-blur-md shadow-lg border-b border-blue-100 dark:border-blue-900 transition-all duration-300">
        <div className="flex items-center gap-3">
          {/* Hamburger for mobile */}
          <button
            className="md:hidden mr-2 p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent bg-blue-700/80 dark:bg-blue-800/80 text-white shadow"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <FiMenu size={24} />
          </button>
          <h1 className="text-xl font-bold font-heading tracking-tight text-[#232946] dark:text-white">AI Novel Assistant</h1>
          <span className="ml-2 px-2 py-1 text-xs rounded-xl font-semibold bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow">Beta</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button
            className="relative w-10 h-10 flex items-center justify-center rounded-full border-2 border-blue-200 dark:border-blue-800 bg-white/70 dark:bg-blue-900/70 hover:bg-blue-100 dark:hover:bg-blue-800 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent shadow"
            aria-label="Notifications"
            onClick={() => setNotificationsOpen((o) => !o)}
          >
            <FiBell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />
          </button>
          {/* Profile dropdown */}
          <div className="relative">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-orange-400 to-pink-500 text-white shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Profile menu"
              onClick={() => setProfileOpen((o) => !o)}
            >
              <FiUser size={20} />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-blue-950 border border-blue-100 dark:border-blue-800 rounded-xl shadow-xl z-50 animate-fadeIn">
                <a href="#" className="flex items-center gap-2 px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900 transition-all rounded-xl"><FiUser size={20} /> Profile</a>
                <a href="#" className="flex items-center gap-2 px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900 transition-all rounded-xl"><FiSettings size={20} /> Settings</a>
                <button className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900 transition-all rounded-xl"><FiLogOut size={20} /> Logout</button>
              </div>
            )}
          </div>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-blue-200 dark:border-blue-800 bg-white/70 dark:bg-blue-900/70 hover:bg-blue-100 dark:hover:bg-blue-800 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent shadow"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
        </div>
      </header>

      {/* Sidebar for desktop and mobile drawer */}
      <div className="flex flex-1 w-screen">
        {/* Desktop sidebar */}
        <aside className={`hidden md:flex flex-col h-[calc(100vh-72px)] sticky top-[72px] z-20 ${sidebarCollapsed ? 'w-20' : 'w-60'} border-r border-blue-100 dark:border-blue-900 bg-white/80 dark:bg-[#232946]/80 backdrop-blur-lg shadow-2xl transition-all duration-300`}> 
          <button
            className="mt-6 mb-2 mx-auto p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 shadow"
            onClick={() => setSidebarCollapsed((c) => !c)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <FiMenu size={24} />
          </button>
          <nav className="flex flex-col gap-2 mt-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.to}
                  className={({ isActive }: { isActive: boolean }) =>
                    `flex items-center gap-3 px-5 py-3 rounded-xl font-medium hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900 dark:hover:to-blue-800 transition-all duration-200 group ${sidebarCollapsed ? 'justify-center px-2' : ''} ${isActive ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg dark:from-blue-700 dark:to-blue-500' : 'text-blue-900 dark:text-blue-100'}`
                  }
                  title={link.name}
                >
                  <span className="text-xl"><Icon size={20} /></span>
                  <span className={`transition-all duration-200 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>
        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar overlay" />
            <aside className="relative w-64 max-w-full h-full bg-white/90 dark:bg-[#232946]/90 border-r border-blue-100 dark:border-blue-900 shadow-2xl p-0 flex flex-col transition-transform duration-300 rounded-r-xl">
              <button
                className="absolute top-4 right-4 p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 shadow"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <nav className="flex flex-col gap-2 mt-16">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <NavLink
                      key={link.name}
                      to={link.to}
                      className={({ isActive }: { isActive: boolean }) =>
                        `flex items-center gap-3 px-5 py-3 rounded-xl font-medium hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900 dark:hover:to-blue-800 transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg dark:from-blue-700 dark:to-blue-500' : 'text-blue-900 dark:text-blue-100'}`
                      }
                      title={link.name}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="text-xl"><Icon size={20} /></span>
                      <span>{link.name}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}
        {/* Main content area */}
        <main className="flex-1 w-full p-0 sm:p-0 md:p-0 flex flex-col gap-8 transition-all duration-300 min-h-[calc(100vh-72px)]">
          {/* Floating Action Button (FAB) and Welcome Pop-up for Dashboard */}
          {isDashboard && (
              <button
                className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white shadow-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="New Story"
                onClick={() => {
                  // Dispatch a custom event to open the story generator modal in Dashboard
                  window.dispatchEvent(new CustomEvent('open-story-gen'));
                }}
              >
                <FiPlus size={24} />
                <span className="hidden sm:inline">New Story</span>
              </button>
          )}
          {/* Main content card */}
          <div className="w-full flex flex-col gap-8 min-h-full">
            {children}
          </div>
        </main>
      </div>
      {/* Footer */}
      <footer className="w-screen py-4 px-8 bg-white/80 dark:bg-[#232946]/80 border-t border-blue-100 dark:border-blue-900 text-center text-xs text-blue-900 dark:text-blue-100 transition-all duration-300">
        &copy; {new Date().getFullYear()} AI Novel Assistant. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout; 