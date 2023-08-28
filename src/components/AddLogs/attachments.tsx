import type { NextPage } from "next";
import styles from "./attachments.module.css";
import { useState } from "react";
const Attachments = () => {

  const [files, setFiles] = useState<any>();

  const onChangeFile = (e: any) => {

  }
  return (
    <div className={styles.attachments}>
      <div className={styles.header}>
        <h4 className={styles.title}>Attachments</h4>
        <p className={styles.description}>
          You can also drag and drop files to upload them.
        </p>
      </div>
      <input className={styles.link} type="file" multiple onChange={onChangeFile} />
    </div>
  );
};

export default Attachments;
