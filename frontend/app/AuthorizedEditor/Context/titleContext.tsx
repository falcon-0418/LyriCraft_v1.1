"use client"
import { createContext, useContext, useState, useRef, FormEvent } from 'react';
import { TitleProviderProps,  TitleContextProps } from '@/app/Types/object';
import { serialize } from '../Editor/Title/Lib/text';
import { getCurrentPosition, syncUpdateContent } from '../Editor/Title/Lib/caret';
import { titleKeyActions } from '../Editor/Title/Lib/titleKeyActions';
import { useNotes } from '../Context/noteContext';
import useObserver from '../Editor/Title/Hooks/useObserver';


const TitleContext = createContext<TitleContextProps | undefined>(undefined);

export const useTitleContext = () => {
  const context = useContext(TitleContext);
  if(!context) {
    throw new Error('useTitleContext must be used within a TitleProvider');
  }
  return context;
};

export const TitleProvider = ({children}: TitleProviderProps) => {
  const [text, setText] = useState<string>("");
  const editorRef = useRef<HTMLDivElement>(null);
  const isComposingRef = useRef(false);
  const observer = useObserver(editorRef);
  const { noteId, debouncedUpdateNote, selectedNote, setNoteTitle, updateTitle } = useNotes();


  const flushChanges = () => {
    console.log('flushChanges called');
    if (!editorRef.current || !observer) return;
    console.log('Editor or observer not found, exiting flushChanges');

    const el = editorRef.current;
    console.log('flushChanges called'); // デバッグログ追加
    if (observer.isUpdated()) {
      console.log('Mutations detected'); // デバッグログ追加
      const content = serialize(el);
      if (!isComposingRef.current) { // コンポジション中でない場合のみキャレット調整を行う
        observer.runWithoutObserver(() => {
          syncUpdateContent(el, getCurrentPosition(el), () => {
            observer.rollback();
            setText(content);
            updateTitle(content);
          });
        });
      } else {
        // コンポジション中の場合はキャレット調整をスキップし、タイトルのみ更新
        setText(content);
        updateTitle(content);
      }
    } else {
      console.log('No mutations detected'); // デバッグログ追加
    }
  };

  const { onEnterPress } = titleKeyActions();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      if (isComposingRef.current) return;
      e.preventDefault();
      onEnterPress();
    }
  }

  const handleInput = (e: FormEvent) => {
    console.log('Input event triggered');

    if (!isComposingRef.current) {
      flushChanges();
    }
    handleTitleChange(e.currentTarget.textContent || "");
  }

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  }

  const handleCompositionEnd = () => {
    isComposingRef.current = false;
    flushChanges();
    console.log('Composition ended');
  }

  const handleTitleChange = (newTitle: string) => {
    console.log('Title is being updated:', newTitle); // デバッグ用
    setNoteTitle(newTitle);
    if (selectedNote) {
      debouncedUpdateNote(selectedNote.id, { title: newTitle });
    }
  };

  return (
    <TitleContext.Provider
      value={{
        text,
        setText,
        editorRef,
        onEnterPress,
        handleKeyDown,
        handleInput,
        handleCompositionStart,
        handleCompositionEnd,
        handleTitleChange
      }}>
      {children}
    </TitleContext.Provider>
  )
}