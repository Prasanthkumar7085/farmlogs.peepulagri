import type { NextPage } from "next";
import styles from "./dropdown1.module.css";

const Dropdown1: NextPage = () => {
  return (
    <div className={styles.dropdown}>
      <div className={styles.unselectedParent}>
        <img className={styles.unselectedIcon} alt="" src="/unselected.svg" />
        <div className={styles.hint}>Chiranjeev Saifi</div>
      </div>
      <div className={styles.unselectedParent}>
        <img className={styles.unselectedIcon} alt="" src="/unselected.svg" />
        <div className={styles.hint}>Janya Datta</div>
      </div>
      <div className={styles.unselectedParent}>
        <img className={styles.unselectedIcon} alt="" src="/unselected.svg" />
        <div className={styles.hint}>Saatvik Bagi</div>
      </div>
      <div className={styles.unselectedParent}>
        <img className={styles.unselectedIcon} alt="" src="/unselected.svg" />
        <div className={styles.hint}>Khushi Lanka</div>
      </div>
      <div className={styles.unselectedParent}>
        <img className={styles.unselectedIcon} alt="" src="/unselected.svg" />
        <div className={styles.hint}>Shubham Radhakrishnan</div>
      </div>
      <div className={styles.unselectedParent}>
        <img className={styles.unselectedIcon} alt="" src="/unselected.svg" />
        <div className={styles.hint}>Lohith Sen</div>
      </div>
      <div className={styles.unselectedParent}>
        <img className={styles.unselectedIcon} alt="" src="/unselected.svg" />
        <div className={styles.hint}>Chahel Duggirala</div>
      </div>
      <div className={styles.unselectedParent}>
        <img className={styles.unselectedIcon} alt="" src="/unselected.svg" />
        <div className={styles.hint}>Anuj Dyal</div>
      </div>
      <div className={styles.unselectedParent}>
        <img className={styles.unselectedIcon} alt="" src="/unselected.svg" />
        <div className={styles.hint8}>Nihira Hegde</div>
      </div>
      <div className={styles.unselectedParent}>
        <img className={styles.unselectedIcon} alt="" src="/unselected.svg" />
        <div className={styles.hint}>Bhavbhooti Nisha</div>
      </div>
      <div className={styles.unselectedParent}>
        <img className={styles.unselectedIcon} alt="" src="/unselected.svg" />
        <div className={styles.hint}>Anuj Hadagali</div>
      </div>
    </div>
  );
};

export default Dropdown1;
