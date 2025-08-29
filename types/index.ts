export interface Prompt {
  id: number;
  title: string;
  content: string;
}

export interface ApiResponse {
  success: boolean;
  data: Prompt[];
  message?: string;
}