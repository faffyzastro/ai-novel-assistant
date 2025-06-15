import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Dropdown, { DropdownItem } from '../components/ui/Dropdown';
import Avatar from '../components/ui/Avatar';
import { DataTable } from '../components/ui/DataTable';
import { useToast } from '../components/ui/Toast';
import Loader from '../components/ui/Loader';
import FileUpload from '../components/ui/FileUpload';
import StoryGenerator from '../components/StoryGenerator';
import Tabs from '../components/ui/Tabs';
import { getStories, deleteStory, Story, uploadAndExtractFile, exportStory } from '../services/storyService'; // Import Story interface
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Removed mockStories as we will fetch from API

const tabLabels = [
  { label: 'All Stories', status: 'all' },
  { label: 'Drafts', status: 'draft' }, // Adjusted to match backend enum
  { label: 'In Progress', status: 'in_progress' }, // Adjusted to match backend enum
  { label: 'Completed', status: 'completed' }, // Adjusted to match backend enum
];

const recentActivity = [
  { type: 'upload', text: 'Uploaded "AI Dreams.txt"', time: '2 min ago' },
  { type: 'edit', text: 'Edited "The Lost City"', time: '10 min ago' },
  { type: 'upload', text: 'Uploaded "Midnight Library.md"', time: '1 hour ago' },
];

