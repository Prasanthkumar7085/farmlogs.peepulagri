import type { NextPage } from "next";
import styles from "./timeline-card.module.css";
const TimelineCard = ({ data1 }: any) => {


  const date = new Date(data1.from_date_time);
  const day = date.getUTCDate();
  const monthsAbbreviation = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();

  return (
    <div className={styles.timelinecard}>

      <div className={styles.container}>
        <div className={styles.date}>
          <p className={styles.date1}>{day}</p>
          <p className={styles.daymonth}>
            <div className={styles.aug23}>{monthsAbbreviation[month]} {year}</div>
            <p>{data1?.farm_id}</p>
          </p>
        </div>
        <div className={styles.container1}>
          <img className={styles.imageIcon} alt="" src="/image@2x.png" />
          <div className={styles.text}>
            <h5 className={styles.title}>{data1.work_type}</h5>
            <p
              className={styles.description}
            >{data1.description}</p>
          </div>
        </div>
      </div>
      <div className={styles.cardlable}>
        <p className={styles.equipmentManagement}>{data1.title.length > 12 ? data1.title.slice(0, 10) + "..." : data1.title}</p>
      </div>
      <img className={styles.unionIcon} alt="" src="/union.svg" />
      <div className={styles.unionIcon}
        style={{ borderRight: "1px solid black", height: "250px", }}></div>
    </div>

  );
};

export default TimelineCard;
