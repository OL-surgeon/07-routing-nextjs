// app/notes/filter/[...slug]/Notes.client.tsx
"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import { Pagination } from "@/components/Pagination/Pagination";
import { SearchBox } from "@/components/SearchBox/SearchBox";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

import css from "../page.module.css";
import type { NoteResponse } from "@/lib/api";

interface NotesClientProps {
  initialData: NoteResponse;
  initialPage?: number;
  perPage?: number;
  initialSearch?: string;
  tag?: string | undefined; // тег для фільтрації (може бути undefined -> всі нотатки)
}

export default function NotesClient({
  initialData,
  initialPage = 1,
  perPage = 12,
  initialSearch = "",
  tag,
}: NotesClientProps) {
  const [page, setPage] = useState<number>(initialPage);
  const [search, setSearch] = useState<string>(initialSearch);
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Ключ включає тег, сторінку та пошук — кеш правильно сегментується
  const { data, isLoading, isError } = useQuery<NoteResponse, Error>({
    queryKey: ["notes", page, debouncedSearch, tag],
    queryFn: () => fetchNotes(page, perPage, debouncedSearch, tag),
    initialData,
    placeholderData: initialData,
  });

  const handlePageChange = (newPage: number) => {
    // Pagination компонент передає 1-based сторінку (за реалізацією), тому просто встановлюємо newPage
    setPage(newPage);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={css.wrapper}>
      <h1>NoteHub</h1>

      <div className={css.header}>
        <SearchBox value={search} onChange={handleSearchChange} />
        <button className={css.button} onClick={openModal}>
          Create note
        </button>
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          {}
          <NoteForm onCancel={closeModal} onSuccess={closeModal} />
        </Modal>
      )}

      {isLoading && <p className={css.centered}>Loading, please wait...</p>}
      {isError && <p className={css.centered}>Something went wrong.</p>}

      {}
      <NoteList notes={data?.notes ?? []} tag={""} />

      {data && data.totalPages > 1 && (
        <div className={css.centered}>
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
