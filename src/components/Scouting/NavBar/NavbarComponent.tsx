
import * as React from 'react';
import Paper from '@mui/material/Paper';
import styles from "./footer.module.css";
import { useRouter } from 'next/router';
import { Button } from "@mui/material";
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { storeSearchLocation } from '@/Redux/Modules/Farms';

export default function ScoutingHeader({ children }: any) {
  const router = useRouter()
  const dispatch = useDispatch();

  return (
    <div className={styles.footer}>
      {children}
      <Paper
        className={styles.footerCard}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          borderRadius: "0 !important",
        }}
      >
        <div className={styles.navButtonList}>
          <Button
            className={
              router.pathname.includes("/dashboard")
                ? styles.navButtonActive
                : styles.navButton
            }
            onClick={() => {
              dispatch(storeSearchLocation(null))
              router.push("/dashboard")
            }}
          >
            {router.pathname.includes("/dashboard") ? (
              <Image
                src="/mobileIcons/navTabs/house-fill.svg"
                alt=""
                width={30}
                height={30}
              />
            ) : (
              <Image
                src="/mobileIcons/navTabs/dashboard-mobile.svg"
                alt=""
                width={27}
                height={27}
              />
            )}

          </Button>

          <Button
            className={
              router.pathname.includes("/farms") && !router.pathname.includes("/markers")
                ? styles.navButtonActive
                : styles.navButton
            }
            onClick={() => {
              dispatch(storeSearchLocation(null))
              router.push("/farms")
            }}
          >
            {router.pathname.includes("/farms") && !router.pathname.includes("/markers") ? (
              <Image
                src="/mobileIcons/navTabs/farms-mobile-active.svg"
                alt=""
                width={30}
                height={30}
              />
            ) : (
              <Image
                src="/mobileIcons/navTabs/farms-mobile.svg"
                alt=""
                width={27}
                height={27}
              />
            )}

          </Button>

          {/* <Button
            className={
              router.pathname.includes("/markers")
                ? styles.navButtonActive
                : styles.navButton
            }
            onClick={() => {
              dispatch(storeSearchLocation(null))
              router.push("/farms/markers")
            }}
          >
            {router.pathname.includes("/farms/markers") ? (
              <Image
                src="/mobileIcons/navTabs/marker-active.svg"
                alt=""
                width={30}
                height={30}
              />
            ) : (
              <Image
                src="/mobileIcons/navTabs/marker-notActive.svg"
                alt=""
                width={27}
                height={27}
              />
            )}

          </Button> */}


          <Button
            className={
              router.pathname.includes("/summary")
                ? styles.navButtonActive
                : styles.navButton
            }
            onClick={() => {
              dispatch(storeSearchLocation(null))
              router.push("/summary")
            }}
          >
            {router.pathname.includes("/summary") ? (
              <Image
                src="/mobileIcons/navTabs/list-dashes-fill.svg"
                width={30}
                height={30}
                alt=""
              />
            ) : (
              <Image
                src="/mobileIcons/navTabs/summary-mobile.svg"
                alt=""
                width={27}
                height={27}
              />
            )}
          </Button>
          <Button
            className={
              router.pathname.includes("/users-tasks")
                ? styles.navButtonActive
                : styles.navButton
            }
            onClick={() => {
              dispatch(storeSearchLocation(null))
              router.push("/users-tasks")
            }}
          >
            {router.pathname.includes("/users-tasks") ? (
              <Image
                src="/mobileIcons/navTabs/Task filled.svg"
                alt=""
                width={30}
                height={30}
              />
            ) : (
              <Image
                src="/mobileIcons/navTabs/Task.svg"
                alt=""
                width={27}
                height={27}
              />
            )}

          </Button>

          <Button
            className={
              router.pathname.includes("/users-procurements")
                ? styles.navButtonActive
                : styles.navButton
            }
            onClick={() => {
              dispatch(storeSearchLocation(null))
              router.push("/users-procurements")
            }}
          >
            {router.pathname.includes("/users-procurements") ? (
              <Image
                src="/mobileIcons/navTabs/procurement-active-icon.svg"
                alt=""
                width={30}
                height={30}
              />
            ) : (
              <Image
                src="/mobileIcons/navTabs/procurement-icon.svg"
                alt=""
                width={27}
                height={27}
              />
            )}

          </Button>
          <Button
            className={
              router.pathname.includes("/profile")
                ? styles.navButtonActive
                : styles.navButton
            }
            onClick={() => {
              dispatch(storeSearchLocation(null))
              router.push("/profile/user")
            }
            }
          >
            {router.pathname.includes("/profile") ? (
              <Image
                src="/mobileIcons/navTabs/user-fill.svg"
                alt=""
                width={30}
                height={30}
              />
            ) : (
              <img
                src="/mobileIcons/navTabs/profile-mobile.svg"
                alt=""
                width={27}
                height={27}
              />
            )}

          </Button>
        </div>
      </Paper>
    </div>
  );
}


