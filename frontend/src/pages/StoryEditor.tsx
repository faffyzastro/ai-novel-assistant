import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Loader from '../components/ui/Loader';
import { HiOutlineBold, HiOutlineItalic, HiOutlineUnderline, HiOutlineSparkles } from 'react-icons/hi2';
import { FiFileText, FiDownload, FiZap, FiPlus } from 'react-icons/fi';
import { getUserProjects, Project, getChapters, addChapter, updateChapter, deleteChapter, Chapter, generateStory, addFeedback } from '../services/storyService';
import { useAuth } from '../context/AuthContext';
import { useDebouncedCallback } from 'use-debounce';
import debounce from 'lodash.debounce';

// Enhanced StoryEditor page with Card, Input, Button, and Modal
const StoryEditor: React.FC = () => {
  const { user } = useAuth();
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chapterModal, setChapterModal] = useState<{ open: boolean; mode: 'add' | 'edit'; chapter?: Chapter }>({ open: false, mode: 'add' });
  const [chapterForm, setChapterForm] = useState({ title: '', content: '', chapterNumber: 1 });
  const [deleteChapterId, setDeleteChapterId] = useState<string | null>(null);
  const [chapterLoading, setChapterLoading] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });
  const [showModal, setShowModal] = useState(false);
  const [exporting, setExporting] = useState<'pdf' | 'txt' | null>(null);
  const [activeTab, setActiveTab] = useState<'write' | 'ai' | 'preview'>('write');
  const [aiText, setAiText] = useState('');
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Load project and chapters
  useEffect(() => {
    if (user && projectId) {
      setLoading(true);
      getUserProjects(user.uid).then(projects => {
        const found = projects.find(p => p.id === projectId);
        setProject(found || null);
        setLoading(false);
      });
      getChapters(user.uid, projectId).then(setChapters);
    }
  }, [user, projectId]);

  // Open add/edit chapter modal
  const openChapterModal = (mode: 'add' | 'edit', chapter?: Chapter) => {
    setChapterModal({ open: true, mode, chapter });
    if (mode === 'edit' && chapter) {
      setChapterForm({
        title: chapter.title,
        content: chapter.content,
        chapterNumber: chapter.chapterNumber,
      });
    } else {
      setChapterForm({ title: '', content: '', chapterNumber: chapters.length + 1 });
    }
  };

  // Handle chapter form input changes (local state only)
  const handleChapterInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setChapterForm(f => ({ ...f, [name]: value }));
  };

  // Handle chapter form submit
  const handleChapterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !projectId) return;
    setChapterLoading(true);
    try {
      if (chapterModal.mode === 'add') {
        await addChapter(user.uid, projectId, chapterForm);
      } else if (chapterModal.mode === 'edit' && chapterModal.chapter?.id) {
        await updateChapter(user.uid, projectId, chapterModal.chapter.id, chapterForm);
      }
      const updated = await getChapters(user.uid, projectId);
      setChapters(updated);
      setChapterModal({ open: false, mode: 'add' });
    } catch (err) {
      // handle error
    }
    setChapterLoading(false);
  };

  // Handle delete chapter
  const handleDeleteChapter = async () => {
    if (!user || !projectId || !deleteChapterId) return;
    setChapterLoading(true);
    try {
      await deleteChapter(user.uid, projectId, deleteChapterId);
      const updated = await getChapters(user.uid, projectId);
      setChapters(updated);
      setDeleteChapterId(null);
    } catch (err) {
      // handle error
    }
    setChapterLoading(false);
  };

  if (loading) return <Loader />;
  if (!project) return <div className="p-8 text-center text-red-600">Project not found.</div>;

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit (simulate save)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !projectId) return;
    setLoading(true);
    try {
      // Save the story (update project metadata and first chapter)
      await updateChapter(user.uid, projectId, chapters[0]?.id, { title: form.title, content: form.content });
      setShowModal(true);
    } catch (err) {
      // handle error
    }
    setLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-[#1a2236] via-[#232946] to-[#121826] dark:from-[#181c2a] dark:via-[#232946] dark:to-[#121826]">
      <div className="w-full mx-auto p-4 md:p-8 md:max-w-6xl">
        {/* Project Metadata */}
        <Card className="mb-6 p-6 flex flex-col md:flex-row gap-6 items-center">
          {project.coverImage && (
            <img src={project.coverImage} alt="Cover" className="w-32 h-44 object-cover rounded-lg shadow" />
          )}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-blue-700 dark:text-orange-300 mb-2">{project.title}</h2>
            <div className="text-blue-500 dark:text-orange-200 mb-1 font-semibold">{project.genre} &middot; {project.status}</div>
            <div className="text-gray-700 dark:text-gray-200 mb-2">{project.description}</div>
          </div>
        </Card>
        {/* Chapters List */}
        <Card className="mb-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-blue-700 dark:text-orange-300">Chapters</h3>
            <Button variant="primary" onClick={() => openChapterModal('add')}>Add Chapter</Button>
          </div>
          {chapters.length === 0 ? (
            <div className="text-blue-500 dark:text-blue-200">No chapters yet.</div>
          ) : (
            <ul className="divide-y divide-blue-100 dark:divide-blue-900">
              {chapters.map(ch => (
                <li key={ch.id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <div className="font-semibold text-blue-900 dark:text-blue-100">Chapter {ch.chapterNumber}: {ch.title}</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 max-w-2xl">{ch.content.slice(0, 200)}{ch.content.length > 200 ? '...' : ''}</div>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Button variant="secondary" onClick={() => openChapterModal('edit', ch)}>Edit</Button>
                    <Button variant="danger" onClick={() => setDeleteChapterId(ch.id!)}>Delete</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
        {/* Chapter Modal */}
        <Modal isOpen={chapterModal.open} onClose={() => setChapterModal({ open: false, mode: 'add' })} title={chapterModal.mode === 'add' ? 'Add Chapter' : 'Edit Chapter'}>
          <form onSubmit={handleChapterSubmit} className="space-y-4">
            <div>
              <label className="block text-blue-700 dark:text-orange-300 font-semibold mb-1">Title</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-blue-200 dark:border-orange-700 bg-white dark:bg-blue-950 text-gray-900 dark:text-gray-100"
                name="title"
                value={chapterForm.title}
                onChange={handleChapterInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-blue-700 dark:text-orange-300 font-semibold mb-1">Content</label>
              <textarea
                className="w-full px-3 py-2 rounded-lg border border-blue-200 dark:border-orange-700 bg-white dark:bg-blue-950 text-gray-900 dark:text-gray-100 min-h-[120px]"
                name="content"
                value={chapterForm.content}
                onChange={handleChapterInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-blue-700 dark:text-orange-300 font-semibold mb-1">Chapter Number</label>
              <input
                type="number"
                min={1}
                className="w-full px-3 py-2 rounded-lg border border-blue-200 dark:border-orange-700 bg-white dark:bg-blue-950 text-gray-900 dark:text-gray-100"
                name="chapterNumber"
                value={chapterForm.chapterNumber}
                onChange={handleChapterInputChange}
                required
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="primary" type="submit" disabled={chapterLoading}>{chapterModal.mode === 'add' ? 'Add' : 'Save'}</Button>
              <Button variant="secondary" type="button" onClick={() => setChapterModal({ open: false, mode: 'add' })}>Cancel</Button>
            </div>
          </form>
          {aiText && (
            <div className="mt-2 flex gap-2 items-center">
              <Button variant="secondary" onClick={() => {
                if (undoStack.length > 0) {
                  setChapterForm(f => ({ ...f, content: undoStack[undoStack.length - 1] }));
                  setUndoStack(undoStack.slice(0, -1));
                  setAiText('');
                }
              }}>Undo AI</Button>
              <span className="ml-2">Rate this continuation:</span>
              {[1,2,3,4,5].map(n => (
                <button key={n} className={`px-2 py-1 rounded ${rating === n ? 'bg-blue-600 text-white' : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-orange-200'}`} onClick={async () => {
                  setRating(n);
                  if (user) await addFeedback(user.uid, { type: 'ai-continuation', message: aiText, rating: n });
                }}>{n}</button>
              ))}
            </div>
          )}
        </Modal>
        {/* Delete Chapter Modal */}
        <Modal isOpen={!!deleteChapterId} onClose={() => setDeleteChapterId(null)} title="Delete Chapter?">
          <p className="mb-4 text-blue-900 dark:text-blue-100">Are you sure you want to delete this chapter? This action cannot be undone.</p>
          <div className="flex gap-2">
            <Button variant="danger" onClick={handleDeleteChapter} disabled={chapterLoading}>Delete</Button>
            <Button variant="secondary" onClick={() => setDeleteChapterId(null)}>Cancel</Button>
          </div>
        </Modal>
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-[#232946]/80 backdrop-blur-md border-b border-blue-100 dark:border-blue-900 flex items-center justify-between px-4 py-2 shadow">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-orange-300">Story Editor</h2>
          <Button variant="primary" icon={<FiPlus />}>New Story</Button>
        </div>
        <div className="flex flex-col md:flex-row gap-12 mt-4">
          {/* Left: Editor with tabs */}
          <div className="md:w-3/4 flex-1 min-w-0">
            <Card className="p-0 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-blue-100 dark:border-blue-900">
                <button onClick={() => setActiveTab('write')} className={`px-4 py-2 font-semibold ${activeTab === 'write' ? 'text-blue-700 dark:text-orange-300 border-b-2 border-blue-600 dark:border-orange-400' : 'text-blue-700 dark:text-orange-300'}`}>Write</button>
                <button onClick={() => setActiveTab('ai')} className={`px-4 py-2 font-semibold ${activeTab === 'ai' ? 'text-blue-700 dark:text-orange-300 border-b-2 border-blue-600 dark:border-orange-400' : 'text-blue-700 dark:text-orange-300'}`}>AI Suggestions</button>
                <button onClick={() => setActiveTab('preview')} className={`px-4 py-2 font-semibold ${activeTab === 'preview' ? 'text-blue-700 dark:text-orange-300 border-b-2 border-blue-600 dark:border-orange-400' : 'text-blue-700 dark:text-orange-300'}`}>Preview</button>
              </div>
              {/* Tab content */}
              {activeTab === 'write' && (
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
              )}
              {activeTab === 'ai' && (
                <div className="p-6 text-center text-blue-700 dark:text-orange-300">AI Suggestions coming soon!</div>
              )}
              {activeTab === 'preview' && (
                <div className="p-6 text-center text-blue-700 dark:text-orange-300">Preview coming soon!</div>
              )}
            </Card>
          </div>
          {/* Right: Panels */}
          <div className="md:w-1/4 w-full flex-shrink-0 flex flex-col gap-6 sticky top-20 self-start min-w-0">
            <Card className="p-4">
              <h4 className="font-bold mb-2">Recent Stories</h4>
              <ul className="space-y-2 text-blue-900 dark:text-blue-100">
                <li>AI Dreams</li>
                <li>The Lost City</li>
                <li>Midnight Library</li>
              </ul>
            </Card>
          </div>
        </div>
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