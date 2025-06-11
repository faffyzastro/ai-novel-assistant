import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Loader from '../components/ui/Loader';
import { HiOutlineBold, HiOutlineItalic, HiOutlineUnderline, HiOutlineSparkles } from 'react-icons/hi2';
import { FiFileText, FiDownload, FiZap } from 'react-icons/fi';

const promptTemplates = [
  'Write a dramatic opening scene.',
  'Describe a futuristic city in vivid detail.',
  'Create a dialogue between two rivals.',
  'Summarize the story so far in one paragraph.',
];

// Enhanced StoryEditor page with Card, Input, Button, and Modal
const StoryEditor: React.FC = () => {
  const [form, setForm] = useState({ title: '', content: '' });
  const [showModal, setShowModal] = useState(false);
  const [exporting, setExporting] = useState<'pdf' | 'txt' | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit (simulate save)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  // Handle export (simulate)
  const handleExport = (type: 'pdf' | 'txt') => {
    setExporting(type);
    setTimeout(() => setExporting(null), 1500);
  };

  // Simulate loading/generation
  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  // Word and character count
  const wordCount = form.content.trim() ? form.content.trim().split(/\s+/).length : 0;
  const charCount = form.content.length;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Main Editor Section */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="mb-2">
          <h2 className="text-4xl font-heading font-bold text-[#232946] dark:text-white tracking-tight drop-shadow-sm">Story Editor</h2>
          <p className="text-lg text-blue-700 dark:text-orange-200 mt-1">Write, edit, and generate your story with AI assistance.</p>
          <hr className="my-4 border-blue-200 dark:border-blue-800" />
        </div>
        <Card className="bg-white/80 dark:bg-blue-950/80 backdrop-blur-md border border-blue-200 dark:border-blue-900 shadow-2xl p-0 overflow-hidden">
          <form className="flex flex-col gap-6 p-6" onSubmit={handleSubmit}>
            <Input
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter story title"
              required
            />
            {/* Toolbar */}
            <div className="flex gap-2 mb-2 items-center">
              <button type="button" className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 shadow transition-all duration-200" aria-label="Bold" title="Bold (Ctrl+B)"><HiOutlineBold className="w-5 h-5" /></button>
              <button type="button" className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 shadow transition-all duration-200" aria-label="Italic" title="Italic (Ctrl+I)"><HiOutlineItalic className="w-5 h-5" /></button>
              <button type="button" className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 shadow transition-all duration-200" aria-label="Underline" title="Underline (Ctrl+U)"><HiOutlineUnderline className="w-5 h-5" /></button>
              <span className="mx-2 h-6 border-l border-blue-200 dark:border-blue-800" />
              <button type="button" className="p-2 rounded-xl bg-gradient-to-r from-pink-400 to-orange-400 text-white hover:from-pink-500 hover:to-orange-500 shadow transition-all duration-200" aria-label="Generate with AI" title="Generate with AI" onClick={handleGenerate}><HiOutlineSparkles className="w-5 h-5" /></button>
            </div>
            {/* Editor area */}
            <div className="relative">
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200 pl-1">Content</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Write your story here..."
                className="w-full min-h-[180px] px-4 py-3 rounded-xl shadow border border-blue-100 dark:border-blue-800 bg-white/80 dark:bg-blue-950/80 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-orange-400 transition-all duration-300"
                required
              />
              {/* Shimmer/placeholder animation for loading/generation */}
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-100/80 via-blue-200/80 to-blue-100/80 dark:from-blue-900/80 dark:via-blue-800/80 dark:to-blue-900/80 rounded-xl animate-pulse z-10">
                  <span className="text-blue-600 dark:text-blue-200 font-semibold text-lg">Generating...</span>
                </div>
              )}
            </div>
            {/* Word/Char Count */}
            <div className="flex justify-end gap-4 text-sm text-blue-500 dark:text-orange-300 font-mono">
              <span><FiFileText className="inline-block mr-1" />{wordCount} words</span>
              <span><FiFileText className="inline-block mr-1" />{charCount} chars</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <Button variant="secondary" onClick={() => handleExport('pdf')} disabled={exporting === 'pdf'}>
                {exporting === 'pdf' ? <Loader size={16} className="inline-block mr-2" /> : <FiDownload className="inline-block mr-2" />}
                Export as PDF
              </Button>
              <Button variant="secondary" onClick={() => handleExport('txt')} disabled={exporting === 'txt'}>
                {exporting === 'txt' ? <Loader size={16} className="inline-block mr-2" /> : <FiDownload className="inline-block mr-2" />}
                Export as TXT
              </Button>
            </div>
            <Button type="submit" variant="primary">
              Save Story
            </Button>
          </form>
        </Card>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Story Saved!">
        <p className="mb-4 text-blue-900 dark:text-blue-100">Your story has been saved (simulated).</p>
        <Button variant="primary" onClick={() => setShowModal(false)}>
          Close
        </Button>
      </Modal>
    </div>
  );
};

export default StoryEditor; 