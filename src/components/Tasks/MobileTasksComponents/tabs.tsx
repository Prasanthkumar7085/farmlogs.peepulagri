import type { NextPage } from "next";
import styles from "./tabs.module.css";
import { useRouter } from "next/router";

const Tabs = ({ onStatusChange }: any) => {
  const router = useRouter();

  return (
    <div className={styles.tabs}>

      <img className={styles.tabsChild} alt="" src="/line-20@2x.png" />
      <div className={styles.tabsgroup}>
        <div className={!(router.query.status) ? styles.todoButtonActive : styles.todoButton}>
          <p className={!(router.query.status) ? styles.todoButtonActive : styles.todoButton} onClick={() => onStatusChange("ALL")}>All</p>
          {/* <div className={styles.count}>
          <p className={styles.p}>16</p>
        </div> */}
        </div>
        <div className={router.query.status === 'TO-START' ? styles.todoButtonActive : styles.todoButton}>
          <p className={router.query.status === 'TO-START' ? styles.todoButtonActive : styles.todoButton} onClick={() => onStatusChange("TO-START")}>To Start</p>
          {/* <div className={styles.count1}>
            <p className={styles.p}>4</p>
          </div> */}
        </div>
        <div className={router.query.status === 'INPROGRESS' ? styles.todoButtonActive : styles.todoButton}>
          <p className={router.query.status === 'INPROGRESS' ? styles.todoButtonActive : styles.todoButton} onClick={() => onStatusChange("INPROGRESS")}>Inprogress</p>
          {/* <div className={styles.count1}>
            <p className={styles.p}>5</p>
          </div> */}
        </div>
        <div className={router.query.status === 'DONE' ? styles.todoButtonActive : styles.todoButton}>
          <p className={router.query.status === 'DONE' ? styles.todoButtonActive : styles.todoButton} onClick={() => onStatusChange("DONE")}>Done</p>
          {/* <div className={styles.count1}>
            <p className={styles.p}>7</p>
          </div> */}
        </div>
        <div className={router.query.status === 'PENDING' ? styles.todoButtonActive : styles.todoButton}>
          <p className={router.query.status === 'PENDING' ? styles.todoButtonActive : styles.todoButton} onClick={() => onStatusChange("PENDING")}>Pending</p>
          {/* <div className={styles.count1}>
            <p className={styles.p}>0</p>
          </div> */}
        </div>
        <div className={router.query.status === 'OVER-DUE' ? styles.todoButtonActive : styles.todoButton}>
          <p className={router.query.status === 'OVER-DUE' ? styles.todoButtonActive : styles.todoButton} onClick={() => onStatusChange("OVER-DUE")}>Overdue</p>
          {/* <div className={styles.count1}>
            <p className={styles.p}>0</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
