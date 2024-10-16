import { useNotes } from "../../Context/noteContext";

const CreateNoteButton: React.FC = () => {
  const { createNote } = useNotes();

  const handleCreateNote = async () => {
    try {
      await createNote();
    } catch (error) {
      console.error( "error creating note:", error);
    }
  };

  return (
    <button
      className="text-xl rounded-full bg-indigo-500 hover:bg-indigo-400 text-white px-2 py-0.25 mr-1 mt-14"
      onClick={handleCreateNote}
    >
      +
    </button>
  );
};

export default CreateNoteButton;