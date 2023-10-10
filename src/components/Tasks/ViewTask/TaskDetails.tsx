import { TaskResponseTypes } from "@/types/tasksTypes";
import styles from "./TaskDetails.module.css";
import timePipe from "@/pipes/timePipe";

interface PropsType {
  data: TaskResponseTypes | null | undefined;
}
const TaskDetails: React.FC<PropsType> = ({ data }) => {
  return (
    <div className={styles.cardDetails}>
      <div className={styles.idandStatus}>
        <div className={styles.title}>
          <label className={styles.label}>Title</label>
          <h1 className={styles.landPreparation}>
            {data?.title ? data?.title : "-"}
          </h1>
        </div>
        <div className={styles.status}>
          <label className={styles.label1}>Status</label>
          <div className={styles.status1}>
            <img
              className={styles.indicatorIcon}
              alt=""
              src="/indicator@2x.png"
            />
            <p className={styles.status2}>
              {data?.status ? data?.status : "-"}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.date}>
        <div className={styles.response}>
          <label className={styles.responseDate}>Due Date</label>
          <div className={styles.responseDate1}>
            <p className={styles.text}>
              {data?.deadline ? timePipe(data?.deadline, "DD, MMM YYYY") : "-"}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.description}>
        <label className={styles.lable}>Description</label>
        <p className={styles.farmersPrepareThe}>
          {data?.description ? data?.description : "-"}
        </p>
      </div>
    </div>
  );
};

export default TaskDetails;
