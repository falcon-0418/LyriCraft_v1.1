import { ReactNode } from 'react';
import { EditorProvider } from './Context/editorContext';
import { NoteProvider } from './Context/noteContext';
import { TitleProvider } from './Context/titleContext';

export default function EditorLayout({ children }: { children: ReactNode }) {
  return (
    <NoteProvider>
      <EditorProvider>
        <TitleProvider>
          {children}
        </TitleProvider>
      </EditorProvider>
    </NoteProvider>
  );
}
