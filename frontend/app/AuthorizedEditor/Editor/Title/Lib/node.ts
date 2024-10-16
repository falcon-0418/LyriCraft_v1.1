export function isElement(node: Node): node is Element {
    return node.nodeType === Node.ELEMENT_NODE;
  }

  export function isTextNode(node: Node) {
    return node.nodeType === Node.TEXT_NODE;
  }

  export function isBrElement(node: Node): node is HTMLBRElement {
    return isElement(node) && node.tagName === "BR";
  }

  export function traverse(root: Node, callback: (node: Node) => void) {
    callback(root);

    for (const node of root.childNodes) {
      traverse(node, callback);
    }
  }
