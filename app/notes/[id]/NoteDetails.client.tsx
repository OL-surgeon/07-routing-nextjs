// "use client";
// import { useQuery } from "@tanstack/react-query";
// import { useParams } from "next/navigation";
// import { fetchNoteById } from "@/lib/api";

// const NoteDetailsClient = () => {
//   const { id } = useParams<{ id: string }>();
//   const {
//     data: note,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["note", id],
//     queryFn: () => fetchNoteById(id),
//     refetchOnMount: false,
//   });

//   if (isLoading) return <p>Loading, please wait...</p>;
//   if (error || !note) return <p>Something went wrong.</p>;

//   return (
//     <div>
//       <div>
//         <div>
//           <h2>{note.title}</h2>
//         </div>
//         <p>{note.content}</p>
//         <p>{note.createdAt}</p>
//       </div>
//     </div>
//   );
// };

// export default NoteDetailsClient;

"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import { Note } from "@/types/note";

type Props = {
  id: string;
  initialData?: Note;
};

const NoteDetailsClient = ({ id, initialData }: Props) => {
  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    initialData,
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading...</p>;

  if (error || !note) return <p>Some error..</p>;

  const formattedDate = note.updatedAt
    ? `Updated at: ${note.updatedAt}`
    : `Created at: ${note.createdAt}`;

  return (
    <div>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <p>{note.createdAt}</p>
      <p>{formattedDate}</p>
    </div>
  );
};

export default NoteDetailsClient;
