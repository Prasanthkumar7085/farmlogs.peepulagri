import type { NextPage } from "next";
import styles from "./tabs.module.css";
import { useRouter } from "next/router";
import { Button } from "@mui/material";

const Tabs = ({ onStatusChange }: { onStatusChange: (value: any) => void }) => {
  const router = useRouter();

  return (
    <div className={styles.tabsgroup}>
      <Button
        className={
          !router.query.status ? styles.todoButtonActive : styles.todoButton
        }
        onClick={() => onStatusChange("ALL")}
      >
        All
      </Button>
      <Button
        className={
          router.query.status === "TO-START"
            ? styles.todoButtonActive
            : styles.todoButton
        }
        onClick={() => onStatusChange("TO-START")}
      >
        To Start
      </Button>

      <Button
        className={
          router.query.status === "INPROGRESS"
            ? styles.todoButtonActive
            : styles.todoButton
        }
        onClick={() => onStatusChange("INPROGRESS")}
      >
        Inprogress
      </Button>
      <Button
        className={
          router.query.status === "DONE"
            ? styles.todoButtonActive
            : styles.todoButton
        }
        onClick={() => onStatusChange("DONE")}
      >
        Done
      </Button>
      <Button
        className={
          router.query.status === "PENDING"
            ? styles.todoButtonActive
            : styles.todoButton
        }
        onClick={() => onStatusChange("PENDING")}
      >
        Pending
      </Button>
      <Button
        className={
          router.query.status === "OVER-DUE"
            ? styles.todoButtonActive
            : styles.todoButton
        }
        onClick={() => onStatusChange("OVER-DUE")}
      >
        Overdue
      </Button>
    </div>
  );
};

export default Tabs;
