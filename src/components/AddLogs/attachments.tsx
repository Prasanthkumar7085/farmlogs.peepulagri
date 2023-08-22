import type { NextPage } from "next";
import styles from "./attachments.module.css";
const Attachments: NextPage = () => {
  return (
    <div className={styles.attachments}>
      <div className={styles.header}>
        <h4 className={styles.title}>Attachments</h4>
        <p className={styles.description}>
          You can also drag and drop files to upload them.
        </p>
      </div>
      <input className={styles.link} type="file" />
    </div>
  );
};

export default Attachments;
