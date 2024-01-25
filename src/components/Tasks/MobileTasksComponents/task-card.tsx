import { Avatar, AvatarGroup, dividerClasses } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import styles from "./task-card.module.css";
import { useState } from "react";

const TaskCard = ({ data, lastBookElementRef, hasMore, lastItemRef, loading }: any) => {
  const router = useRouter();

  const [statusOptions] = useState<Array<{ value: string; title: string }>>([
    { value: "TO-START", title: "To-Start" },
    { value: "INPROGRESS", title: "In-Progress" },
    { value: "DONE", title: "Done" },
    { value: "OVER-DUE", title: "Over-due" },
  ]);

  const getItemTitle = (status: string) => {
    return statusOptions?.find(
      (item: { value: string; title: string }) => status == item?.value
    )?.title;
  };

  return (
    <div className={styles.allTaskCardsBlock}>
      {data?.length ? (
        data?.map((item: any, index: any) => {
          if (data.length === index + 1 && hasMore == true) {
            return (
              <div
                className={styles[item.status]}
                id={styles.taskCard}
                onClick={() => router.push(`/users-tasks/${item._id}/view`)}
                key={index}
                ref={lastBookElementRef}
              >
                <div className={styles.contentcontainer}>
                  <div className={styles.row}>
                    <h2 className={styles.title}>
                      {item?.title
                        ? item?.title?.length > 25
                          ? item?.title?.slice(0, 1).toUpperCase() +
                          item?.title?.slice(1, 22) +
                          "..."
                          : item?.title[0].toUpperCase() + item?.title?.slice(1)
                        : "ty"}
                    </h2>
                    <div className={styles.duedatecontainer} style={{ backgroundColor: item?.isOverdue ? "#ffd5d2" : "lightgray", padding: '4px 6px 4px 6px', borderRadius: "4px" }}>
                      <img
                        className={styles.calendarBlank1Icon}
                        alt=""
                        src="/calendarblank-1@2x.png"
                      />
                      <p className={styles.duedate} style={{ color: item?.isOverdue ? "red" : "black" }}>
                        {moment(item.deadline).format("DD-MM-YYYY")}
                      </p>
                    </div>
                  </div>
                  <div className={styles.farmdetails}>
                    <h3 id={styles[item.status]}>
                      {getItemTitle(item?.status)}
                    </h3>


                    <AvatarGroup sx={{
                      '& .MuiAvatar-root': {
                        fontSize: "10px !important",
                        width: "22px !important",
                        height: "22px !important",
                        background: "#d94841 !important",
                      }
                    }} total={item?.assign_to?.length} max={3}>
                      {item?.assign_to?.map((assignee: any, assigneeindex: any) => {
                        return (
                          <Avatar sx={{
                            fontSize: "10px",
                            width: "22px",
                            height: "22px",
                            background: "#d94841",

                          }} key={assigneeindex} >
                            {assignee?.name?.split(" ")?.length > 3
                              ? `${assignee?.name?.split(" ")[0][0]}${assignee?.name?.split(" ")[1][0]}`.toUpperCase()
                              : assignee?.name.slice(0, 2)?.toUpperCase()}
                          </Avatar>
                        );
                      })}
                    </AvatarGroup>

                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div
                className={styles[item.status]}
                id={styles.taskCard}
                onClick={() => router.push(`/users-tasks/${item._id}/view`)}
                key={index}
                ref={index === data.length - 15 ? lastItemRef : null}
              >
                <div className={styles.contentcontainer}>
                  <div className={styles.row}>
                    <h2 className={styles.title}>
                      {item?.title
                        ? item?.title?.length > 25
                          ? item?.title?.slice(0, 1).toUpperCase() +
                          item?.title?.slice(1, 22) +
                          "..."
                          : item?.title[0].toUpperCase() +
                          item?.title?.slice(1)
                        : "ty"}
                    </h2>
                    <div className={styles.duedatecontainer} style={{ backgroundColor: item?.isOverdue ? "#ffd5d2" : "lightgray", padding: '4px 6px 4px 6px', borderRadius: "4px" }}>
                      <img
                        className={styles.calendarBlank1Icon}
                        alt=""
                        src={item?.isOverdue ? "/mobileIcons/Calender_Red.svg" : "/viewTaskIcons/calender-icon.svg"}
                      />
                      <p className={styles.duedate} style={{ color: item?.isOverdue ? "red" : "black" }}>
                        {moment(item.deadline).format("DD-MM-YYYY")}
                      </p>
                    </div>
                  </div>
                  <div className={styles.farmdetails}>
                    <h3 className={styles.farmname} id={styles[item.status]}>
                      {getItemTitle(item?.status)}
                    </h3>

                    <AvatarGroup sx={{
                      '& .MuiAvatar-root': {
                        fontSize: "10px !important",
                        width: "22px !important",
                        height: "22px !important",
                        background: "#d94841 !important",
                      }
                    }} total={item?.assign_to?.length} max={5}>
                      {item?.assign_to?.map((assignee: any, assigneeindex: any) => {
                        return (
                          <Avatar sx={{
                            fontSize: "10px",
                            width: "22px",
                            height: "22px",
                            background: "#d94841",
                          }} key={assigneeindex} >
                            {assignee?.name?.split(" ")?.length > 3
                              ? `${assignee?.name?.split(" ")[0][0]}${assignee?.name?.split(" ")[1][0]}`.toUpperCase()
                              : assignee?.name.slice(0, 2)?.toUpperCase()}
                          </Avatar>
                        );
                      })}
                    </AvatarGroup>
                  </div>
                </div>
              </div>
            );
          }
        })
      )
        : !loading ? (
          <div style={{ display: "flex", alignItems: "center", flexDirection: "column", height: "calc(100vh - 250px)", justifyContent: "center" }}>
            <img src="/viewTaskIcons/No-Data-Tasks.svg" alt="" />
            <p style={{ margin: "0", fontFamily: "'Inter', sans-serif", color: "#000", fontSize: "clamp(14px, 3vw, 16px" }}>
              No Tasks
            </p>
          </div>) : (
          ""
        )}

    </div>
  );
};

export default TaskCard;
