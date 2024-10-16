import DraftEditor from "./Body/draftEditor";
import Title from "./Title/title";

interface MyEditorProps {}

const MyEditor: React.FC<MyEditorProps> = () => {

  return(
    <div className="w-full">
      <Title/>
      <DraftEditor/>
    </div>
  )
}

export default MyEditor;