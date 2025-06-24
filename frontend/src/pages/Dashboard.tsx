import React, { useState, useMemo, useEffect } from 'react';
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

// Mock stories for demonstration
const mockStories = [
  { id: 1, title: 'The Lost City', author: 'Jane Doe', status: 'Draft', updated: '2024-06-09' },
  { id: 2, title: 'AI Dreams', author: 'John Smith', status: 'In Progress', updated: '2024-06-08' },
  { id: 3, title: 'Midnight Library', author: 'Jane Doe', status: 'Completed', updated: '2024-06-07' },
];

const tabLabels = [
  { label: 'All Stories', status: 'all' },
  { label: 'Drafts', status: 'Draft' },
  { label: 'In Progress', status: 'In Progress' },
  { label: 'Completed', status: 'Completed' },
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
  const [selected, setSelected] = useState<typeof mockStories[0] | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [downloading, setDownloading] = useState<{ id: number; type: string } | null>(null);
  const [showStoryGen, setShowStoryGen] = useState(false);
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState<typeof mockStories[0] | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const handler = () => setShowStoryGen(true);
    window.addEventListener('open-story-gen', handler);
    return () => window.removeEventListener('open-story-gen', handler);
  }, []);

  // Memoize filtered stories for performance
  const getFilteredStories = useMemo(() => (status: string) =>
    mockStories.filter(story => {
      const q = search.toLowerCase();
      const matchesTab = status === 'all' ? true : story.status === status;
      return matchesTab && (
        story.title.toLowerCase().includes(q) ||
        story.author.toLowerCase().includes(q) ||
        story.status.toLowerCase().includes(q)
      );
    }), [search]);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      showToast('File uploaded: ' + e.target.files[0].name, 'success');
    }
  };

  // Handle file download (simulate)
  const handleDownload = (story: typeof mockStories[0], type: 'pdf' | 'txt') => {
    setDownloading({ id: story.id, type });
    showToast(`Downloading ${story.title} as ${type.toUpperCase()} (simulated)`, 'info');
    setTimeout(() => setDownloading(null), 1500);
  };

  // Handle delete
  const handleDelete = () => {
    setShowDelete(false);
    showToast('Story deleted (simulated)', 'success');
  };

  // DataTable columns
  const columns = [
    { label: 'Title', key: 'title' },
    { label: 'Author', key: 'author' },
    { label: 'Status', key: 'status' },
    { label: 'Last Updated', key: 'updated' },
    { label: 'Actions', key: 'actions' },
  ];

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
                    </div>
                    <Card className="p-0 overflow-hidden bg-white/95 dark:bg-blue-950/95 border-2 border-blue-200 dark:border-orange-700 shadow-2xl animate-fadeIn">
                      <div className="overflow-x-auto">
                        <DataTable columns={columns} data={getFilteredStories(tab.status).map((story) => ({
                          ...story,
                          author: <span className="flex items-center gap-2 text-blue-900 dark:text-blue-100 font-medium text-base"><Avatar size={24} />{story.author}</span>,
                          status: <span className="font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-700 dark:text-blue-200 shadow-sm text-base">{story.status}</span>,
                          updated: <span className="text-blue-500 dark:text-blue-300 font-mono text-base">{story.updated}</span>,
                          actions: (
                            <Dropdown label={<span className="text-blue-600 dark:text-orange-300 font-semibold">Actions</span>} compact>
                              <DropdownItem className="text-blue-700 dark:text-orange-200" compact onClick={() => setPreview(story)}>Preview</DropdownItem>
                              <DropdownItem className="text-blue-700 dark:text-orange-200" compact onClick={() => setSelected(story)}>View</DropdownItem>
                              <DropdownItem className="text-blue-700 dark:text-orange-200" compact onClick={() => handleDownload(story, 'pdf')}>
                                {downloading && downloading.id === story.id && downloading.type === 'pdf' ? <Loader size={14} className="inline-block mr-2" /> : null}
                                Download PDF
                              </DropdownItem>
                              <DropdownItem className="text-blue-700 dark:text-orange-200" compact onClick={() => handleDownload(story, 'txt')}>
                                {downloading && downloading.id === story.id && downloading.type === 'txt' ? <Loader size={14} className="inline-block mr-2" /> : null}
                                Download TXT
                              </DropdownItem>
                              <DropdownItem className="text-red-600 dark:text-pink-400 font-semibold" compact onClick={() => setShowDelete(true)}>Delete</DropdownItem>
                            </Dropdown>
                          ),
                        }))} />
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
              accept=".txt,.md"
              multiple
              label="Upload Story Files (.txt, .md)"
              onFileRead={(content, file) => showToast(`File uploaded: ${file.name}`, 'success')}
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
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title}
      >
        <p className="mb-4 text-blue-900 dark:text-blue-100">Story details for <b>{selected?.title}</b> by {selected?.author}.</p>
        <Button variant="primary" onClick={() => setSelected(null)}>
          Close
        </Button>
      </Modal>
      <Modal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete Story?"
      >
        <p className="mb-4 text-blue-900 dark:text-blue-100">Are you sure you want to delete this story? This action cannot be undone.</p>
        <div className="flex gap-2">
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
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
      <Modal
        isOpen={!!preview}
        onClose={() => setPreview(null)}
        title={preview?.title ? `Preview: ${preview.title}` : 'Preview'}
      >
        <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-900 dark:to-blue-950 rounded-xl animate-fadeIn">
          <div className="mb-2 text-sm text-blue-500 dark:text-blue-300">By {preview?.author} &middot; Status: <span className="font-semibold">{preview?.status}</span> &middot; Last updated: <span className="font-mono">{preview?.updated}</span></div>
          <div className="prose prose-blue dark:prose-invert max-w-none text-base leading-relaxed text-gray-900 dark:text-gray-100 bg-white/80 dark:bg-blue-950/80 rounded-lg p-4 shadow-inner animate-fadeIn">
            (Story preview content goes here...)
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard; 