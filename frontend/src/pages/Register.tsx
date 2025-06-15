import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Register page with Card, Input, Button, loading, and error states
const Register: React.FC = () => {
  const { register, loading, error: authError, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [localError, setLocalError] = useState<string | null>(null);

  // Redirect if already logged in or after successful registration
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard'); // Or wherever your main app dashboard is
    }
  }, [user, navigate]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setLocalError(null); // Clear local error on change
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (form.password !== form.confirm) {
      setLocalError('Passwords do not match');
      return;
    }
    try {
      await register(form.username, form.email, form.password);
      // No need for local success state as `user` in AuthContext will update on success
      navigate('/dashboard'); // Redirect after successful registration
    } catch (err) {
      // Error handled by AuthContext, so `authError` will be set
    }
  };

  const displayError = localError || authError;

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
          {displayError && <div className="text-danger text-sm text-center font-semibold dark:text-pink-400">{displayError}</div>}
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