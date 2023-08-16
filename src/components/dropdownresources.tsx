import type { NextPage } from "next";
import styles from "./dropdownresources.module.css";

type DropdownresourcesType = {
  onClose?: () => void;
};

const Dropdownresources: NextPage<DropdownresourcesType> = ({ onClose }) => {
  return (
    <div className={styles.dropdownresources}>
      <div className={styles.content}>
        <div className={styles.text}>Select Farm</div>
      </div>
      <div className={styles.content1}>
        <div className={styles.text}>Farm - 1</div>
      </div>
      <div className={styles.content2}>
        <div className={styles.text}>Farm - 2</div>
      </div>
      <div className={styles.content2}>
        <div className={styles.text}>Farm - 3</div>
      </div>
      <div className={styles.content2}>
        <div className={styles.text}>Farm - 4</div>
      </div>
      <div className={styles.content2}>
        <div className={styles.text}>Farm - 5</div>
      </div>
      <div className={styles.content2}>
        <div className={styles.text}>Farm - 6</div>
      </div>
    </div>
  );
};

export default Dropdownresources;
