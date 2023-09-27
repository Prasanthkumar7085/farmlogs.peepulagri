import type { NextPage } from "next";
import { useCallback } from "react";
import styles from "./side-menu1.module.css";
import { IconButton, MenuItem, MenuList, Typography } from "@mui/material";

const SideMenu1: NextPage = () => {
  const onScoutingCMenuItemck = useCallback(() => {
    // Please sync "Dashboard" to the project
  }, []);

  const onLogoutCMenuItemck = useCallback(() => {
    // Please sync "Log in " to the project
  }, []);

  return (
    <div className={styles.sideMenu} id="side-menu">
      <div className={styles.header}>
        <div className={styles.profile}  >
          <img
            className={styles.imageIcon}
            loading="lazy"
            alt=""
            src="/menu-avatar.svg"
          />
          <div className={styles.userdetails} >
            <Typography>Joseph</Typography>
            <Typography variant="h6">
              joseph.priestley@gmail.com
            </Typography>
          </div>
        </div>
        <IconButton className={styles.menuBar1} >
          <img
            alt="close-icon"
            src="/menu-close-icon.svg"
          />
        </IconButton>
      </div>
      <MenuList className={styles.menuitems}>
        <MenuItem className={styles.menuItem} >
          <img
            className={styles.apps1Icon}
            alt=""
            src="/dashboard-menu-icon.svg"
          />
          <Typography>Dashboard</Typography>
        </MenuItem>
        <MenuItem className={styles.menuItem
        }>
          <img
            className={styles.apps1Icon}
            alt="support-menu-icon"
            src="/support-menu-icon.svg"
          />
          <Typography>Support</Typography>
        </MenuItem>
        <MenuItem className={styles.menuItem}>
          <img
            className={styles.apps1Icon}
            alt="timeMenuItemne-menu-icon"
            src="/timeline-menu-icon.svg"
          />
          <Typography>Timeline View</Typography>
        </MenuItem>
        <MenuItem className={styles.menuItem} >
          <img
            className={styles.apps1Icon}
            alt="calendar-menu-icon"
            src="/calendar-menu-icon.svg"
          />
          <Typography>Calendar View</Typography>
        </MenuItem>
        <MenuItem
          className={styles.menuItem}
          id="scouting"
          onClick={onScoutingCMenuItemck}
        >
          <img
            className={styles.apps1Icon}
            alt="scouting-menu-item"
            src="/scouting-menu-item.svg"
          />
          <Typography>Scouting</Typography>
        </MenuItem>
        <MenuItem className={styles.menuItem} >
          <img
            className={styles.apps1Icon}
            alt="settings-menu-icon"
            src="/settings-menu-icon.svg"
          />
          <Typography>Settings</Typography>
        </MenuItem>
        <MenuItem className={styles.menuItem} onClick={onLogoutCMenuItemck}>
          <img
            className={styles.apps1Icon}
            alt="logout-menu-item"
            src="/logout-menu-item.svg"
          />
          <Typography>Sign Out</Typography>
        </MenuItem>
      </MenuList>
    </div>
  );
};

export default SideMenu1;
