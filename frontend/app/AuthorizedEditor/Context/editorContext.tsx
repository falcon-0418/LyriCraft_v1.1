"use client"
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { EditorState, Editor, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { EditorContextProps } from '@/app/Types/object';
import { EditorProviderProps } from '@/app/Types/object';
import { NoteData } from '@/app/Types/object';
import { useNotes } from './noteContext';

const EditorContext = createContext<EditorContextProps | undefined>(undefined);

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditorContext must be used within an EditorProvider');
  }
  return context;
};

export const EditorProvider = ({ children }:EditorProviderProps) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const editorRef = useRef<Editor | null>(null);
  const { notes, noteId, debouncedUpdateNote } = useNotes();
  const [selectedNote, setSelectedNote] = useState<NoteData | undefined>(undefined);

  useEffect(() => {
    const note = notes.find((note) => note.id === noteId );
    if(note) {
      setSelectedNote(note);
      try {
        const contentState = convertFromRaw(JSON.parse(note.body))
        setEditorState(EditorState.createWithContent(contentState))
      } catch (error) {
        console.error("Failed parse the body content:", error);
        const emptyContentState = ContentState.createFromText("");
        setEditorState(EditorState.createWithContent(emptyContentState));
      }
    }
  },[noteId, notes])

  const onChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const rawContent = JSON.stringify(convertToRaw(contentState));

    if (noteId) {
      // debouncedUpdateNote を呼び出し、エディタの内容を保存
      debouncedUpdateNote(noteId, { body: rawContent });
    }
  };

  return (
    <EditorContext.Provider value={{ editorState, setEditorState, editorRef, selectedNote, setSelectedNote, onChange }}>
      {children}
    </EditorContext.Provider>
  );
};
