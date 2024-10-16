export default class EditableObserver {
  public isDisconnected = true;

  private __target: HTMLElement;
  private __observer: MutationObserver;
  private __queue: MutationRecord[] = [];

  constructor(target: HTMLElement) {
    this.__observer = new MutationObserver((records) => {
      console.log('Mutations observed:', records);
      this.__queue.push(...records);
    });
    this.__target = target;

    this.observe();
  }

  public observe() {
    if (!this.isDisconnected) return;

    this.__observer.observe(this.__target, {
      characterData: true,
      childList: true,
      subtree: true,
      characterDataOldValue: true,
    });
    this.isDisconnected = false;
  }

  public disconnect() {
    this.__observer.disconnect();
    this.isDisconnected = true;
  }

  public isUpdated() {
    return this.__queue.length > 0;
  }

  public runWithoutObserver(callback: () => void) {
    this.disconnect();
    callback();
    this.observe();
  }

  public rollback() {
    if (!this.isDisconnected) {
      throw new Error("should disconnect before rollback");
    }

    let mutation: MutationRecord | undefined;
    while ((mutation = this.__queue.pop())) {
      if (mutation.oldValue !== null) {
        mutation.target.textContent = mutation.oldValue;
      }

      for (let i = mutation.removedNodes.length - 1; i >= 0; i--)
        mutation.target.insertBefore(
          mutation.removedNodes[i],
          mutation.nextSibling
        );

      for (let i = mutation.addedNodes.length - 1; i >= 0; i--)
        if (mutation.addedNodes[i].parentNode)
          mutation.target.removeChild(mutation.addedNodes[i]);
    }
  }
}
