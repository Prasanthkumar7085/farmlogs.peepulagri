import type { NextPage } from "next";
import styles from "./timeline-card.module.css";
import { Chip } from "@mui/material";
import timePipe from "@/pipes/timePipe";
import { GetLogByIdResponseDataType } from "@/types/logsTypes";
import { CategoriesType } from "@/types/categoryTypes";
const TimelineCard = ({ data, categoriesList }: { data: GetLogByIdResponseDataType, categoriesList: Array<CategoriesType> }) => {

  const getWorkType = (workType: string) => {
    if (workType == 'ALL') {
      return 'Manual & Machinery'
    }
    return workType?.slice(0, 1).toUpperCase() + workType?.slice(1,).toLowerCase()
  }

  const getItemLabel = (item: string) => {
    //finding the object in the categories API using slug(item)
    const titleObject: CategoriesType | undefined = categoriesList.find((listItem: CategoriesType) => listItem.slug == item);
    if (titleObject) {
      return titleObject.category;
    } else return '';
  }

  return (
    <div className={styles.timelinecard}>

      <div className={styles.container}>
        <div className={styles.date}>
          <p className={styles.day}>{timePipe(data?.to_date_time, 'DD')}</p>
          <p className={styles.monthyear}>{timePipe(data?.to_date_time, 'MMM YYYY')}</p>
        </div>
        <div className={styles.content}>
          <img className={styles.imageIcon} alt="Thumbnail" src="/image@2x.png" />
          <div className={styles.text}>
            <h5 className={styles.title}>{data.work_type?.length ? getWorkType(data?.work_type) : ""}</h5>
            <p
              className={styles.description}
            >{data.title}</p>
          </div>
        </div>
      </div>
      {/* <div className={styles.cardlable}>
        <p className={styles.equipmentManagement}>{data.title.length > 12 ? data.title.slice(0, 10) + "..." : data.title}</p>
      </div> */}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {data && data?.categories?.length && data?.categories?.map((item: any, index: number) => {
          return (
            <Chip label={getItemLabel(item)} key={index} />
          )
        })}
      </div>
      <img className={styles.connector} alt="" src="/union.svg" />
    </div>

  );
};

export default TimelineCard;
