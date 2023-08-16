import type { NextPage } from "next";
import styles from "./dropdown.module.css";

type DropdownType = {
  onClose?: () => void;
};

const Dropdown: NextPage<DropdownType> = ({ onClose }) => {
  return (
    <div className={styles.dropdown}>
      <div className={styles.content}>
        <div className={styles.checkbox}>
          <div className={styles.background} />
        </div>
        <div className={styles.text}>Select All</div>
      </div>
      <div className={styles.content}>
        <div className={styles.checkbox}>
          <div className={styles.background} />
        </div>
        <div className={styles.text}>Machinery</div>
      </div>
      <div className={styles.content}>
        <div className={styles.checkbox}>
          <div className={styles.background} />
        </div>
        <div className={styles.text}>Manual</div>
      </div>
    </div>
  );
};

export default Dropdown;
