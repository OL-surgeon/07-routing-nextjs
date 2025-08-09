// app/notes/page.tsx
// "use client"

// import NoteList from "@/components/NoteList/NoteList";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

const Notes = async () => {
  const response = await fetchNotes();

  return (
    <section>
      {/* <h1>Notes List</h1>
      <NoteList notes={response?.notes ?? []} /> */}
      <NotesClient page={1} perPage={12} search="" initialData={response} />
    </section>
  );
};

export default Notes;
