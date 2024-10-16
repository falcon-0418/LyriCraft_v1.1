import { getDefaultKeyBinding } from 'draft-js';
import { useNotes } from '@/app/AuthorizedEditor/Context/noteContext';
import { useTitleContext } from '@/app/AuthorizedEditor/Context/titleContext';

export const editorKeyActions = () => {
  const { editorState } = useNotes();
  const { editorRef: titleRef } = useTitleContext();

    // エディターの現在のコンテンツが空かどうかを判定する関数
  const isEditorEmpty = () => {  // 現在のブロックが空かどうかのチェック
    const content = editorState.getCurrentContent();
    const blockMap = content.getBlockMap();
    const firstBlock = content.getFirstBlock();

    if (blockMap.size === 1 && firstBlock.getText() === '') {
      return true;
    }
    return false;
  };

  const handleKeyCommand = (command: string) => {
    if (command === 'backspace') {
      const currentSelection = editorState.getSelection();
      const startKey = currentSelection.getStartKey();
      const startOffset = currentSelection.getStartOffset();
      const content = editorState.getCurrentContent();
      const firstBlock = content.getFirstBlock();
      const firstBlockKey = firstBlock.getKey();

      if (isEditorEmpty() && startKey === firstBlockKey && startOffset === 0 ) {
        if (titleRef.current) {
          titleRef.current.focus();
        }
        return 'handled'; // カスタム動作
      }
    }
    return 'not-handled'; // デフォルト動作
  };

  const keyBindingFn = (e: React.KeyboardEvent<{}>) => {
    if (e.key === 'Backspace') {
      return 'backspace';
    }
    return getDefaultKeyBinding(e);
  };

  return { handleKeyCommand, keyBindingFn };
};
