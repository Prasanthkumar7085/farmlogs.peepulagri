import type { NextPage } from "next";
import { Button, Icon } from "@mui/material";
import styles from "./Header.module.css";

const ViewtaskHeader: NextPage = () => {
  return (
    <header className={styles.header}>
      <div className={styles.actions}>
        <Button
          className={styles.dotsThreeOutlineVerticalFi}
          sx={{ width: 24 }}
          color="primary"
          variant="outlined"
        />
        <Button
          className={styles.dotsThreeOutlineVerticalFi}
          sx={{ width: 24 }}
          color="primary"
          variant="outlined"
        />
      </div>
    </header>
  );
};

export default ViewtaskHeader;
