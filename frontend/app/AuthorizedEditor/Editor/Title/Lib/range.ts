import { CaretPosition } from "./caret";
import { isBrElement, isTextNode, traverse } from "./node";

export function getCurrentRange() {
  return window.getSelection()!.getRangeAt(0)!;
}

export function setCurrentRange(range: Range) {
  const selection = window.getSelection()!;
  selection.empty();
  selection.addRange(range);
}

export function makeRange(editorEl: HTMLElement, start: CaretPosition): Range {
  const range = document.createRange();

  if (!editorEl.hasChildNodes()) {
    range.setStart(editorEl, 0);
    return range;
  }

  const children = [...editorEl.children];
  let current = 0;
  let isFinished = false;
  for (const child of children) {
    traverse(child, (node) => {
      if (isFinished) return;

      if (isTextNode(node)) {
        const length = node.textContent!.length;

        if (current + length >= start.position) {
          const offset = start.position - current;
          range.setStart(node, offset);
          isFinished = true;
        } else {
          current += length;
        }
      } else if (isBrElement(node)) {
        if (current === start.position) {
          range.setStart(node, 0);
          isFinished = true;
        }
      }
    });

    if (!isFinished) current++; // 改行
  }

  return range;
}
