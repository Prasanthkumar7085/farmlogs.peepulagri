import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import styles from "./task-card.module.css";
import ListHeader from "./list-header";
import Tabs from "./tabs";
import Header1 from "./header1";
import { addSerial } from "@/pipes/addSerial";
import getAllTasksService from "../../../../lib/services/TasksService/getAllTasksService";
import { prepareURLEncodedParamsWithArray } from "../../../../lib/requestUtils/urlEncoderWithArray";
import { FarmInTaskType } from "@/types/tasksTypes";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { Avatar } from "@mui/material";
import moment from 'moment';



const TaskCard = ({ data, lastBookElementRef, hasMore, lastItemRef }: any) => {
  const router = useRouter();




  return (
    <div style={{
      padding: "0 1rem",
      height: "calc(100vh - 140px)",
      overflowY: "auto",
      marginTop: "2rem"
    }}>

      {data?.length && data?.map((item: any, index: any) => {
        if (data.length === index + 1 && hasMore == true) {
          return (
            <div className={styles.taskCard} onClick={() => router.push(`/users-tasks/${item._id}/view`)} key={index} ref={lastBookElementRef}>
              <div className={styles.contentcontainer}>
                <div className={styles.row}>
                  <h2 className={styles.title}>{item.title}</h2>
                  <div className={styles.duedatecontainer}>
                    <img
                      className={styles.calendarBlank1Icon}
                      alt=""
                      src="/calendarblank-1@2x.png"
                    />
                    <p className={styles.duedate}>{moment(item.deadline).format('DD-MM-YYYY')}</p>
                  </div>
                </div>
                <div className={styles.farmdetails}>
                  <h3 className={styles.farmname}>SpiceVine Gardens</h3>
                  <div className={styles.profile}>
                    <h1 className={styles.jj}>
                      <Avatar sx={{ fontSize: "6px", width: "18px", height: "18px", background: "#d94841" }} >
                        {item?.created_by?.name?.split(' ')?.length > 1 ? `${item?.created_by?.name?.split(' ')[0][0]}${item?.created_by?.name?.split(' ')[1][0]}`.toUpperCase() : item?.created_by?.name.slice(0, 2)?.toUpperCase()}
                      </Avatar>
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        else {
          return (
            <div className={styles.taskCard} onClick={() => router.push(`/users-tasks/${item._id}/view`)} key={index}
              ref={index === data.length - 15 ? lastItemRef : null}
            >
              <div className={styles.contentcontainer}>
                <div className={styles.row}>
                  <h2 className={styles.title}>{item.title}</h2>
                  <div className={styles.duedatecontainer}>
                    <img
                      className={styles.calendarBlank1Icon}
                      alt=""
                      src="/calendarblank-1@2x.png"
                    />
                    <p className={styles.duedate}>{moment(item.deadline).format('DD-MM-YYYY')}</p>
                  </div>
                </div>
                <div className={styles.farmdetails}>
                  <h3 className={styles.farmname}>SpiceVine Gardens</h3>
                  <div className={styles.profile}>
                    <h1 className={styles.jj}>
                      <Avatar sx={{ fontSize: "6px", width: "18px", height: "18px", background: "#d94841" }} >
                        {item?.created_by?.name?.split(' ')?.length > 1 ? `${item?.created_by?.name?.split(' ')[0][0]}${item?.created_by?.name?.split(' ')[1][0]}`.toUpperCase() : item?.created_by?.name.slice(0, 2)?.toUpperCase()}
                      </Avatar>
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      })}
    </div>
  );
};

export default TaskCard;
