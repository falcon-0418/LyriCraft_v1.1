import { EditorState, SelectionState } from 'draft-js';
import { useNotes } from '@/app/AuthorizedEditor/Context/noteContext';

export const titleKeyActions = () => {
  const { editorState, setEditorState, editorRef } = useNotes();

  const onEnterPress = () => {
    const content = editorState.getCurrentContent();
    const lastBlock = content.getLastBlock();
    const lastBlockKey = lastBlock.getKey();
    const lastOffset = lastBlock.getLength();

    const newSelection = SelectionState.createEmpty(lastBlockKey).merge({
      anchorOffset: lastOffset,
      focusOffset: lastOffset,
      hasFocus: true,
    });

    const newEditorState = EditorState.forceSelection(editorState, newSelection);

    setEditorState(newEditorState);

    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  return { onEnterPress };
};
