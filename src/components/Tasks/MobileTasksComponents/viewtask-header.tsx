import type { NextPage } from "next";
import { Button, Icon, IconButton } from "@mui/material";
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
          // className={styles.dotsThreeOutlineVerticalFi}
          // sx={{ width: 24 }}
          // color="primary"
          // variant="outlined"
          onClick={() => router.back()}
        ><ArrowBackIcon /> </IconButton>
        <IconButton
        // className={styles.dotsThreeOutlineVerticalFi}
        // sx={{ width: 24 }}
        // color="primary"
        // variant="outlined"
        ><MoreVertIcon /></IconButton>
      </div>
    </header>
  );
};

export default ViewtaskHeader;
