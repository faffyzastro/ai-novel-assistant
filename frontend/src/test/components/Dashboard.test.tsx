import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { getStories, deleteStory, exportStory } from '../../services/storyService';

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
  getStories: vi.fn(),
  deleteStory: vi.fn(),
  exportStory: vi.fn(),
}));

describe('Dashboard', () => {
  const mockUser = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockStories = [
    {
      id: '1',
      title: 'Test Story 1',
      synopsis: 'Test synopsis 1',
      genre: 'Fantasy',
      status: 'draft',
      projectId: '1',
      createdAt: '2024-03-20T00:00:00.000Z',
      updatedAt: '2024-03-20T00:00:00.000Z',
    },
    {
      id: '2',
      title: 'Test Story 2',
      synopsis: 'Test synopsis 2',
      genre: 'Sci-Fi',
      status: 'in_progress',
      projectId: '1',
      createdAt: '2024-03-20T00:00:00.000Z',
      updatedAt: '2024-03-20T00:00:00.000Z',
    },
  ];

  const mockShowToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ user: mockUser, loading: false });
    (useToast as any).mockReturnValue({ showToast: mockShowToast });
    (getStories as any).mockResolvedValue(mockStories);
  });

  it('renders the dashboard with stories', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Check for main elements
    expect(screen.getByText('All Stories')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search stories...')).toBeInTheDocument();

    // Wait for stories to load
    await waitFor(() => {
      expect(screen.getByText('Test Story 1')).toBeInTheDocument();
      expect(screen.getByText('Test Story 2')).toBeInTheDocument();
    });
  });

  it('shows loading state while fetching stories', () => {
    (getStories as any).mockImplementation(() => new Promise(() => {}));
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('handles story deletion', async () => {
    (deleteStory as any).mockResolvedValue(undefined);
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Wait for stories to load
    await waitFor(() => {
      expect(screen.getByText('Test Story 1')).toBeInTheDocument();
    });

    // Click delete button for first story
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // Confirm deletion
    const confirmButton = screen.getByText('Delete');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(deleteStory).toHaveBeenCalledWith('1');
      expect(mockShowToast).toHaveBeenCalledWith(
        'Story deleted successfully',
        'success'
      );
    });
  });

  it('handles story export', async () => {
    (exportStory as any).mockResolvedValue(undefined);
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Wait for stories to load
    await waitFor(() => {
      expect(screen.getByText('Test Story 1')).toBeInTheDocument();
    });

    // Click actions dropdown for first story
    const actionButtons = screen.getAllByText('Actions');
    fireEvent.click(actionButtons[0]);

    // Click export PDF
    const exportPdfButton = screen.getByText('Download PDF');
    fireEvent.click(exportPdfButton);

    await waitFor(() => {
      expect(exportStory).toHaveBeenCalledWith('1', 'pdf');
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.stringContaining('exported as PDF successfully'),
        'success'
      );
    });
  });

  it('filters stories by search term', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Wait for stories to load
    await waitFor(() => {
      expect(screen.getByText('Test Story 1')).toBeInTheDocument();
    });

    // Search for "Fantasy"
    const searchInput = screen.getByPlaceholderText('Search stories...');
    fireEvent.change(searchInput, { target: { value: 'Fantasy' } });

    // Check that only the fantasy story is shown
    expect(screen.getByText('Test Story 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Story 2')).not.toBeInTheDocument();
  });

  it('handles file upload', async () => {
    const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Find file input
    const fileInput = screen.getByLabelText('Upload Story Files (.txt, .md, .pdf)');
    
    // Upload file
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.stringContaining('Uploading file: test.txt'),
        'info'
      );
    });
  });

  it('redirects to login if not authenticated', () => {
    (useAuth as any).mockReturnValue({ user: null, loading: false });
    
    const { container } = render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(container.innerHTML).toContain('min-h-screen flex items-center justify-center');
  });
}); 