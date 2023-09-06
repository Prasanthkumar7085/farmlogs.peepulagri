import type { NextPage } from "next";
import styles from "./timeline-card-right.module.css";
const TimelineCardRight = ({ data1 }: any) => {

  const date = new Date(data1.from_date_time);
  const day = date.getUTCDate();
  const monthsAbbreviation = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();


  return (
    <div className={styles.timelinecardright}>
      <div className={styles.container}>
        <div className={styles.date}>
          <p className={styles.date1}>{day}</p>
          <div className={styles.monthyear}>
            <p className={styles.date1}>{monthsAbbreviation[month]} {year}</p>
            <p>{data1?.farm_id}</p>

          </div>
        </div>
        <div className={styles.container1}>
          <img
            className={styles.imageIcon}
            alt=""
            src="/rectangle-105@2x.png"
          />
          <div className={styles.textwrapper}>
            <h5 className={styles.heading}>{data1.work_type}</h5>
            <p className={styles.description}>
              {data1.description}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.cardlable}>
        <p className={styles.weeding}>{data1?.title?.length > 12 ? data1?.title?.slice(0, 10) + "..." : data1.title}</p>
      </div>
      <img
        className={styles.timelinecardrightChild}
        alt=""
        src="/group-36.svg"
      />
      <div className={styles.timelinecardrightChild}
        style={{ borderLeft: "1px solid black", height: "250px", }}></div>

    </div>
  );
};

export default TimelineCardRight;
