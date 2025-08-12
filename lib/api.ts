// lib/api.ts
import axios from "axios";
import type { Note, NewNote } from "../types/note";

export interface NoteResponse {
  notes: Note[];
  totalPages: number;
}

const API_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const BASE_URL = "https://notehub-public.goit.study/api";

const instance = axios.create({
  baseURL: BASE_URL,
  headers: { Authorization: `Bearer ${API_TOKEN}` },
});

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  category?: string;
}

const cache: Record<string, NoteResponse> = {};

export async function fetchNotes(
  page = 1,
  perPage = 12,
  search = "",
  category?: string
): Promise<NoteResponse> {
  const params: FetchNotesParams = { page, perPage };
  if (search.trim()) {
    params.search = search.trim();
  }
  if (category && category.toLowerCase() !== "all") {
    params.category = category;
  }

  const cacheKey = JSON.stringify(params);

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    const { data } = await instance.get<NoteResponse>("/notes", { params });
    cache[cacheKey] = data;
    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.status === 429) {
      console.warn("429 Too Many Requests — чекаю 2с і пробую ще раз...");
      await new Promise((res) => setTimeout(res, 2000));
      const { data } = await instance.get<NoteResponse>("/notes", { params });
      cache[cacheKey] = data;
      return data;
    }
    throw err;
  }
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await instance.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(newNote: NewNote): Promise<Note> {
  const { data } = await instance.post<Note>("/notes", newNote);
  return data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const { data } = await instance.delete<Note>(`/notes/${noteId}`);
  return data;
}
