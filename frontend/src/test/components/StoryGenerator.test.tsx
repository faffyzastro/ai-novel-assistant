import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StoryGenerator from '../../components/StoryGenerator';
import { useToast } from '../../components/ui/Toast';
import { generateStory } from '../../services/storyService';

// Mock the toast context
vi.mock('../../components/ui/Toast', () => ({
  useToast: vi.fn(),
}));

// Mock the story service
vi.mock('../../services/storyService', () => ({
  generateStory: vi.fn(),
}));

describe('StoryGenerator', () => {
  const mockShowToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useToast as any).mockReturnValue({ showToast: mockShowToast });
  });

  it('renders the generator form', () => {
    render(<StoryGenerator />);

    expect(screen.getByText('Generate New Story')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your story prompt...')).toBeInTheDocument();
    expect(screen.getByText('Generate')).toBeInTheDocument();
  });

  it('handles story generation', async () => {
    const mockGeneratedStory = {
      title: 'Generated Story',
      content: 'This is a generated story',
      genre: 'Fantasy',
    };

    (generateStory as any).mockResolvedValue(mockGeneratedStory);

    render(<StoryGenerator />);

    // Fill in the prompt
    const promptInput = screen.getByPlaceholderText('Enter your story prompt...');
    fireEvent.change(promptInput, { target: { value: 'Generate a fantasy story' } });

    // Click generate button
    const generateButton = screen.getByText('Generate');
    fireEvent.click(generateButton);

    // Check loading state
    expect(screen.getByText('Generating...')).toBeInTheDocument();

    // Wait for generation to complete
    await waitFor(() => {
      expect(generateStory).toHaveBeenCalledWith({
        prompt: 'Generate a fantasy story',
      });
      expect(mockShowToast).toHaveBeenCalledWith(
        'Story generated successfully!',
        'success'
      );
    });
  });

  it('handles generation errors', async () => {
    (generateStory as any).mockRejectedValue(new Error('Generation failed'));

    render(<StoryGenerator />);

    // Fill in the prompt
    const promptInput = screen.getByPlaceholderText('Enter your story prompt...');
    fireEvent.change(promptInput, { target: { value: 'Generate a story' } });

    // Click generate button
    const generateButton = screen.getByText('Generate');
    fireEvent.click(generateButton);

    // Wait for error
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        'Failed to generate story: Generation failed',
        'error'
      );
    });
  });

  it('validates empty prompt', async () => {
    render(<StoryGenerator />);

    // Click generate button without entering prompt
    const generateButton = screen.getByText('Generate');
    fireEvent.click(generateButton);

    expect(mockShowToast).toHaveBeenCalledWith(
      'Please enter a prompt',
      'error'
    );
    expect(generateStory).not.toHaveBeenCalled();
  });

  it('handles prompt template selection', () => {
    render(<StoryGenerator />);

    // Find and click a prompt template
    const templateButton = screen.getByText('Write a dramatic opening scene.');
    fireEvent.click(templateButton);

    // Check that the prompt input is updated
    const promptInput = screen.getByPlaceholderText('Enter your story prompt...');
    expect(promptInput).toHaveValue('Write a dramatic opening scene.');
  });

  it('disables generate button while generating', async () => {
    (generateStory as any).mockImplementation(() => new Promise(() => {}));

    render(<StoryGenerator />);

    // Fill in the prompt
    const promptInput = screen.getByPlaceholderText('Enter your story prompt...');
    fireEvent.change(promptInput, { target: { value: 'Generate a story' } });

    // Click generate button
    const generateButton = screen.getByText('Generate');
    fireEvent.click(generateButton);

    // Check that button is disabled
    expect(generateButton).toBeDisabled();
    expect(screen.getByText('Generating...')).toBeInTheDocument();
  });
}); 