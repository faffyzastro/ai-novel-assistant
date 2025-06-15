import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StoryEditor from '../../pages/StoryEditor';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

// Mock the auth context
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock the toast context
vi.mock('../../components/ui/Toast', () => ({
  useToast: vi.fn(),
}));

// Mock the story service
vi.mock('../../services/storyService', () => ({
  getStoryById: vi.fn(),
  createStory: vi.fn(),
  updateStory: vi.fn(),
  exportStory: vi.fn(),
  analyzeStoryContent: vi.fn(),
}));

describe('StoryEditor', () => {
  const mockUser = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockShowToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ user: mockUser, loading: false });
    (useToast as any).mockReturnValue({ showToast: mockShowToast });
  });

  it('renders the editor with empty form for new story', () => {
    render(
      <BrowserRouter>
        <StoryEditor />
      </BrowserRouter>
    );

    expect(screen.getByText('Story Editor')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter story title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Write your story here...')).toBeInTheDocument();
  });

  it('shows loading state while fetching story', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, loading: true });
    
    render(
      <BrowserRouter>
        <StoryEditor />
      </BrowserRouter>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('handles story export', async () => {
    const { getByText } = render(
      <BrowserRouter>
        <StoryEditor />
      </BrowserRouter>
    );

    const exportPdfButton = getByText('Export as PDF');
    fireEvent.click(exportPdfButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.stringContaining('Please save the story before exporting'),
        'info'
      );
    });
  });

  it('handles story analysis', async () => {
    const { getByText } = render(
      <BrowserRouter>
        <StoryEditor />
      </BrowserRouter>
    );

    const analyzeButton = getByText('Analyze Story');
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.stringContaining('Please save the story before analyzing'),
        'info'
      );
    });
  });
}); 