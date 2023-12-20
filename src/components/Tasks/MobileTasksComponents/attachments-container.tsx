import type { NextPage } from "next";
import styles from "./attachments-container.module.css";

const AttachmentsContainer: NextPage = () => {
  return (
    <div className={styles.attachmentscontainer}>
      <label className={styles.attachments}>Attachments</label>
      <div className={styles.files}>
        <div className={styles.attachmentsrow}>
          <img className={styles.imageIcon} alt="" src="/image@2x.png" />
          <img className={styles.imageIcon} alt="" src="/image@2x.png" />
          <img className={styles.imageIcon} alt="" src="/image@2x.png" />
          <img className={styles.imageIcon} alt="" src="/image@2x.png" />
          <img className={styles.imageIcon} alt="" src="/image@2x.png" />
          <img className={styles.imageIcon} alt="" src="/image@2x.png" />
        </div>
        <input className={styles.attachfile} type="file" />
      </div>
    </div>
  );
};

export default AttachmentsContainer;
