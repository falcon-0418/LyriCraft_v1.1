import { useNotes } from "../../Context/noteContext";
import { FaRegTrashAlt } from "react-icons/fa";
import { DeleteNoteProps } from "@/app/Types/object";

const DeleteNote: React.FC<DeleteNoteProps> = ({ noteId }) => {
  const { deleteNote } = useNotes();

  return (
    <button
      className="text-gray-500 text-xs hover:bg-indigo-200 rounded p-2"
      onClick={(e) => {
      e.stopPropagation();
        if (window.confirm('本当に削除しますか？')) {
          deleteNote(noteId);
        }
      }}
    >
      <FaRegTrashAlt />
    </button>
  )
}

export default DeleteNote;