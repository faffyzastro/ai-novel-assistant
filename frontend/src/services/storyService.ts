import api from './api';
import axios from 'axios';

export interface Story {
  id: string;
  title: string;
  synopsis?: string;
  genre?: string;
  status?: 'draft' | 'in_progress' | 'completed';
  projectId: string;
  createdAt: string;
  updatedAt: string;
  coherence_score?: number;
  style_score?: number;
  pacing_score?: number;
  feedback?: { coherence: string; style: string; pacing: string };
  content?: string; // Assuming stories will have content
}

export interface StoryAnalysisReport {
  id: string;
  title: string;
  coherence_score: number;
  style_score: number;
  pacing_score: number;
  feedback: { coherence: string; style: string; pacing: string };
}

export interface GenerateStoryParams {
  prompt: string;
  genre: string;
  tone: string;
  length?: string;
  setting?: string;
}

// Generate a story using the backend LLM gateway
export async function generateStory(params: GenerateStoryParams): Promise<string> {
  const response = await api.post<string>('/llm/generate', { prompt: params.prompt });
  return response.data;
}

// CRUD operations for Stories
export async function createStory(storyData: Partial<Story>): Promise<Story> {
  const response = await api.post<Story>('/stories', storyData);
  return response.data;
}

export async function getStories(params?: any): Promise<Story[]> {
  const response = await api.get<Story[]>('/stories', { params });
  return response.data;
}

export async function getStoryById(id: string): Promise<Story> {
  const response = await api.get<Story>(`/stories/${id}`);
  return response.data;
}

export async function updateStory(id: string, storyData: Partial<Story>): Promise<Story> {
  const response = await api.put<Story>(`/stories/${id}`, storyData);
  return response.data;
}

export async function deleteStory(id: string): Promise<void> {
  await api.delete(`/stories/${id}`);
}

// Story Analysis and Reporting
export async function analyzeStoryContent(id: string): Promise<StoryAnalysisReport> {
  const response = await api.get<StoryAnalysisReport>(`/stories/${id}/analyze`);
  return response.data;
}

export async function getStoryAnalysisReport(id: string): Promise<StoryAnalysisReport> {
  const response = await api.get<StoryAnalysisReport>(`/stories/${id}/report`);
  return response.data;
}

// File Upload and Text Extraction
export async function uploadAndExtractFile(file: File): Promise<{ extractedText: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<{ extractedText: string }>('/stories/upload-and-extract', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

// Export story content
export async function exportStory(id: string, format: 'pdf' | 'txt'): Promise<void> {
  const response = await api.get(`/stories/${id}/export`, {
    params: { format },
    responseType: 'blob', // Important for file downloads
  });

  // Create a blob URL and trigger download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  // Get filename from response headers if available, otherwise construct
  const contentDisposition = response.headers['content-disposition'];
  let filename = `story.${format}`;
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1];
    }
  }
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
} 