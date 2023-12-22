import type { NextPage } from "next";
import { Button, Icon, IconButton, Typography } from "@mui/material";
import styles from "src/components/Tasks/MobileTasksComponents/componentsHeader.module.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from "next/router";

const ViewtaskHeader = () => {
  const router = useRouter();
  return (
    <header className={styles.header}>
      <div className={styles.actions}>
        <IconButton

          onClick={() => router.back()}
        ><img alt=""
          src="/arrowdownbold-1@2x.png" width="24px" /> </IconButton>
        <p className={styles.headerTitle}>View Task</p>
        <IconButton
        ><MoreVertIcon sx={{ color: "#fff" }} /></IconButton>
      </div>


    </header>
  );
};

export default ViewtaskHeader;
