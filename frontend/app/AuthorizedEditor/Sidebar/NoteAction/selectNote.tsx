import { useNotes } from "../../Context/noteContext";
import DeleteNote from "./deleteNote";

const SelectNote: React.FC = () => {
  const { notes, selectNote } = useNotes();

  return (
    <div>
      <ul>
        {notes.map(note => (
          <li
            key={note.id}
            className={`text-gray-500 mb-1 p-2 flex justify-between items-center`}
            onClick={() => selectNote(note.id)}
          >
            {note.title || "New Title"}
            <DeleteNote noteId={note.id}/>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectNote;