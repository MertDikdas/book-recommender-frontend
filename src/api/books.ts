import { api } from "./client";
import type { Book } from "../types/book";

// 🔥 DOĞRU RECOMMENDATION ENDPOINT
export async function getRecommendationsForUser(username: string): Promise<Book[]> {
  const res = await api.get(`/recommendations/${username}`);
  return res.data;
}

// 🔍 Kitap arama (swagger'a göre)
export async function searchBooks(bookName: string): Promise<Book[]> {
  const res = await api.get(`/books/${bookName}`);
  return res.data;
}
