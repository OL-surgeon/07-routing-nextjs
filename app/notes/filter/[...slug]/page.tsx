import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";

type Props = {
  params: Promise<{ slug: string[] }>;
};

const NotesByCategory = async ({ params }: Props) => {
  const { slug } = await params;
  const category = slug[0].toLowerCase() === "all" ? "" : slug[0];

  const response = await fetchNotes(1, 12, "", category);

  return (
    <div>
      <h1>Notes List</h1>
      {/* Передаємо тег у NoteList як prop */}
      <NoteList notes={response.notes ?? []} tag={category} />
    </div>
  );
};

export default NotesByCategory;
