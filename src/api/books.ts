import { api } from "./client";
import type { Book } from "../types/book";

//Recommendations
export async function getRecommendationsForUser(username: string, page: number = 1): Promise<Book[]> {
  const res = await api.get(`/recommendations/${username}`, {
    params: { page_number: page },
  });
  return res.data;
}

// search
export async function searchBooks(entry: string): Promise<Book[]> {
  const res = await api.get(`/books/search`, {
    params: { q: entry },
  });
  return res.data;
}

export async function getUserBooks(username: string): Promise<Book[]> {
  const res = await api.get(`/users/${username}/books`);
  return res.data;
}

// all books
export async function getAllBooks(): Promise<Book[]> {
  const res = await api.get(`/books/all`);
  return res.data;
}

// rate book
export async function rateBook(username: string, bookId: number, rating: number): Promise<void> {
  await api.post(`/ratings`, {
    username,
    book_id: bookId,
    rating,
  });
}

// get book rate
export async function getBookRating(username: string, bookId: number): Promise<number | null> {
  try {
    const res = await api.get(`/ratings/user/${username}/book/${bookId}`);
    return res.data.rating;
  } catch (error) {
    console.error("Error fetching book rating:", error);
    return null;
  }
}

// delete user book
export async function deleteUserBook(username: string, bookId: number): Promise<void> {
  await api.delete(`/ratings/${username}/books/${bookId}`);
}

//Recommendations
export async function getRecommendationsForUserByGenre(username: string, genre: string, page: number = 1): Promise<Book[]> {
  const res = await api.get(`/recommendations/${username}/${genre}`, {
    params: { page_number: page },
  });
  return res.data;
}
