import type { NextPage } from "next";
import { useCallback } from "react";
import { Button, Icon } from "@mui/material";
import styles from "./add-procurement-header.module.css";
import { useRouter } from "next/router";

const AddProcurementHeader: NextPage = () => {
  const router = useRouter();
  const onBackButtonClick = useCallback(() => {
    // Please sync "table" to the project
    router.back();
  }, []);

  return (
    <div className={styles.addprocurementheader}>
      <Button
        className={styles.backbutton}
        color="primary"
        variant="contained"
        onClick={onBackButtonClick}
      >
        <img src="/arrow-left-back-white.svg" alt="" width={"18px"} />
      </Button>
      <div className={styles.textwrapper}>
        <h2 className={styles.largetext}>Add Procurement</h2>
      </div>
    </div>
  );
};

export default AddProcurementHeader;
