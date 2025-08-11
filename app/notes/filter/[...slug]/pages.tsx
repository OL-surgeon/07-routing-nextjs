// app/notes/filter/[...slug]/page.tsx

import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{ slug: string[] }>;
};

const NotesByCategory = async ({ params }: Props) => {
  const { slug } = await params;
  const category = slug[0] === "All" ? "" : slug[0];
  const response = await fetchNotes(1, 12, category);
  console.log("Fetched notes response:", response);
  return (
    <div>
      <h1>Notes List</h1>
      <NoteList notes={response?.notes ?? []} />
    </div>
  );
};

export default NotesByCategory;
