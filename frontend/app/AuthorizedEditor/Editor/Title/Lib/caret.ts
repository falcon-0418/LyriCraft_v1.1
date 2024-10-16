import { flushSync } from "react-dom";
import { isBrElement, isTextNode, traverse } from "./node";
import { getCurrentRange, setCurrentRange, makeRange } from "./range";

export class CaretPosition {
  readonly position: number;

  constructor(position: number) {
    if (position < 0) throw new Error("position must be greater than 0");
    this.position = position;
  }

  add(n: number) {
    return new CaretPosition(this.position + n);
  }
}

export function getCurrentPosition(editorEl: HTMLElement) {
  const range = getCurrentRange();

  const children = [...editorEl.childNodes];
  let current = 0;
  let isFinished = false;
  for (const child of children) {
    traverse(child, (node) => {
      if (isFinished) return;

      isFinished = node === range.startContainer;
      if (isTextNode(node)) {
        const length = node.textContent!.length;
        current += isFinished ? range.startOffset : length;
      } else if (isBrElement(node)) {
        // do nothing
      }
    });

    if (!isFinished) current++; // 改行
  }

  return new CaretPosition(current);
}

export function syncUpdateContent(
  editorEl: HTMLElement,
  nextPosition: CaretPosition,
  callback: () => void
) {
  flushSync(callback);
  setCurrentRange(makeRange(editorEl, nextPosition));
}
