import CreateNoteButton from "./NoteAction/createNoteButton";
import SelectNote from "./NoteAction/selectNote";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-1/3 z-10 p-5">
      <h2>ノート一覧</h2>
      <CreateNoteButton/>
      <SelectNote/>
    </aside>
  )
}

export default Sidebar;