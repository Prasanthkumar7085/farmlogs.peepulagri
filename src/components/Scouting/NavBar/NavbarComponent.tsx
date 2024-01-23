
import * as React from 'react';
import Paper from '@mui/material/Paper';
import styles from "./footer.module.css";
import { useRouter } from 'next/router';
import { Button } from "@mui/material";
import Image from 'next/image';

export default function ScoutingHeader({ children }: any) {
  const router = useRouter()
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
            onClick={() => router.push("/dashboard")}
          >
            {router.pathname.includes("/dashboard") ? (
              <Image
                src="/mobileIcons/navTabs/house-fill.svg"
                alt=""
                width={23}
                height={23}
              />
            ) : (
              <Image
                src="/mobileIcons/navTabs/dashboard-mobile.svg"
                alt=""
                width={20}
                height={20}
              />
            )}

          </Button>

          <Button
            className={
              router.pathname.includes("/farms")
                ? styles.navButtonActive
                : styles.navButton
            }
            onClick={() => router.push("/farms")}
          >
            {router.pathname.includes("/farms") ? (
              <Image
                src="/mobileIcons/navTabs/farms-mobile-active.svg"
                alt=""
                width={23}
                height={23}
              />
            ) : (
              <Image
                src="/mobileIcons/navTabs/farms-mobile.svg"
                alt=""
                width={20}
                height={20}
              />
            )}

          </Button>

          <Button
            className={
              router.pathname.includes("/users-tasks")
                ? styles.navButtonActive
                : styles.navButton
            }
            onClick={() => router.push("/users-tasks")}
          >
            {router.pathname.includes("/users-tasks") ? (
              <Image
                src="/mobileIcons/navTabs/Task filled.svg"
                alt=""
                width={23}
                height={23}
              />
            ) : (
              <Image
                src="/mobileIcons/navTabs/Task.svg"
                alt=""
                width={20}
                height={20}
              />
            )}

          </Button>

          <Button
            className={
              router.pathname.includes("/summary")
                ? styles.navButtonActive
                : styles.navButton
            }
            onClick={() => router.push("/summary")}
          >
            {router.pathname.includes("/summary") ? (
              <Image
                src="/mobileIcons/navTabs/list-dashes-fill.svg"
                width={23}
                height={23}
                alt=""
              />
            ) : (
              <Image
                src="/mobileIcons/navTabs/summary-mobile.svg"
                alt=""
                width={20}
                height={20}
              />
            )}
          </Button>


          <Button
            className={
              router.pathname.includes("/users-procurements")
                ? styles.navButtonActive
                : styles.navButton
            }
            onClick={() => router.push("/users-procurements")}
          >
            {router.pathname.includes("/users-procurements") ? (
              <Image
                src="/mobileIcons/navTabs/procurement-active-icon.svg"
                alt=""
                width={23}
                height={23}
              />
            ) : (
              <Image
                src="/mobileIcons/navTabs/procurement-icon.svg"
                alt=""
                width={20}
                height={20}
              />
            )}

          </Button>
          <Button
            className={
              router.pathname.includes("/profile")
                ? styles.navButtonActive
                : styles.navButton
            }
            onClick={() => router.push("/profile/user")}
          >
            {router.pathname.includes("/profile") ? (
              <Image
                src="/mobileIcons/navTabs/user-fill.svg"
                alt=""
                width={23}
                height={23}
              />
            ) : (
              <img
                src="/mobileIcons/navTabs/profile-mobile.svg"
                alt=""
                width={20}
                height={20}
              />
            )}

          </Button>
        </div>
      </Paper>
    </div>
  );
}


