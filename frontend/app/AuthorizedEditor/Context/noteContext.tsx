"use client"
import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import { axiosInstance } from '../../Components/axiosConfig';
import { NoteData, NoteProviderProps, NoteContextProps } from '../../Types/object';
import { Editor, EditorState, convertFromRaw, convertToRaw, ContentState } from 'draft-js';
import debounce from 'lodash.debounce';

const NoteContext = createContext<NoteContextProps | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
};

export const NoteProvider = ({ children }:NoteProviderProps ) => {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [noteId, setNoteId] = useState<number | null>(null);
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [selectedNote, setSelectedNote] = useState<NoteData | null>(null);
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
  const editorRef = useRef<Editor | null>(null);

  // 取得
  const fetchNotes = async () => {
    try {
      const response = await axiosInstance.get('api/v1/user/notes');
      const fetchedNotes: NoteData[] = response.data.data.map((noteItem: any) => ({
        id: parseInt(noteItem.id, 10),
        title: noteItem.attributes.title,
        body: noteItem.attributes.body,
      }));
      setNotes(fetchedNotes);

      // 最後に選択されたノートを復元
      if (typeof window !== "undefined") {
        const lastSelectedNoteId = localStorage.getItem('lastSelectedNoteId');
        if (fetchedNotes.length > 0) {
          const mostRecentNote = lastSelectedNoteId
            ? fetchedNotes.find(note => note.id.toString() === lastSelectedNoteId) || fetchedNotes[0]
            : fetchedNotes[0];
          selectNote(mostRecentNote.id);
        }
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // 作成
  const createNote = async () => {
    try {
      const response = await axiosInstance.post('api/v1/user/notes');

      const newNote = {
        id: parseInt(response.data.data.id, 10),
        title: response.data.data.attributes.title,  // バックエンドで生成されたタイトル
        body: response.data.data.attributes.body,    // バックエンドで生成された本文
      };
      setNotes([newNote, ...notes]);  // ノートリストに追加
      setSelectedNote(newNote);  // 作成したノートを選択状態にする
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  // 選択
  const selectNote = async (noteId: number) => {
    try {
      // バックエンドから指定されたノートを取得
      const response = await axiosInstance.get(`/api/v1/user/notes/${noteId}`);
      const note = response.data.data;
      setSelectedNote(note);

      try {
        const contentState = convertFromRaw(JSON.parse(note.attributes.body));
        setEditorState(EditorState.createWithContent(contentState));
      } catch (error) {
        console.error('Error parsing note body:', error);
        setEditorState(EditorState.createEmpty());
      }
      setNoteTitle(note.attributes.title);
      localStorage.setItem('lastSelectedNoteId', note.id.toString());

    } catch (error) {
      console.error('Error fetching note:', error);
    }
  };


  // 更新
  const debouncedUpdateNote = useCallback(
    debounce(async (id: number, updatedData: { title?: string; body?: string }) => {
      try {
        console.log('Updated Data:', updatedData);

        await axiosInstance.put(`/api/v1/user/notes/${id}`, {
          note: {
            title: updatedData.title || selectedNote?.title,
            body: updatedData.body || JSON.stringify(convertToRaw(editorState.getCurrentContent())),
          },
        });
        console.log('Note saved:', updatedData);
      } catch (error) {
        console.error('Error saving note:', error);
      }
    }, 1000), // 1秒のデバウンス
    [selectedNote, editorState]
  );

  // 削除
  const deleteNote = async (noteId: number) => {
    try {
      await axiosInstance.delete(`api/v1/user/notes/${noteId}`);
      setNotes(notes.filter(note => note.id !== noteId));
      setNoteId(null);
      setSelectedNote(null);

      // ノート一覧を最新化
      fetchNotes();
    } catch (error) {
      console.error("Error deleting Note!:", error);
    }
  };

  const updateTitle = (newTitle: string) => {
    if (selectedNote) {
      const updatedNote: NoteData = { ...selectedNote, title: newTitle };
      setSelectedNote(updatedNote);
      setNotes(prevNotes => prevNotes.map(note =>
        note.id === selectedNote.id ? updatedNote : note
      ));
      debouncedUpdateNote(selectedNote.id, { title: newTitle });
    }
  };

  // ボディの更新関数
  const updateBody = (newBody: string) => {
    if (selectedNote) {
      const updatedNote: NoteData = { ...selectedNote, body: newBody };
      setSelectedNote(updatedNote);
      setNotes(prevNotes => prevNotes.map(note => note.id === selectedNote.id ? updatedNote : note));
      debouncedUpdateNote(selectedNote.id, { body: newBody });
    }
  };

  const onChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const rawContent = JSON.stringify(convertToRaw(contentState));

    if (selectedNote?.id) {
      debouncedUpdateNote(selectedNote.id, { body: rawContent });
    }
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        noteId,
        setNoteId,
        noteTitle,
        setNoteTitle,
        fetchNotes,
        createNote,
        selectNote,
        selectedNote,
        debouncedUpdateNote,
        deleteNote,
        updateTitle,
        updateBody,
        editorState,
        setEditorState,
        editorRef,
        onChange
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};
