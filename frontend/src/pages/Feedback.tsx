import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

// Simple star rating component
const StarRating: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        className={`text-base ${star <= value ? 'text-yellow-400' : 'text-gray-300'} focus:outline-none`}
        onClick={() => onChange(star)}
        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
      >
        ★
      </button>
    ))}
  </div>
);

// Simple thumbs up/down rating
const ThumbsRating: React.FC<{ value: 'up' | 'down' | null; onChange: (v: 'up' | 'down') => void }> = ({ value, onChange }) => (
  <div className="flex gap-0.5">
    <button
      type="button"
      className={`text-base ${value === 'up' ? 'text-green-500' : 'text-gray-300'} focus:outline-none`}
      onClick={() => onChange('up')}
      aria-label="Thumbs up"
    >
      👍
    </button>
    <button
      type="button"
      className={`text-base ${value === 'down' ? 'text-red-500' : 'text-gray-300'} focus:outline-none`}
      onClick={() => onChange('down')}
      aria-label="Thumbs down"
    >
      👎
    </button>
  </div>
);

const Feedback: React.FC = () => {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', feedback: '' });
  const [star, setStar] = useState(0);
  const [thumb, setThumb] = useState<'up' | 'down' | null>(null);
  const [comments, setComments] = useState<string[]>([]);
  const [comment, setComment] = useState('');

  // Handle feedback form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Feedback submitted! Thank you!', 'success');
    setForm({ name: '', feedback: '' });
    setStar(0);
    setThumb(null);
  };

  // Handle comment submit
  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments((prev) => [...prev, comment.trim()]);
      setComment('');
      showToast('Comment submitted!', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2236] via-[#232946] to-[#121826] dark:from-[#181c2a] dark:via-[#232946] dark:to-[#121826]">
      <div className="w-full max-w-lg mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
        <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-4 sm:mb-6 text-center text-gray-900 dark:text-gray-100">User Feedback</h2>
        <Card className="p-4 sm:p-6">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              label="Your Name (optional)"
              name="name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Enter your name"
            />
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Your Feedback</label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-orange-400 transition-colors duration-300"
                name="feedback"
                value={form.feedback}
                onChange={e => setForm({ ...form, feedback: e.target.value })}
                placeholder="Share your thoughts..."
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <span className="font-medium text-gray-800 dark:text-gray-200">Rate:</span>
              <StarRating value={star} onChange={setStar} />
              <ThumbsRating value={thumb} onChange={setThumb} />
            </div>
            <Button type="submit" variant="primary" className="w-full py-3 text-base">Submit Feedback</Button>
          </form>
        </Card>
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-2 dark:text-gray-100 text-center">Comments & Suggestions</h3>
          <form className="flex flex-col sm:flex-row gap-2 mb-4" onSubmit={handleComment}>
            <input
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-orange-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Add a comment..."
            />
            <Button type="submit" variant="secondary" className="w-full sm:w-auto py-2 text-base">Send</Button>
          </form>
          <ul className="space-y-2">
            {comments.map((c, i) => (
              <li key={i} className="bg-gray-100 dark:bg-gray-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-gray-100">{c}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Feedback; 