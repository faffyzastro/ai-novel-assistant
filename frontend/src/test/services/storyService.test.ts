import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportStory, createStory, updateStory, getStoryById, analyzeStoryContent } from '../../services/storyService';
import api from '../../services/api';

// Mock the api module
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Story Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('exportStory', () => {
    it('exports story as PDF', async () => {
      const mockBlob = new Blob(['test'], { type: 'application/pdf' });
      const mockResponse = {
        data: mockBlob,
        headers: {
          'content-disposition': 'attachment; filename="test.pdf"',
        },
      };

      (api.get as any).mockResolvedValue(mockResponse);

      // Mock URL.createObjectURL and document.createElement
      const mockCreateObjectURL = vi.fn();
      const mockRevokeObjectURL = vi.fn();
      const mockLink = {
        href: '',
        setAttribute: vi.fn(),
        click: vi.fn(),
        remove: vi.fn(),
      };

      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;
      document.createElement = vi.fn().mockReturnValue(mockLink);
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();

      await exportStory('123', 'pdf');

      expect(api.get).toHaveBeenCalledWith('/stories/123/export', {
        params: { format: 'pdf' },
        responseType: 'blob',
      });
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'test.pdf');
      expect(mockLink.click).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalled();
    });

    it('exports story as TXT', async () => {
      const mockBlob = new Blob(['test'], { type: 'text/plain' });
      const mockResponse = {
        data: mockBlob,
        headers: {
          'content-disposition': 'attachment; filename="test.txt"',
        },
      };

      (api.get as any).mockResolvedValue(mockResponse);

      // Mock URL.createObjectURL and document.createElement
      const mockCreateObjectURL = vi.fn();
      const mockRevokeObjectURL = vi.fn();
      const mockLink = {
        href: '',
        setAttribute: vi.fn(),
        click: vi.fn(),
        remove: vi.fn(),
      };

      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;
      document.createElement = vi.fn().mockReturnValue(mockLink);
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();

      await exportStory('123', 'txt');

      expect(api.get).toHaveBeenCalledWith('/stories/123/export', {
        params: { format: 'txt' },
        responseType: 'blob',
      });
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'test.txt');
      expect(mockLink.click).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalled();
    });
  });

  describe('createStory', () => {
    it('creates a new story', async () => {
      const storyData = {
        title: 'Test Story',
        content: 'Test content',
        projectId: '1',
      };

      const mockResponse = {
        data: { id: '123', ...storyData },
      };

      (api.post as any).mockResolvedValue(mockResponse);

      const result = await createStory(storyData);

      expect(api.post).toHaveBeenCalledWith('/stories', storyData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateStory', () => {
    it('updates an existing story', async () => {
      const storyId = '123';
      const updateData = {
        title: 'Updated Story',
        content: 'Updated content',
      };

      const mockResponse = {
        data: { id: storyId, ...updateData },
      };

      (api.put as any).mockResolvedValue(mockResponse);

      const result = await updateStory(storyId, updateData);

      expect(api.put).toHaveBeenCalledWith(`/stories/${storyId}`, updateData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getStoryById', () => {
    it('fetches a story by ID', async () => {
      const storyId = '123';
      const mockResponse = {
        data: {
          id: storyId,
          title: 'Test Story',
          content: 'Test content',
        },
      };

      (api.get as any).mockResolvedValue(mockResponse);

      const result = await getStoryById(storyId);

      expect(api.get).toHaveBeenCalledWith(`/stories/${storyId}`);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('analyzeStoryContent', () => {
    it('analyzes story content', async () => {
      const storyId = '123';
      const mockResponse = {
        data: {
          id: storyId,
          coherence_score: 8.5,
          style_score: 7.5,
          pacing_score: 9.0,
          feedback: {
            coherence: 'Good coherence',
            style: 'Nice style',
            pacing: 'Excellent pacing',
          },
        },
      };

      (api.get as any).mockResolvedValue(mockResponse);

      const result = await analyzeStoryContent(storyId);

      expect(api.get).toHaveBeenCalledWith(`/stories/${storyId}/analyze`);
      expect(result).toEqual(mockResponse.data);
    });
  });
}); 