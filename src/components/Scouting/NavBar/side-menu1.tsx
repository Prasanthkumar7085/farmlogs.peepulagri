import type { NextPage } from "next";
import { useCallback } from "react";
import styles from "./side-menu1.module.css";

const SideMenu1: NextPage = () => {
  const onScoutingClick = useCallback(() => {
    // Please sync "Dashboard" to the project
  }, []);

  const onLogoutClick = useCallback(() => {
    // Please sync "Log in " to the project
  }, []);

  return (
    <div className={styles.sideMenu} id="side-menu">
      <div className={styles.header} id="header">
        <div className={styles.profile} id="profile">
          <img
            className={styles.imageIcon}
            loading="lazy"
            alt=""
            src="/avatar.svg"
          />
          <div className={styles.userdetails} id="user-details">
            <div className={styles.joseph}>Joseph</div>
            <div className={styles.josephpriestleygmailcom}>
              joseph.priestley@gmail.com
            </div>
          </div>
        </div>
        <div className={styles.menuBar1} id="close">
          <img
            className={styles.close11}
            alt="close-icon"
            src="/close-icon.svg"
          />
        </div>
      </div>
      <div className={styles.menuitems}>
        <div className={styles.dashboard} id="dashboard">
          <img
            className={styles.apps1Icon}
            id="dashboard"
            alt=""
            src="/dashboard-menu-icon.svg"
          />
          <div className={styles.timelineView}>Dashboard</div>
        </div>
        <div className={styles.support} id="support">
          <img
            className={styles.apps1Icon}
            alt="support-menu-icon"
            src="/support-menu-icon.svg"
          />
          <div className={styles.timelineView}>Support</div>
        </div>
        <div className={styles.support} id="timeline">
          <img
            className={styles.apps1Icon}
            alt="timeline-menu-icon"
            src="/timeline-menu-icon.svg"
          />
          <div className={styles.timelineView}>Timeline View</div>
        </div>
        <div className={styles.support} id="calendar">
          <img
            className={styles.apps1Icon}
            alt="calendar-menu-icon"
            src="/calendar-menu-icon.svg"
          />
          <div className={styles.timelineView}>Calendar View</div>
        </div>
        <div
          className={styles.scouting}
          id="scouting"
          onClick={onScoutingClick}
        >
          <img
            className={styles.apps1Icon}
            alt="scouting-menu-item"
            src="/scouting-menu-item.svg"
          />
          <div className={styles.timelineView}>Scouting</div>
        </div>
        <div className={styles.support} id="settings">
          <img
            className={styles.apps1Icon}
            alt="settings-menu-icon"
            id="settings-menu-icon"
            src="/settings-menu-icon.svg"
          />
          <div className={styles.timelineView}>Settings</div>
        </div>
        <div className={styles.scouting} id="logout" onClick={onLogoutClick}>
          <img
            className={styles.apps1Icon}
            alt="logout-menu-item"
            src="/logout-menu-item.svg"
          />
          <div className={styles.timelineView}>Sign Out</div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu1;
