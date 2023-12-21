import type { NextPage } from "next";
import styles from "./side-menu.module.css";
const SideMenu: NextPage = () => {
  return (
    <div className={styles.sideMenu}>
      <picture>
        <img className={styles.objectsIcon} alt="" src="/objects.svg" />
        <div className={styles.menu}>
          <div className={styles.dashboard}>
            <img className={styles.apps1Icon} alt="" src="/apps-11.svg" />
          </div>
          <div className={styles.home25}>
            <img className={styles.apps1Icon} alt="" src="/listcheck-11.svg" />
          </div>
          <div className={styles.home22}>
            <img className={styles.apps1Icon} alt="" src="/lifering-11.svg" />
          </div>
          <div className={styles.home22}>
            <img className={styles.apps1Icon} alt="" src="/route-11.svg" />
          </div>
          <div className={styles.home22}>
            <img className={styles.apps1Icon} alt="" src="/settings-11.svg" />
          </div>
          <div className={styles.home26}>
            <img className={styles.apps1Icon} alt="" src="/calendar-1-1.svg" />
          </div>
          <div className={styles.home26}>
            <img
              className={styles.apps1Icon}
              alt=""
              src="/charthistogram-11.svg"
            />
          </div>
        </div>
        <div className={styles.profileWrapper}>
          <div className={styles.profile}>
            <img
              className={styles.profileChild}
              alt=""
              src="/ellipse-41@2x.png"
            />
          </div>
        </div>
      </picture>
    </div>
  );
};

export default SideMenu;
