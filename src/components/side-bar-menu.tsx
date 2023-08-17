import type { NextPage } from "next";
import styles from "./side-bar-menu.module.css";
const SideBarMenu: NextPage = () => {
  return (
    <aside className={styles.sidebarmenu}>
      <img className={styles.logoIcon} alt="" src="/logo.svg" />
      <nav className={styles.menubar}>
        <a className={styles.dashboard}>
          <img className={styles.apps1Icon} alt="" src="/apps-1.svg" />
        </a>
        <a className={styles.support}>
          <img className={styles.apps1Icon} alt="" src="/lifering-1.svg" />
        </a>
        <a className={styles.support}>
          <img className={styles.apps1Icon} alt="" src="/route-111.svg" />
        </a>
        <a className={styles.support}>
          <img className={styles.apps1Icon} alt="" src="/settings-111.svg" />
        </a>
        <a className={styles.support}>
          <img className={styles.apps1Icon} alt="" src="/calendar-1-11.svg" />
        </a>
        <a className={styles.support}>
          <img
            className={styles.apps1Icon}
            alt=""
            src="/charthistogram-112.svg"
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
