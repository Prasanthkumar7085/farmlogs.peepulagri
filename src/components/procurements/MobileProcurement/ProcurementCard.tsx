import LoadingComponent from "@/components/Core/LoadingComponent";
import { Avatar, AvatarGroup } from "@mui/material";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./procurement-card.module.css";
import { useState } from "react";
import { deepOrange } from "@mui/material/colors";

const ProcurementCard = ({ data, lastBookElementRef, hasMore, lastItemRef, loading }: any) => {

    const router = useRouter();
    const [showAllFarms, setShowAllFarms] = useState(false);

    const [viewMoreId, setViewMoreId] = useState("");

    const FarmTitleComponent = (info: any) => {
      let value = info?.farm_ids;
      let id = info?._id;

      if (!value || value.length === 0) {
        return <span>*No Farms*</span>;
      }

      const visibleTitles = value.slice(0, 2);
      const hiddenTitlesCount = value.length - visibleTitles.length;

      return (
        <span
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "1rem",
            color: value.length > 2 ? "" : "#9a9a9a",
          }}
        >
          {visibleTitles
            .map((item: { _id: string; title: string }) => item.title)
            .join(",")}
          {value.length > 2 && (
            <div
              style={{
                color: "#9a9a9a",
              }}
              onClick={() => {
                setShowAllFarms((prev) => !prev);
                setViewMoreId((prev) => (prev === id ? "" : id));
              }}
            >
              <Avatar
                sx={{
                  bgcolor: deepOrange[500],
                  width: 24,
                  height: 24,
                  fontSize: "10px",
                }}
              >
                +{hiddenTitlesCount}
              </Avatar>
            </div>
          )}
        </span>
      );
    };

    return (
      <div className={styles.allProcurementContainer}>
        {data?.length ? (
          data?.map((item: any, index: any) => {
            if (data.length === index + 1 && hasMore == true) {
              return (
                <div
                  className={styles.procurementcard}
                  onClick={() => router.push(`/users-procurements/${item._id}`)}
                  key={index}
                  ref={lastBookElementRef}
                >
                  <div className={styles.detailscontainer}>
                    <div className={styles.datestatus}>
                      <div className={styles.date}>
                        <p className={styles.duedate}>
                          {" "}
                          {moment(item.deadline).format("DD-MM-YYYY")}
                        </p>
                      </div>
                      <div className={styles.status}>
                        <p className={styles.duedate}>{item.status}</p>
                      </div>
                    </div>
                    <div className={styles.container}>
                      <div className={styles.title}>
                        <h1 className={styles.fertilizersAndSoil}>
                          {item?.title
                            ? item?.title?.length > 40
                              ? item?.title?.slice(0, 1).toUpperCase() +
                                item?.title?.slice(1, 40) +
                                "..."
                              : item?.title[0].toUpperCase() +
                                item?.title?.slice(1)
                            : ""}
                        </h1>
                        {/* <div className={styles.requiredmaterialscount}>
                                                <p className={styles.p}>10</p>
                                            </div> */}
                      </div>
                      <div className={styles.row}>
                        <div className={styles.column}>
                          <p className={styles.farmname}>
                            {FarmTitleComponent(item)}
                          </p>
                          <div className={styles.prioritycontainer}>
                            <p className={styles.duedate}>{item.priority}</p>
                          </div>
                        </div>
                        <div className={styles.profile}>j</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  className={styles.procurementcard}
                  onClick={() => router.push(`/users-procurements/${item._id}`)}
                  key={index}
                  ref={index === data.length - 15 ? lastItemRef : null}
                >
                  <div className={styles.detailscontainer}>
                    <div className={styles.datestatus}>
                      <div className={styles.date}>
                        <p className={styles.duedate}>
                          {" "}
                          {moment(item.deadline).format("DD-MM-YYYY")}
                        </p>
                      </div>
                      <div className={styles.status}>
                        <p className={styles.duedate}>{item.status}</p>
                      </div>
                    </div>
                    <div className={styles.container}>
                      <div className={styles.title}>
                        <h1 className={styles.fertilizersAndSoil}>
                          {item?.title
                            ? item?.title?.length > 40
                              ? item?.title?.slice(0, 1).toUpperCase() +
                                item?.title?.slice(1, 40) +
                                "..."
                              : item?.title[0].toUpperCase() +
                                item?.title?.slice(1)
                            : ""}
                        </h1>
                        {/* <div className={styles.requiredmaterialscount}>
                                                <p className={styles.p}></p>
                                            </div> */}
                      </div>
                      <div className={styles.row}>
                        <div className={styles.column}>
                          <p className={styles.farmname}>
                            {FarmTitleComponent(item)}
                          </p>
                          <div className={styles.prioritycontainer}>
                            <p className={styles.duedate}>{item.priority}</p>
                          </div>
                        </div>
                        <div className={styles.profile}>
                          {item.requested_by?.url ? (
                            <Avatar
                              src={item.requested_by?.url}
                              sx={{ width: 24, height: 24 }}
                            ></Avatar>
                          ) : (
                            <Avatar sx={{ width: 24, height: 24 }}>
                              {item.requested_by?.name.slice(0, 1)}
                            </Avatar>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          })
        ) : !loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              height: "calc(100vh - 250px)",
              justifyContent: "center",
            }}
          >
            <img src="/viewTaskIcons/No-Data-Tasks.svg" alt="" />
            <p
              style={{
                margin: "0",
                fontFamily: "'Inter', sans-serif",
                color: "#000",
                fontSize: "clamp(14px, 3vw, 16px",
              }}
            >
              No Tasks
            </p>
          </div>
        ) : (
          ""
        )}
        <LoadingComponent loading={loading} />
      </div>
    );
}

export default ProcurementCard;