import { isBrElement, isTextNode, traverse } from "./node";

export function serialize(editorEl: HTMLElement) {
  let content = "";
  traverse(editorEl, (node) => {
    if (isTextNode(node)) {
      content += node.textContent!;
    } else if (isBrElement(node)) {
      content += "\n";
    }
  });
  console.log('Serialized content:', content); 
  return content;
}

export function insertTextByIndex(prev: string, text: string, index: number) {
  return prev.slice(0, index) + text + prev.slice(index);
}

export function deleteTextByIndex(prev: string, index: number) {
  return prev.slice(0, index - 1) + prev.slice(index);
}
