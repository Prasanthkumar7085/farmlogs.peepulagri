import type { NextPage } from "next";
import { useCallback } from "react";
import styles from "./side-menu1.module.css";
import { IconButton, MenuItem, MenuList, Typography } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/router";
import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import CancelIcon from '@mui/icons-material/Cancel';
import { resetOtpCountDown } from "@/Redux/Modules/Otp";
import { setToInitialState } from "@/Redux/Modules/Farms";

const SideMenu1 = ({ toggleDrawer }: any) => {

  const router = useRouter();
  const dispatch = useDispatch();

  const mobile = useSelector((state: any) => state.auth.userDetails?.user_details?.phone);

  const onScoutingCMenuItemck = useCallback(() => {
    // Please sync "Dashboard" to the project
  }, []);

  const onLogoutCMenuItemck = async () => {
    try {
      const responseUserType = await fetch('/api/remove-cookie');
      if (responseUserType) {
        const responseLogin = await fetch('/api/remove-cookie');
        if (responseLogin.status) {
          router.push('/');
        } else throw responseLogin;
      }
      await dispatch(removeUserDetails());
      await dispatch(deleteAllMessages());
      await dispatch(resetOtpCountDown());
      await dispatch(setToInitialState());

    } catch (err: any) {
      console.error(err);
    }
  }

  return (
    <div className={styles.sideMenu} >
      <div id={styles.sideMenu}>

        <div className={styles.menuBarDiv}>
          <IconButton className={styles.menuBar1} onClick={() => toggleDrawer(false)}>
            <img
              alt="close-icon"
              src="/menu-close-icon.svg"
            />
          </IconButton>
        </div>
        <div className={styles.profile}  >
          <img
            className={styles.imageIcon}
            loading="lazy"
            alt=""
            src="/menu-avatar.svg"
          />
          <div className={styles.userdetails} >
            <Typography>Profile</Typography>
            <Typography variant="h6">
              {mobile ? mobile : ""}
            </Typography>
          </div>
        </div>

        <MenuList className={styles.menuitems}>
          <MenuItem className={styles.menuItem} onClick={() => { router.push("/farms"); toggleDrawer(false); }}>
            <img
              className={styles.apps1Icon}
              alt=""
              src="/dashboard-menu-icon.svg"
            />
            <Typography>Dashboard</Typography>
          </MenuItem>
          {/* <MenuItem className={styles.menuItem}>
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
          </MenuItem> */}
          {/* <MenuItem
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
          </MenuItem> */}
          {/* <MenuItem className={styles.menuItem} >
            <img
              className={styles.apps1Icon}
              alt="settings-menu-icon"
              src="/settings-menu-icon.svg"
            />
            <Typography>Settings</Typography>
          </MenuItem> */}
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
    </div>
  );
};

export default SideMenu1;
