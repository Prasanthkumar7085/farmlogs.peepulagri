import type { NextPage } from "next";
import { useCallback } from "react";
import { Button, Icon } from "@mui/material";
import styles from "./add-procurement-header.module.css";
import { useRouter } from "next/router";

const AddProcurementHeader = ({ materialCount }: any) => {
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
        disabled={materialCount >= 1 ? true : false}
      >
        <img src="/arrow-left-back-white-black.svg" alt="" width={"18px"} />
      </Button>
      <div className={styles.textwrapper}>
        <p className={styles.backText}>Back To List</p>
        <h2 className={styles.largetext}>{router.query.procurement_id ? "Edit Procurement" : "Add Procurement"}</h2>
      </div>
    </div>
  );
};

export default AddProcurementHeader;
