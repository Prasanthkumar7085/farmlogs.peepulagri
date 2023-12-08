import type { NextPage } from "next";
import styles from "./dropdown.module.css";

const Dropdown: NextPage = () => {
  return (
    <div className={styles.dropdown}>
      <div className={styles.hint}>Farm-1</div>
      <div className={styles.hint}>Farm-2</div>
      <div className={styles.hint}>Farm-3</div>
      <div className={styles.hint}>Farm-4</div>
      <div className={styles.hint}>Farm-5</div>
    </div>
  );
};

export default Dropdown;
