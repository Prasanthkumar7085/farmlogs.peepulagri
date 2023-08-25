import type { NextPage } from "next";
import styles from "./side-bar-menu1.module.css";
const SideBarMenu1: NextPage = () => {
  return (
    <aside className={styles.sidebarmenu}>
      <img className={styles.logoIcon} alt="" src="/logo1.svg" />
      <nav className={styles.menubar}>
        <a className={styles.dashboard}>
          <img className={styles.apps1Icon} alt="" src="/apps-1.svg" />
        </a>
        <a className={styles.support}>
          <img className={styles.apps1Icon} alt="" src="/lifering-1.svg" />
        </a>
        <a className={styles.timeline}>
          <img className={styles.apps1Icon} alt="" />
        </a>
        <a className={styles.support}>
          <img className={styles.apps1Icon} alt="" src="/settings-12.svg" />
        </a>
        <a className={styles.support}>
          <img className={styles.apps1Icon} alt="" src="/calendar-1-12.svg" />
        </a>
        <a className={styles.support}>
          <img
            className={styles.apps1Icon}
            alt=""
            src="/charthistogram-111.svg"
          />
        </a>
      </nav>
      <button className={styles.profile}>
        <div className={styles.profile1}>
          <img className={styles.profileChild} alt="" />
        </div>
      </button>
    </aside>
  );
};

export default SideBarMenu1;
