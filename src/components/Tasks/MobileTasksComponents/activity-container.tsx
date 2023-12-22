import type { NextPage } from "next";
import styles from "./activity-container.module.css";
import { useState } from "react";
import { Button } from "@mui/material";
import ViewMobileLogs from "./ViewMobileLogs";
import { useRouter } from "next/router";

const ActivityContainer = () => {
  const router = useRouter();

  const [openLogs, setOpenLogs] = useState(false);
  return (
    <div className={styles.activitycontainer}>
      <Button className={styles.viewLogsBtn}

        onClick={() => setOpenLogs((prev) => !prev)}
      >
        View Logs
        <img
          src="/viewTaskIcons/logs-icon.svg"
          alt=""
          width={"15px"}
        />
      </Button>
      <ViewMobileLogs
        openLogs={openLogs}
        setOpenLogs={setOpenLogs}
        taskId={router.query.task_id as string}
      />
    </div>

  );
};

export default ActivityContainer;
