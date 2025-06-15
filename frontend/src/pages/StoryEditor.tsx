import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Loader from '../components/ui/Loader';
import { HiOutlineBold, HiOutlineItalic, HiOutlineUnderline, HiOutlineSparkles } from 'react-icons/hi2';
import { FiFileText, FiDownload, FiZap } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import { getStoryById, createStory, updateStory, Story, analyzeStoryContent, StoryAnalysisReport, exportStory } from '../services/storyService';
import { generateTextWithLLMGateway } from '../services/llmService';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../context/AuthContext';

const promptTemplates = [
  'Write a dramatic opening scene.',
  'Describe a futuristic city in vivid detail.',
  'Create a dialogue between two rivals.',
  'Summarize the story so far in one paragraph.',
];

// Enhanced StoryEditor page with Card, Input, Button, and Modal
const StoryEditor: React.FC = () => {
  const { id: storyId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState<Partial<Story>>({ title: '', content: '', projectId: user?.id });
  const [showSaveModal, setShowSaveModal] = useState(false); // Renamed for clarity
  const [exporting, setExporting] = useState<'pdf' | 'txt' | null>(null);
  const [loading, setLoading] = useState(false); // For AI generation and save
  const [fetchingStory, setFetchingStory] = useState(true); // For initial story fetch
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [generationLoading, setGenerationLoading] = useState(false); // Specific loading for AI generation

  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysisReport, setAnalysisReport] = useState<StoryAnalysisReport | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Fetch story on component mount if ID exists
  useEffect(() => {
    if (storyId) {
      const fetchStory = async () => {
        setFetchingStory(true);
        setFetchError(null);
        try {
          const fetchedStory = await getStoryById(storyId);
          setForm(fetchedStory);
        } catch (err: any) {
          setFetchError(err.message || 'Failed to fetch story');
          showToast('Error fetching story: ' + (err.message || 'Unknown error'), 'error');
        } finally {
          setFetchingStory(false);
        }
      };
      fetchStory();
    } else {
      setFetchingStory(false); // No ID, so no fetching needed
    }
  }, [storyId, showToast]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit (save/update story)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      showToast('Please log in to save stories.', 'error');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      let savedStory: Story;
      if (storyId) {
        // Update existing story
        savedStory = await updateStory(storyId, { ...form });
        showToast('Story updated successfully!', 'success');
      } else {
        // Create new story
        if (!form.title || !form.content) {
          showToast('Title and Content are required to create a new story.', 'error');
          setLoading(false);
          return;
        }
        savedStory = await createStory({ ...form, projectId: user.id }); // Assuming projectId is userId for now
        showToast('Story created successfully!', 'success');
        navigate(`/story/${savedStory.id}/edit`); // Navigate to new story's edit URL
      }
      setShowSaveModal(true);
    } catch (err: any) {
      showToast('Failed to save story: ' + (err.message || 'Unknown error'), 'error');
      console.error("Error saving story:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle AI generation
  const handleGenerate = async () => {
    if (!form.content) {
      showToast('Please write some content to generate from.', 'error');
      return;
    }
    setGenerationLoading(true);
    try {
      const generatedText = await generateTextWithLLMGateway(form.content);
      setForm(prevForm => ({ ...prevForm, content: prevForm.content + '\n\n' + generatedText }));
      showToast('AI generated content successfully!', 'success');
    } catch (err: any) {
      showToast('AI generation failed: ' + (err.message || 'Unknown error'), 'error');
      console.error("AI generation error:", err);
    } finally {
      setGenerationLoading(false);
    }
  };

  // Handle story analysis
  const handleAnalyzeStory = async () => {
    if (!storyId) {
      showToast('Please save the story before analyzing.', 'info');
      return;
    }
    if (!form.content) {
      showToast('Story content is empty and cannot be analyzed.', 'info');
      return;
    }

    setAnalysisLoading(true);
    setAnalysisError(null);
    setAnalysisReport(null);
    try {
      const report = await analyzeStoryContent(storyId);
      setAnalysisReport(report);
      setShowAnalysisModal(true);
      showToast('Story analysis complete!', 'success');
    } catch (err: any) {
      setAnalysisError(err.message || 'Failed to analyze story.');
      showToast('Story analysis failed: ' + (err.message || 'Unknown error'), 'error');
      console.error("Story analysis error:", err);
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Handle export
  const handleExport = async (type: 'pdf' | 'txt') => {
    if (!storyId) {
      showToast('Please save the story before exporting.', 'info');
      return;
    }
    setExporting(type);
    showToast(`Exporting ${form.title} as ${type.toUpperCase()}...`, 'info');
    try {
      await exportStory(storyId, type);
      showToast(`${form.title} exported as ${type.toUpperCase()} successfully!`, 'success');
    } catch (err: any) {
      showToast(`Failed to export story: ${err.message}`, 'error');
      console.error("Export error:", err);
    } finally {
      setExporting(null);
    }
  };

  // Word and character count
  const wordCount = form.content?.trim() ? form.content.trim().split(/\s+/).length : 0;
  const charCount = form.content?.length || 0;

  if (fetchingStory) {
    return <Loader size={48} className="min-h-screen flex items-center justify-center"/>; 
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Main Editor Section */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="mb-2">
          <h2 className="text-4xl font-heading font-bold text-[#232946] dark:text-white tracking-tight drop-shadow-sm">Story Editor</h2>
          <p className="text-lg text-blue-700 dark:text-orange-200 mt-1">Write, edit, and generate your story with AI assistance.</p>
          <hr className="my-4 border-blue-200 dark:border-blue-800" />
        </div>
        {fetchError && <div className="text-danger text-center font-semibold mb-4">{fetchError}</div>}
        <Card className="bg-white/80 dark:bg-blue-950/80 backdrop-blur-md border border-blue-200 dark:border-blue-900 shadow-2xl p-0 overflow-hidden">
          <form className="flex flex-col gap-6 p-6" onSubmit={handleSubmit}>
            <Input
              label="Title"
              name="title"
              value={form.title || ''}
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
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={loading || generationLoading}
                className="p-2 rounded-xl bg-gradient-to-r from-pink-400 to-orange-400 text-white hover:from-pink-500 hover:to-orange-500 shadow transition-all duration-200"
                aria-label="Generate with AI" title="Generate with AI"
              >
                {generationLoading ? <Loader size={16} className="inline-block"/> : <HiOutlineSparkles className="w-5 h-5" />}
              </Button>
              <Button
                type="button"
                onClick={handleAnalyzeStory}
                disabled={!storyId || !form.content || analysisLoading}
                className="p-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-white hover:from-teal-500 hover:to-cyan-500 shadow transition-all duration-200"
                aria-label="Analyze Story" title="Analyze Story Content"
              >
                {analysisLoading ? <Loader size={16} className="inline-block"/> : <FiZap className="w-5 h-5" />}
              </Button>
            </div>
            {/* Editor area */}
            <div className="relative">
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200 pl-1">Content</label>
              <textarea
                name="content"
                value={form.content || ''}
                onChange={handleChange}
                placeholder="Write your story here..."
                className="w-full min-h-[180px] px-4 py-3 rounded-xl shadow border border-blue-100 dark:border-blue-800 bg-white/80 dark:bg-blue-950/80 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-orange-400 transition-all duration-300"
                required
              />
              {/* Shimmer/placeholder animation for loading/generation */}
              {(loading || generationLoading) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-100/80 via-blue-200/80 to-blue-100/80 dark:from-blue-900/80 dark:via-blue-800/80 dark:to-blue-900/80 rounded-xl animate-pulse z-10">
                  <span className="text-blue-600 dark:text-blue-200 font-semibold text-lg">{generationLoading ? 'Generating...' : 'Saving...'}</span>
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
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Story'}
            </Button>
          </form>
        </Card>
      </div>
      <Modal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)} title="Story Saved!">
        <p className="mb-4 text-blue-900 dark:text-blue-100">Your story has been saved successfully.</p>
        <Button variant="primary" onClick={() => setShowSaveModal(false)}>
          Close
        </Button>
      </Modal>
      {/* Story Analysis Modal */}
      <Modal
        isOpen={showAnalysisModal}
        onClose={() => setShowAnalysisModal(false)}
        title="Story Analysis Report"
      >
        {analysisLoading ? (
          <Loader size={24} className="my-4" />
        ) : analysisError ? (
          <p className="text-error mb-4">Error: {analysisError}</p>
        ) : analysisReport ? (
          <div className="text-blue-900 dark:text-blue-100 space-y-4">
            <p className="text-lg font-semibold">Analysis for: {analysisReport.title}</p>
            <div>
              <h4 className="font-bold mb-1">Scores (Out of 10):</h4>
              <ul className="list-disc list-inside">
                <li>Coherence: <span className="font-mono font-bold">{analysisReport.coherence_score || 'N/A'}</span></li>
                <li>Style: <span className="font-mono font-bold">{analysisReport.style_score || 'N/A'}</span></li>
                <li>Pacing: <span className="font-mono font-bold">{analysisReport.pacing_score || 'N/A'}</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-1">Feedback for Improvement:</h4>
              <p className="text-sm"><strong>Coherence:</strong> {analysisReport.feedback?.coherence || 'No feedback.'}</p>
              <p className="text-sm"><strong>Style:</strong> {analysisReport.feedback?.style || 'No feedback.'}</p>
              <p className="text-sm"><strong>Pacing:</strong> {analysisReport.feedback?.pacing || 'No feedback.'}</p>
            </div>
          </div>
        ) : (
          <p className="text-blue-900 dark:text-blue-100">No analysis report available.</p>
        )}
        <Button variant="primary" onClick={() => setShowAnalysisModal(false)} className="mt-4">
          Close
        </Button>
      </Modal>
    </div>
  );
};

export default StoryEditor; 