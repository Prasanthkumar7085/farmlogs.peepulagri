import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import LogoutIcon from '@mui/icons-material/Logout';
import NorthWestIcon from '@mui/icons-material/NorthWest';
import { Button, IconButton, Tooltip } from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import styles from "./side-bar-menu.module.css";
import { Logout } from "@mui/icons-material";
import Link from "next/link";

interface item {
  src: string;
  link: string;
  isVisible: boolean;
  active: boolean;
  toolTitle: string;
}

const SideBarMenu = ({ children }: any) => {
  const userName = useSelector(
    (state: any) => state.auth.userDetails?.user_details?.user_type
  );
  const router = useRouter();
  const dispatch = useDispatch();

  const menuListItems = [
    {
      src: "/dashboard-icon.svg",
      link: `/farm`,
      isVisible: userName !== "ADMIN",
      active: router.pathname.includes("/farm"),
      toolTitle: "Farms",
    },
    // {
    //   src: "/support-icon.svg",
    //   link: "/support",
    //   isVisible: true,
    //   active: router.pathname.includes("/support"),
    //   toolTitle: "Support",
    // },
    // {
    //   src: "/timeline-icon.svg",
    //   link: "/timeline",
    //   isVisible: userName !== "ADMIN",
    //   active: router.pathname.includes("/timeline"),
    //   toolTitle: "Time Line",
    // },
    {
      src: "/scout-menu-icon.svg",
      link: "/scouts",
      isVisible: userName !== "ADMIN",
      active: router.pathname.includes("/scouts"),
      toolTitle: "Scouts",
    },
    // {
    //   src: "/tasks-menu-icon.svg",
    //   link: "/tasks",
    //   isVisible: userName !== "ADMIN",
    //   active: router.pathname.includes("/tasks"),
    //   toolTitle: "Tasks",
    // },
    // { src: '/calendaricon.svg', link: "/" },
    // { src: '/graph-icon.svg', link: "/" },
  ];

  const logout = async () => {
    try {
      const responseUserType = await fetch("/api/remove-cookie");
      if (responseUserType) {
        const responseLogin = await fetch("/api/remove-cookie");
        if (responseLogin.status) {
          router.push("/");
        } else throw responseLogin;
      }
      await dispatch(removeUserDetails());
      await dispatch(deleteAllMessages());
    } catch (err: any) {
      console.error(err);
    }
  };
  return (
    <div>
      <div id={"web-dashboard"}>
        <aside className={styles.sidebarmenu}>
          <nav className={styles.menubar}>
            <Image
              className={styles.logoIcon}
              alt=""
              src="/logo.svg"
              width={20}
              height={20}
              onClick={() => router.push("/farm")}
            />
            <List>
              {menuListItems.map((item: item, index: number) => {
                if (item.isVisible) {
                  return (
                    <ListItem className={styles.menuItem} key={index}>
                      <Tooltip title={item.toolTitle} placement="right">
                        <Link href={item.link}>
                          <ListItemButton
                            // onClick={() => router.push(item.link)}
                            className={
                              item.active
                                ? styles.activeMenuItem
                                : styles.inactiveMenuItem
                            }
                          >
                            <Image
                              className={styles.apps1Icon}
                              alt=""
                              src={item.src}
                              width={20}
                              height={20}
                            />
                          </ListItemButton>
                        </Link>
                      </Tooltip>
                    </ListItem>
                  );
                }
              })}
            </List>
          </nav>
          <div className={styles.profileBtnGroup}>
            <Tooltip title="Logout">
              <IconButton onClick={logout}>
                <LogoutIcon sx={{ color: "white" }} />
              </IconButton>
            </Tooltip>

            <button
              className={styles.profile}
              onClick={() => router.push("/profile")}
            >
              <div className={styles.profile1}>
                <Image
                  src={"/user-avatar.svg"}
                  className={styles.profileChild}
                  alt=""
                  width={20}
                  height={20}
                />
              </div>
            </button>
          </div>
        </aside>
        <div className={styles.main}>{children}</div>
      </div>
      <div id="mobile-view">
        {userName == "USER" ? (
          <div style={{ width: "100%", textAlign: "center" }}>
            <Button
              sx={{
                marginTop: "3rem",
                textTransform: "capitalize",
                background: "green",
              }}
              variant={"contained"}
              onClick={() => router.push("/farms")}
            >
              {" "}
              <NorthWestIcon sx={{ color: "#fff", fontSize: "1.5rem" }} /> Go To
              Mobile View Page
            </Button>
          </div>
        ) : (
          <div className={styles.enableDesktop}>
            <div className={styles.noScreen}>Please! Enable desktop view</div>
            <Button
              className={styles.logout}
              variant={"outlined"}
              onClick={logout}
            >
              <Logout />
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBarMenu;
