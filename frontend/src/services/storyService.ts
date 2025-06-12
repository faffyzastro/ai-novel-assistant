import api from './api';
import axios from 'axios';

export interface GenerateStoryParams {
  prompt: string;
  genre: string;
  tone: string;
  length?: string;
  setting?: string;
}

export interface GenerateStoryResponse {
  status: string;
  story: string;
}

export async function generateStory(params: GenerateStoryParams): Promise<GenerateStoryResponse> {
  const response = await api.post<GenerateStoryResponse>('/api/generate', params);
  return response.data;
}

export async function generateStoryDirectly({ prompt, genre, tone }: { prompt: string; genre: string; tone: string }) {
  try {
    const url = 'https://n8nromeo123987.app.n8n.cloud/webhook-test/generate story';
    const body = { prompt, genre, tone };
    console.log('Sending POST to n8n webhook:', url, body);
    const response = await axios.post(url, body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text', // Expect plain text
    });
    console.log('n8n plain text response:', response.data);
    return response.data; // This is the story as plain text
  } catch (error: any) {
    console.error('Error from n8n webhook:', error);
    throw error.response?.data || error.message || 'Story generation failed';
  }
} 