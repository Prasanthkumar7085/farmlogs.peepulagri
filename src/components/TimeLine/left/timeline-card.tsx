import type { NextPage } from "next";
import styles from "./timeline-card.module.css";
import { Chip } from "@mui/material";
const TimelineCard = ({ data1 }: any) => {

  const date = new Date(data1.to_date_time);
  const day = date.getUTCDate();
  const monthsAbbreviation = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();

  const getWorkType = (workType: string) => {
    if (workType == 'ALL') {
      return 'Manual & Machinery'
    }
    return workType?.slice(0, 1).toUpperCase() + workType?.slice(1,).toLowerCase()
  }

  return (
    <div className={styles.timelinecard}>

      <div className={styles.container}>
        <div className={styles.date}>
          <p className={styles.date1}>{day}</p>
          <div className={styles.daymonth}>
            <div className={styles.aug23}>{monthsAbbreviation[month]} {year}</div>
          </div>
        </div>
        <div className={styles.container1}>
          <img className={styles.imageIcon} alt="" src="/image@2x.png" />
          <div className={styles.text}>
            <h5 className={styles.title}>{data1.work_type?.length ? getWorkType(data1?.work_type) :""}</h5>
            <p
              className={styles.description}
            >{data1.title}</p>
          </div>
        </div>
      </div>
      {/* <div className={styles.cardlable}>
        <p className={styles.equipmentManagement}>{data1.title.length > 12 ? data1.title.slice(0, 10) + "..." : data1.title}</p>
      </div> */}
      <div style={{ display: "flex", flexWrap: "wrap" }}>

        {data1 && data1?.categories?.length && data1?.categories?.map((item: any, index: number) => {
          return (
            <Chip label={item} key={index} />
          )
        })}
      </div>
      <img className={styles.unionIcon} alt="" src="/union.svg" />
      <div className={styles.unionIcon}
        style={{ borderRight: "1px solid black", height: "250px", }}></div>
    </div>

  );
};

export default TimelineCard;
