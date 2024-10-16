import { Fragment } from "react";

import styles from "./Title.module.css";

type Props = {
  content: string;
};

export default function Content({ content }: Props) {
  const lines = content.split("\n");

  return (
    <>
      {lines.map((line, i) => {
        return (
          <Fragment key={i}>
            {line.startsWith("#") ? (
              <h1 className={styles.heading}>{line}</h1>
            ) : line !== "" ? (
              <p className={styles.text}>{line}</p>
            ) : (
              <p className={styles.text}>
                <br />
              </p>
            )}
          </Fragment>
        );
      })}
    </>
  );
}
