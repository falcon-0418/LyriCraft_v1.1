import { RefObject, useLayoutEffect, useState } from "react";
import EditableObserver from "../Lib/observer";


export default function useObserver(editorRef: RefObject<HTMLElement>) {
  const [observer, setObserver] = useState<EditableObserver>();

  useLayoutEffect(() => {
    if (!editorRef.current) return;

    setObserver(new EditableObserver(editorRef.current));
  }, [editorRef]);

  return observer;
}
