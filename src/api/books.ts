import { api } from "./client";
import type { Book } from "../types/book";

//Recommendations
export async function getRecommendationsForUser(username: string): Promise<Book[]> {
  const res = await api.get(`/recommendations/${username}`);
  return res.data;
}

// search
export async function searchBooks(entry: string): Promise<Book[]> {
  const res = await api.get(`/books/search`, {
    params: { q: entry },
  });
  return res.data;
}

// all books
export async function getAllBooks(): Promise<Book[]> {
  const res = await api.get(`/books/all`);
  return res.data;
}
