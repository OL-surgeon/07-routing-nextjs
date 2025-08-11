"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import { Pagination } from "@/components/Pagination/Pagination";
import { SearchBox } from "@/components/SearchBox/SearchBox";

import css from "../page.module.css";
import type { NoteResponse } from "@/lib/api";

interface NotesClientProps {
  page: number;
  perPage: number;
  search: string;
  initialData: NoteResponse;
}

export default function NotesClient({
  page: initialPage,

  search: initialSearch,
  initialData,
}: NotesClientProps) {
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch] = useDebounce(search, 500);
  const [, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery<NoteResponse>({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes(),
    initialData,
    placeholderData: initialData,
  });

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage + 1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleOpenModal = () => setIsModalOpen(true);

  return (
    <div className={css.wrapper}>
      <h1>NoteHub</h1>

      <div className={css.header}>
        <SearchBox value={search} onChange={handleSearchChange} />
        <button className={css.button} onClick={handleOpenModal}>
          Create note
        </button>
      </div>

      {isLoading && <p className={css.centered}>Loading, please wait...</p>}
      {isError && <p className={css.centered}>Something went wrong.</p>}

      {data?.notes && data.notes.length > 0 && <NoteList notes={data.notes} />}

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
