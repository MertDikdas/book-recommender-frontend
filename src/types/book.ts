export interface Book {
  id: number;
  work_key: string;
  title: string;
  author: string;
  genre?: string;
  description?: string;
  cover_url?: string;
}