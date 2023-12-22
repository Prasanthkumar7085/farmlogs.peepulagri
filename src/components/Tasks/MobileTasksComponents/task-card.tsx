import { Avatar } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import styles from "./task-card.module.css";
import { useState } from "react";

const TaskCard = ({ data, lastBookElementRef, hasMore, lastItemRef }: any) => {
  const router = useRouter();

  const [statusOptions] = useState<Array<{ value: string; title: string }>>([
    { value: "TO-START", title: "To-Start" },
    { value: "INPROGRESS", title: "In-Progress" },
    { value: "PENDING", title: "Pending" },
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
      {data?.length
        ? data?.map((item: any, index: any) => {
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
                            : item?.title[0].toUpperCase() +
                              item?.title?.slice(1)
                          : "ty"}
                      </h2>
                      <div className={styles.duedatecontainer}>
                        <img
                          className={styles.calendarBlank1Icon}
                          alt=""
                          src="/calendarblank-1@2x.png"
                        />
                        <p className={styles.duedate}>
                          {moment(item.deadline).format("DD-MM-YYYY")}
                        </p>
                      </div>
                    </div>
                    <div className={styles.farmdetails}>
                      <h3 className={styles.farmname}>SpiceVine Gardens</h3>
                      <div className={styles.profile}>
                        <h1 className={styles.jj}>
                          <Avatar
                            sx={{
                              fontSize: "9px",
                              width: "20px",
                              height: "20px",
                              background: "#d94841",
                            }}
                          >
                            {item?.created_by?.name?.split(" ")?.length > 1
                              ? `${item?.created_by?.name?.split(" ")[0][0]}${
                                  item?.created_by?.name?.split(" ")[1][0]
                                }`.toUpperCase()
                              : item?.created_by?.name
                                  .slice(0, 2)
                                  ?.toUpperCase()}
                          </Avatar>
                        </h1>
                      </div>
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
                      <div className={styles.duedatecontainer}>
                        <img
                          className={styles.calendarBlank1Icon}
                          alt=""
                          src="/calendarblank-1@2x.png"
                        />
                        <p className={styles.duedate}>
                          {moment(item.deadline).format("DD-MM-YYYY")}
                        </p>
                      </div>
                    </div>
                    <div className={styles.farmdetails}>
                      <h3 className={styles.farmname} id={styles[item.status]}>
                        {getItemTitle(item?.status)}
                      </h3>
                      <div className={styles.profile}>
                        <h1 className={styles.jj}>
                          <Avatar
                            sx={{
                              fontSize: "9px",
                              width: "20px",
                              height: "20px",
                              background: "#d94841",
                            }}
                          >
                            {item?.created_by?.name?.split(" ")?.length > 1
                              ? `${item?.created_by?.name?.split(" ")[0][0]}${
                                  item?.created_by?.name?.split(" ")[1][0]
                                }`.toUpperCase()
                              : item?.created_by?.name
                                  .slice(0, 2)
                                  ?.toUpperCase()}
                          </Avatar>
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          })
        : ""}
    </div>
  );
};

export default TaskCard;
