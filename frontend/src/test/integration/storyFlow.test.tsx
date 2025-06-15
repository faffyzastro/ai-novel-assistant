import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard';
import StoryEditor from '../../pages/StoryEditor';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { getStories, createStory, updateStory, exportStory, analyzeStoryContent } from '../../services/storyService';

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
  createStory: vi.fn(),
  updateStory: vi.fn(),
  exportStory: vi.fn(),
  analyzeStoryContent: vi.fn(),
}));

describe('Story Flow Integration', () => {
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

  it('completes full story creation and editing flow', async () => {
    // Mock initial stories list
    (getStories as any).mockResolvedValue([]);
    
    // Mock story creation
    const mockCreatedStory = {
      id: '1',
      title: 'New Story',
      content: 'Initial content',
      genre: 'Fantasy',
      status: 'draft',
    };
    (createStory as any).mockResolvedValue(mockCreatedStory);

    // Mock story update
    const mockUpdatedStory = {
      ...mockCreatedStory,
      content: 'Updated content',
    };
    (updateStory as any).mockResolvedValue(mockUpdatedStory);

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/story/:id/edit" element={<StoryEditor />} />
        </Routes>
      </BrowserRouter>
    );

    // Create new story
    const newStoryButton = screen.getByText('New Story');
    fireEvent.click(newStoryButton);

    // Fill in story details
    const titleInput = screen.getByPlaceholderText('Enter story title');
    const contentInput = screen.getByPlaceholderText('Write your story here...');
    
    fireEvent.change(titleInput, { target: { value: 'New Story' } });
    fireEvent.change(contentInput, { target: { value: 'Initial content' } });

    // Save story
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(createStory).toHaveBeenCalledWith({
        title: 'New Story',
        content: 'Initial content',
        genre: 'Fantasy',
      });
      expect(mockShowToast).toHaveBeenCalledWith(
        'Story saved successfully',
        'success'
      );
    });

    // Edit story
    fireEvent.change(contentInput, { target: { value: 'Updated content' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateStory).toHaveBeenCalledWith('1', {
        content: 'Updated content',
      });
      expect(mockShowToast).toHaveBeenCalledWith(
        'Story updated successfully',
        'success'
      );
    });
  });

  it('completes story export flow', async () => {
    // Mock initial stories list
    (getStories as any).mockResolvedValue([{
      id: '1',
      title: 'Test Story',
      content: 'Test content',
      genre: 'Fantasy',
      status: 'draft',
    }]);

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/story/:id/edit" element={<StoryEditor />} />
        </Routes>
      </BrowserRouter>
    );

    // Wait for story to load
    await waitFor(() => {
      expect(screen.getByText('Test Story')).toBeInTheDocument();
    });

    // Click actions dropdown
    const actionButton = screen.getByText('Actions');
    fireEvent.click(actionButton);

    // Export as PDF
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

  it('completes story analysis flow', async () => {
    // Mock initial stories list
    (getStories as any).mockResolvedValue([{
      id: '1',
      title: 'Test Story',
      content: 'Test content',
      genre: 'Fantasy',
      status: 'draft',
    }]);

    // Mock analysis response
    const mockAnalysis = {
      coherence_score: 8.5,
      style_score: 7.5,
      pacing_score: 9.0,
      feedback: {
        coherence: 'Good coherence',
        style: 'Nice style',
        pacing: 'Excellent pacing',
      },
    };
    (analyzeStoryContent as any).mockResolvedValue(mockAnalysis);

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/story/:id/edit" element={<StoryEditor />} />
        </Routes>
      </BrowserRouter>
    );

    // Wait for story to load
    await waitFor(() => {
      expect(screen.getByText('Test Story')).toBeInTheDocument();
    });

    // Click actions dropdown
    const actionButton = screen.getByText('Actions');
    fireEvent.click(actionButton);

    // Click analyze button
    const analyzeButton = screen.getByText('Analyze');
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(analyzeStoryContent).toHaveBeenCalledWith('1');
      expect(screen.getByText('Story Analysis')).toBeInTheDocument();
      expect(screen.getByText('Good coherence')).toBeInTheDocument();
    });
  });
}); 