const promptTemplates = [
  'Write a dramatic opening scene.',
  'Describe a futuristic city in vivid detail.',
  'Create a dialogue between two rivals.',
  'Summarize the story so far in one paragraph.',
];

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [stories, setStories] = useState<Story[]>([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [storiesError, setStoriesError] = useState<string | null>(null);

  const [selectedStory, setSelectedStory] = useState<Story | null>(null); // Renamed to avoid conflict
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Renamed to avoid conflict
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [downloading, setDownloading] = useState<{ id: string; type: string } | null>(null); // Changed id to string
  const [showStoryGen, setShowStoryGen] = useState(false);
  const [search, setSearch] = useState('');
  const [previewStory, setPreviewStory] = useState<Story | null>(null); // Renamed to avoid conflict
  const [showWelcome, setShowWelcome] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Fetch stories from API
  const fetchStories = useCallback(async () => {
    if (!user) return; // Only fetch if user is logged in
    setLoadingStories(true);
    setStoriesError(null);
    try {
      const fetchedStories = await getStories({ userId: user.id }); // Assuming stories can be filtered by user ID
      setStories(fetchedStories);
    } catch (err: any) {
      setStoriesError(err.message || 'Failed to fetch stories');
      console.error("Error fetching stories:", err);
    } finally {
      setLoadingStories(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  // Handle story generator event
  useEffect(() => {
    const handler = () => setShowStoryGen(true);
    window.addEventListener('open-story-gen', handler);
    return () => window.removeEventListener('open-story-gen', handler);
  }, []);

  // Memoize filtered stories for performance
  const getFilteredStories = useMemo(() => (status: string) => {
    const q = search.toLowerCase();
    return stories.filter(story => {
      const matchesTab = status === 'all' ? true : story.status === status;
      return matchesTab && (
        story.title.toLowerCase().includes(q) ||
        (story.synopsis && story.synopsis.toLowerCase().includes(q)) ||
        (story.genre && story.genre.toLowerCase().includes(q)) ||
        (story.status && story.status.toLowerCase().includes(q))
      );
    });
  }, [search, stories]);

  // Handle file upload and text extraction
  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    showToast(`Uploading file: ${uploadedFile.name}`, 'info');
    try {
      const result = await uploadAndExtractFile(uploadedFile);
      showToast(`Text extracted from ${uploadedFile.name} successfully!`, 'success');
      // Optionally, use the extracted text to create a new story or update an existing one
      console.log('Extracted text:', result.extractedText);
      // You might want to open a modal here to let the user create a story from this text
    } catch (err: any) {
      showToast(`Failed to extract text from ${uploadedFile.name}: ${err.message}`, 'error');
      console.error('File extraction error:', err);
    }
  };

  // Handle file download
  const handleDownload = async (story: Story, type: 'pdf' | 'txt') => {
    setDownloading({ id: story.id, type });
    showToast(`Downloading ${story.title} as ${type.toUpperCase()}...`, 'info');
    try {
      await exportStory(story.id, type);
      showToast(`${story.title} exported as ${type.toUpperCase()} successfully!`, 'success');
    } catch (err: any) {
      showToast(`Failed to export story: ${err.message}`, 'error');
      console.error("Export error:", err);
    } finally {
      setDownloading(null);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (selectedStory) {
      setShowDeleteModal(false);
      try {
        await deleteStory(selectedStory.id);
        showToast('Story deleted successfully', 'success');
        fetchStories(); // Re-fetch stories after deletion
        setSelectedStory(null);
      } catch (err: any) {
        showToast(`Failed to delete story: ${err.message}`, 'error');
        console.error("Error deleting story:", err);
      }
    }
  };

  // DataTable columns
  const columns = [
    { label: 'Title', key: 'title' },
    { label: 'Genre', key: 'genre' },
    { label: 'Status', key: 'status' },
    { label: 'Last Updated', key: 'updatedAt' }, // Changed to updatedAt
    { label: 'Actions', key: 'actions' },
  ];

  // Prepare data for DataTable
  const storyDataForTable = (storiesToMap: Story[]) => storiesToMap.map((story) => ({
    ...story,
    author: user?.username || 'N/A', // Use logged-in username as author
    updated: new Date(story.updatedAt).toLocaleDateString(), // Format date
    status: <span className="font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-700 dark:text-blue-200 shadow-sm text-base">{story.status}</span>,
    actions: (
      <Dropdown label={<span className="text-blue-600 dark:text-orange-300 font-semibold">Actions</span>} compact>
        <DropdownItem className="text-blue-700 dark:text-orange-200" compact onClick={() => setPreviewStory(story)}>Preview</DropdownItem>
        <DropdownItem className="text-blue-700 dark:text-orange-200" compact onClick={() => navigate(`/story/${story.id}/edit`)}>Edit</DropdownItem>
        <DropdownItem className="text-blue-700 dark:text-orange-200" compact onClick={() => navigate(`/story/${story.id}/analyze`)}>Analyze</DropdownItem>
        <DropdownItem className="text-blue-700 dark:text-orange-200" compact onClick={() => handleDownload(story, 'pdf')}>
          {downloading && downloading.id === story.id && downloading.type === 'pdf' ? <Loader size={14} className="inline-block mr-2" /> : null}
          Download PDF
        </DropdownItem>
        <DropdownItem className="text-blue-700 dark:text-orange-200" compact onClick={() => handleDownload(story, 'txt')}>
          {downloading && downloading.id === story.id && downloading.type === 'txt' ? <Loader size={14} className="inline-block mr-2" /> : null}
          Download TXT
        </DropdownItem>
        <DropdownItem className="text-red-600 dark:text-pink-400 font-semibold" compact onClick={() => {
          setSelectedStory(story);
          setShowDeleteModal(true);
        }}>Delete</DropdownItem>
      </Dropdown>
    ),
  }));

  if (authLoading || !user) {
    return <Loader size={48} className="min-h-screen flex items-center justify-center"/>; // Show a loader while authentication is in progress
  }

  return (
    <div className="w-full min-h-screen flex flex-col gap-0 bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-[#181c2a] dark:via-[#232946] dark:to-blue-950">
      {/* Welcome Pop-up for new users */}
      {showWelcome && (
        <div className="fixed bottom-24 right-8 z-50 bg-blue-600 dark:bg-orange-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-4 animate-fadeIn">
          <span className="font-bold">💡 Start sharing your ideas and generate a story with AI now!</span>
          <button onClick={() => setShowWelcome(false)} className="ml-2 text-white/80 hover:text-white focus:outline-none text-lg">&times;</button>
        </div>
      )}
      <div className="w-full mx-auto flex flex-col md:flex-row gap-8 px-2 sm:px-4 py-8 flex-1">
        {/* Left: Story Management */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <Card className="p-6 bg-white/90 dark:bg-blue-950/90 border border-blue-200 dark:border-blue-900 shadow-xl animate-fadeIn">
            <Tabs
              tabs={tabLabels.map(tab => ({
                label: tab.label,
                content: (
                  <>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
                      <input
                        type="text"
                        placeholder="Search stories..."
                        className="w-full sm:w-1/2 px-4 py-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-blue-950 text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-orange-400 transition-all duration-300"
                        aria-label="Search stories"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                      />
                      {loadingStories && <Loader size={20} className="mr-2"/>}
                      {storiesError && <div className="text-error text-sm">{storiesError}</div>}
                    </div>
                    <Card className="p-0 overflow-hidden bg-white/95 dark:bg-blue-950/95 border-2 border-blue-200 dark:border-orange-700 shadow-2xl animate-fadeIn">
                      <div className="overflow-x-auto">
                        <DataTable columns={columns} data={storyDataForTable(getFilteredStories(tab.status))} />
                      </div>
                    </Card>
                  </>
                )
              }))}
            />
          </Card>
        </div>
        {/* Right: Actions & Activity */}
        <div className="w-full md:w-96 flex flex-col gap-6 sticky top-8 self-start min-w-0">
          <Card className="flex flex-col gap-4 p-6 bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-900 dark:to-orange-900 border border-blue-200 dark:border-blue-900 shadow-xl animate-fadeIn">
            <FileUpload
              accept=".txt,.md,.pdf"
              multiple={false}
              label="Upload Story Files (.txt, .md, .pdf)"
              onFileRead={handleFileUpload} // Changed prop name to onFileChange to match standard file input
            />
            <div className="mt-2">
              <Dropdown
                label={
                  <span className="text-blue-700 dark:text-orange-300 font-bold px-3 py-1 rounded-lg bg-white dark:bg-blue-950 border-2 border-blue-600 dark:border-orange-400 shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 dark:focus-visible:ring-blue-400">
                    Quick Actions
                  </span>
                }
                compact
              >
                <DropdownItem className="text-blue-700 dark:text-orange-200" compact>Export All</DropdownItem>
                <DropdownItem className="text-blue-700 dark:text-orange-200" compact>Delete Selected</DropdownItem>
                <DropdownItem className="text-blue-700 dark:text-orange-200" compact>Mark as Completed</DropdownItem>
              </Dropdown>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-900 dark:to-orange-900 border border-blue-200 dark:border-blue-900 shadow-md animate-fadeIn">
            <h4 className="text-lg font-bold text-blue-700 dark:text-orange-400 mb-2">Recent Activity</h4>
            <ul className="space-y-2">
              {recentActivity.length === 0 ? (
                <li className="text-blue-400 dark:text-blue-300 text-center py-8 animate-fadeIn">No recent activity yet.</li>
              ) : (
                recentActivity.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-blue-900 dark:text-blue-100 text-sm">
                    <span className={`inline-block w-2 h-2 rounded-full ${item.type === 'upload' ? 'bg-blue-400 dark:bg-orange-400' : 'bg-orange-400 dark:bg-blue-400'}`}></span>
                    <span>{item.text}</span>
                    <span className="ml-auto text-xs text-blue-400 dark:text-blue-300">{item.time}</span>
                  </li>
                ))
              )}
            </ul>
          </Card>
        </div>
      </div>
      {/* Modals */}
      <Modal
        isOpen={!!previewStory}
        onClose={() => setPreviewStory(null)}
        title={previewStory?.title}
      >
        <p className="mb-4 text-blue-900 dark:text-blue-100">{previewStory?.synopsis}</p>
        <Button variant="primary" onClick={() => setPreviewStory(null)}>
          Close
        </Button>
      </Modal>
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Story?"
      >
        <p className="mb-4 text-blue-900 dark:text-blue-100">Are you sure you want to delete &quot;<b>{selectedStory?.title}</b>&quot;? This action cannot be undone.</p>
        <div className="flex gap-2">
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
        </div>
      </Modal>
      <Modal
        isOpen={showStoryGen}
        onClose={() => setShowStoryGen(false)}
        title="Generate New Story"
      >
        <div className="p-2 sm:p-4 bg-gradient-to-br from-blue-50 to-orange-50 dark:from-gray-900 dark:to-blue-950 rounded-2xl">
          {/* Prompt Templates */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-blue-700 dark:text-orange-400 mb-2 flex items-center gap-2">
              <span role="img" aria-label="lightning">⚡</span> Prompt Examples
            </h3>
            <ul className="space-y-2">
              {promptTemplates.map((prompt, i) => (
                <li key={i}>
                  <button
                    className="w-full text-left px-3 py-2 rounded-lg bg-blue-100/70 dark:bg-blue-900/70 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-900 dark:text-blue-100 font-medium transition-all duration-200"
                    onClick={() => window.dispatchEvent(new CustomEvent('use-prompt-template', { detail: prompt }))}
                    type="button"
                  >
                    {prompt}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <StoryGenerator />
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard; 