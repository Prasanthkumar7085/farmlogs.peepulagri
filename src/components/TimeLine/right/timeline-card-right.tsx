import type { NextPage } from "next";
import styles from "./timeline-card-right.module.css";
const TimelineCardRight = ({ data1 }: any) => {

  const date = new Date(data1.to_date_time);
  const day = date.getUTCDate();
  const monthsAbbreviation = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();


  const getWorkType=(workType:string)=>{
    if(workType=='ALL'){
      return 'Manual & Machinery'
    }
    return workType?.slice(0, 1).toUpperCase() + workType?.slice(1,).toLowerCase()
  }

  return (
    <div className={styles.timelinecardright}>
      <div className={styles.container}>
        <div className={styles.date}>
          <p className={styles.day}>{day}</p>
          <p className={styles.monthyear}>{monthsAbbreviation[month]} {year}</p>
        </div>
        <div className={styles.content}>
          <img
            className={styles.imageIcon}
            alt=""
            src="/rectangle-105@2x.png"
          />
          <div className={styles.textwrapper}>
            <h5 className={styles.heading}>{data1.work_type?.length ? getWorkType(data1?.work_type) : ""}</h5>
            <p className={styles.description}>
              {data1.title}
            </p>
          </div>
        </div>
      </div>
      <img
        className={styles.connector}
        alt=""
        src="/group-36.svg"
      />
    </div>
  );
};

export default TimelineCardRight;
