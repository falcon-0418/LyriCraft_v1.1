import { useTitleContext } from "../../Context/titleContext";
import styles from "./title.module.css";
import Content from "./content";

 const Title: React.FC = () => {
  const {
    text,
    editorRef,
    handleKeyDown,
    handleInput,
    handleCompositionStart,
    handleCompositionEnd,
  } = useTitleContext();

  return (
    <div
      className={`${styles.title} ${text.trim() === "" ? styles.empty : ""}`}
      contentEditable="true"
      data-placeholder="New Title"
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      ref={editorRef}
      suppressContentEditableWarning
      onCompositionStart={handleCompositionStart}  // IME入力開始時の処理
      onCompositionEnd={handleCompositionEnd}
    >
      {text.trim() !== "" && <Content content={text} />}
    </div>
  );
}

export default Title;