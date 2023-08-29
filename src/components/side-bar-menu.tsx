import type { NextPage } from "next";
import styles from "./side-bar-menu.module.css";
const SideBarMenu: NextPage = () => {
  return (
    <aside className={styles.sidebarmenu}>
      <img className={styles.logoIcon} alt="" src="/logo.svg" />
      <nav className={styles.menubar}>
        <a className={styles.dashboard}>
          <img className={styles.apps1Icon} alt="" src="/dashboard.svg" />
        </a>
        <a className={styles.support}>
          <img className={styles.apps1Icon} alt="" src="/support-icon.svg" />
        </a>
        <a className={styles.support}>
          <img className={styles.apps1Icon} alt="" src="/timeline-icon.svg" />
        </a>
        <a className={styles.support}>
          <img className={styles.apps1Icon} alt="" src="/settings-icon.svg" />
        </a>
        <a className={styles.support}>
          <img className={styles.apps1Icon} alt="" src="/calendaricon.svg" />
        </a>
        <a className={styles.support}>
          <img
            className={styles.apps1Icon}
            alt=""
            src="/graph-icon.svg"
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

export default SideBarMenu;
