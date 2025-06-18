import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

// Advanced Login page with Card, Input, Button, loading, and error states
const Login: React.FC = () => {
  const { login, loading, error } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(form.username, form.password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#1a2236] via-[#232946] to-[#121826] dark:from-[#181c2a] dark:via-[#232946] dark:to-[#121826] p-4">
      <Card className="w-full max-w-sm p-8 bg-white/80 dark:bg-blue-950/80 backdrop-blur-md border border-blue-200 dark:border-blue-900 shadow-2xl">
        <h2 className="text-3xl font-heading font-bold mb-6 text-center text-[#232946] dark:text-white tracking-tight">Sign In</h2>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <Input
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter your username"
            autoComplete="username"
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
          {error && <div className="text-danger text-sm text-center font-semibold dark:text-pink-400">{error}</div>}
          <Button type="submit" variant="primary" disabled={loading} className="mt-2">
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-blue-900 dark:text-blue-100">
          Don&apos;t have an account? <a href="/register" className="text-blue-600 dark:text-blue-300 hover:underline font-semibold">Register</a>
        </div>
      </Card>
    </div>
  );
};

export default Login; 