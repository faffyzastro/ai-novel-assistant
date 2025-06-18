import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

// Register page with Card, Input, Button, loading, and error states
const Register: React.FC = () => {
  const { loading } = useAuth(); // In a real app, use a register function from context or API
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit (real API call)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!form.email) {
      setError('Email is required');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed');
      } else {
        setSuccess(true);
        setForm({ username: '', email: '', password: '', confirm: '' });
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#1a2236] via-[#232946] to-[#121826] dark:from-[#181c2a] dark:via-[#232946] dark:to-[#121826] p-4">
      <Card className="w-full max-w-sm p-8 bg-white/80 dark:bg-blue-950/80 backdrop-blur-md border border-blue-200 dark:border-blue-900 shadow-2xl">
        <h2 className="text-3xl font-heading font-bold mb-6 text-center text-[#232946] dark:text-white tracking-tight">Register</h2>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <Input
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Choose a username"
            autoComplete="username"
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a password"
            autoComplete="new-password"
            required
          />
          <Input
            label="Confirm Password"
            name="confirm"
            type="password"
            value={form.confirm}
            onChange={handleChange}
            placeholder="Confirm your password"
            autoComplete="new-password"
            required
          />
          {error && <div className="text-danger text-sm text-center font-semibold dark:text-pink-400">{error}</div>}
          {success && (
            <div className="text-success text-sm text-center font-semibold dark:text-green-400">
              Registration successful! You can now{' '}
              <a href="/login" className="text-blue-600 dark:text-blue-300 hover:underline font-semibold">login</a>.
            </div>
          )}
          <Button type="submit" variant="primary" disabled={loading} className="mt-2">
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-blue-900 dark:text-blue-100">
          Already have an account? <a href="/login" className="text-blue-600 dark:text-blue-300 hover:underline font-semibold">Sign In</a>
        </div>
      </Card>
    </div>
  );
};

export default Register; 