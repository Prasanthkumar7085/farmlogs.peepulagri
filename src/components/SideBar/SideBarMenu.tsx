import { QueryParamsForScouting, removeUserDetails } from "@/Redux/Modules/Auth";
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
import { useCookies } from "react-cookie";
import { useState } from "react";
import GlobalSearch from "../Core/GlobalSearch/GlobalSearch";
import { storeSearchLocation } from "@/Redux/Modules/Farms";

interface ItemProps {
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

  const [, , removeCookie] = useCookies(["userType_v2"]);
  const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);
  const [globalSearchOpen, setGlobalSearchOpen] = useState<boolean>(false)
  const router = useRouter();
  const dispatch = useDispatch();

  const menuListItems = [
    {
      src: "/dashboard-icon.svg",
      link: `/farm`,
      isVisible: true,
      active:
        router.pathname.includes("/farm") &&
        !router.pathname.includes("/scouts") &&
        !router.pathname.includes("/markers"),
      toolTitle: "Farms",
    },
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
      isVisible: true,
      active: router.pathname.includes("/scouts"),
      toolTitle: "Scouts",
    },
    {
      src: "/viewTaskIcons/task-symbol-icon-sidenav.svg",
      link: "/tasks",
      isVisible: userName !== "ADMIN",
      active: router.pathname.includes("/tasks"),
      toolTitle: "Tasks",
    },
    {
      src: "/procurement-side-menu-icon.svg",
      link: "/procurements",
      isVisible: true,
      active: router.pathname.includes("/procurements"),
      toolTitle: "Procurements",
    },
    {
      src: "/location-marker.svg",
      link: "/farm/markers",
      isVisible: true,
      active: router.pathname.includes("/markers"),
      toolTitle: "Markers",
    },
    { src: '/calendaricon.svg', link: "/" },
    { src: '/graph-icon.svg', link: "/" },
  ];

  const logout = async () => {
    try {
      removeCookie("userType_v2");
      loggedIn_v2("loggedIn_v2");
      router.push("/");
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
              onClick={() => {
                router.push("/farm")
                dispatch(QueryParamsForScouting(""))

              }}
            />

            <List>
              {menuListItems.map((item: any, index: number) => {
                if (item?.isVisible) {
                  return (
                    <ListItem className={styles.menuItem} key={index}>
                      <Tooltip title={item?.toolTitle} placement="right">
                        <Link href={item?.link}>
                          <ListItemButton
                            onClick={() => {
                              dispatch(QueryParamsForScouting(""))
                              dispatch(storeSearchLocation(null))

                            }}
                            className={
                              item?.active
                                ? styles.activeMenuItem
                                : styles.inactiveMenuItem
                            }
                          >
                            <Image
                              className={styles.apps1Icon}
                              alt=""
                              src={item?.src}
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
              <ListItem className={styles.menuItem}>
                <Tooltip title="Search">
                  <IconButton
                    sx={{ display: router.pathname.includes("/scouts") ? "none" : "" }}
                    onClick={() => {
                      dispatch(storeSearchLocation(null))
                      setGlobalSearchOpen(true)
                    }}>
                    <Image src="/markers/global-search-menu-icon.svg" alt="" width={20} height={20} />
                  </IconButton>
                </Tooltip>
              </ListItem>
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
              onClick={() => {
                router.push("/profile")
                dispatch(QueryParamsForScouting(""))
                dispatch(storeSearchLocation(null))
              }}
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
      {/* <div id="mobile-view">
        {userName == "farmer" ? (
          <div style={{ width: "100%", textAlign: "center" }}>
            <Button
              sx={{
                marginTop: "3rem",
                textTransform: "capitalize",
                background: "green",
              }}
              variant={"contained"}
              onClick={() => router.push("/dashboard")}
            >
              {" "}
              <NorthWestIcon sx={{ color: "#fff", fontSize: "1.5rem" }} /> Go To
              Mobile View Page
            </Button>
          </div>
        ) : (
          <div className={styles.enableDesktop}>
            <div className={styles.noScreen}>Please! Enable desktop view</div>
            <div className={styles.noScreen}>(or)</div>
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
      </div> */}
      <GlobalSearch
        globalSearchOpen={globalSearchOpen}
        setGlobalSearchOpen={setGlobalSearchOpen}
      />
    </div>
  );
};

export default SideBarMenu;
