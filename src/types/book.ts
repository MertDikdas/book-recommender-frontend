export interface Book {
  id: number;
  work_key: string;
  title: string;
  author: string;
  genre?: string;
  description?: string;
  img_cover_url?: string;
}