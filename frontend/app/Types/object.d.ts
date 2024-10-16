import { ReactNode } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface NoteData {
  id: number;
  title: string;
  body: string;
}

export interface NoteContextProps {
  notes: NoteData[];
  noteId: number | null;
  setNoteId: (id: number | null) => void;
  noteTitle;
  setNoteTitle;
  debouncedUpdateNote
  fetchNotes: () => void;
  createNote;
  selectNote;
  selectedNote;
  deleteNote;
  updateTitle;
  updateBody;
  editorState;
  setEditorState;
  editorRef;
  onChange;
}

interface DeleteNoteProps {
  noteId: number;
}

export interface NoteProviderProps {
  children: ReactNode;
}

export interface EditorContextProps {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  editorRef: React.RefObject<Editor>;
  selectedNote: NoteData | undefined;
  setSelectedNote: React.Dispatch<React.SetStateAction<NoteData | undefined>>;
  onChange: (newEditorState: EditorState) => void;
}

export interface EditorProviderProps {
  children: ReactNode;
}

export interface TitleContextProps {
  text: string;
  setText: (text: string) => void;
  editorRef: React.RefObject<HTMLDivElement>;
  onEnterPress: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  handleInput: (e: FormEvent) => void;
  handleCompositionEnd: () => void;
  handleCompositionStart: () => void;
  handleTitleChange;
}

export interface TitleProviderProps {
  children: ReactNode;
}