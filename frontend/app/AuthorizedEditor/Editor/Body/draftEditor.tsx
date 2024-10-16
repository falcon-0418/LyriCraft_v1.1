import { Editor } from 'draft-js';
import { useNotes } from '../../Context/noteContext';
import { editorKeyActions } from './Lib/editorKeyActions';
//import styles from './editor.module.css'


const DraftEditor: React.FC = () => {
  const {editorState, onChange, editorRef} = useNotes();
  const { handleKeyCommand, keyBindingFn } = editorKeyActions();

    return (
        <div className="public-DraftEditor-content">
          <Editor
            editorState={editorState}
            onChange={onChange}
            placeholder="ここから入力を行ってください。"
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={keyBindingFn}
            ref={editorRef}
          />
        </div>
    )
};

export default DraftEditor;

//