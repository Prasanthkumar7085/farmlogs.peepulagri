import type { NextPage } from "next";
import styles from "./timeline-card-right.module.css";
import timePipe from "@/pipes/timePipe";
import { Chip } from "@mui/material";
import { CategoriesType } from "@/types/categoryTypes";
import { GetLogByIdResponseDataType } from "@/types/logsTypes";
const TimelineCardRight = ({ data, categoriesList }: { data: GetLogByIdResponseDataType, categoriesList: Array<CategoriesType> }) => {


  const categoriesColors: Array<string> = [
    "#E57373",
    "#66BB6A",
    "#64B5F6",
    "#FFD54F",
    "#AB47BC",
    "#AED581",
    "#9575CD",
    "#FF8A65",
    "#FFD700",
    "#FF80AB",
    "#26A69A",
    "#4CAF50",
    "#42A5F5",
    "#FFB74D",
    "#FF5722",
    "#78909C",
  ];

  const getWorkType=(workType:string)=>{
    if(workType=='ALL'){
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

  const setBackColor = (item: any) => {
    let index = categoriesList.findIndex((categoryItem: CategoriesType, index: number) => item == categoryItem.slug);
    if (categoriesColors[index])
      return categoriesColors[index];
    return '#a4a6a9'

  }

  return (
    <div className={styles.timelinecardright}>
      <div className={styles.container}>
        <div className={styles.date}>
          <p className={styles.day}>{timePipe(data?.to_date_time?.slice(0, 10), 'DD')}</p>
          <p className={styles.monthyear}>{timePipe(data?.to_date_time?.slice(0, 10), 'MMM YYYY')}</p>
        </div>
        <div className={styles.content}>
          <img
            className={styles.imageIcon}
            alt=""
            src="/rectangle-105@2x.png"
          />
          <div className={styles.textwrapper}>
            <h5 className={styles.heading}>{data.work_type?.length ? getWorkType(data?.work_type) : ""}</h5>
            <p className={styles.description}>
              {data.title}
            </p>
          </div>
        </div>
      </div>
      <div  className={styles.categoriesAdded}>
        {data && data?.categories?.length && data?.categories?.map((item: any, index: number) => {
          return (
            <Chip className={styles.categoryChip} label={getItemLabel(item)} key={index} sx={{ backgroundColor: setBackColor(item), color: "white" }} />
          )
        })}
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
