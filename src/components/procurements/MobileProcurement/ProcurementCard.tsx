import LoadingComponent from "@/components/Core/LoadingComponent";
import { Avatar, AvatarGroup } from "@mui/material";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./procurement-card.module.css";
import { useState } from "react";
import { deepOrange } from "@mui/material/colors";
import { useSelector } from "react-redux";

const ProcurementCard = ({ data, lastBookElementRef, hasMore, lastItemRef, loading }: any) => {

  const router = useRouter();
  const [showAllFarms, setShowAllFarms] = useState(false);

  const [viewMoreId, setViewMoreId] = useState("");

  const userDetails = useSelector(
    (state: any) => state.auth.userDetails?.user_details
  );
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
  //to captlize the upercase text
  const capitalizeFirstLetter = (string: any) => {
    let temp = string.toLowerCase();
    return temp.charAt(0).toUpperCase() + temp.slice(1);
  };
  return (
    <div className={styles.allProcurementContainer} style={{ height: userDetails?.user_type == "central_team" ? "calc(100vh - 180px)" : "calc(100vh - 250px)" }}>
      {/* height: calc(100vh - 250px); */}

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
                      <p className={styles.duedate}>{capitalizeFirstLetter(item?.status)}</p>
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
                            sx={{ width: 26, height: 26 }}
                          ></Avatar>
                        ) : (
                          <Avatar sx={{ width: 26, height: 26 }}>
                            {item.requested_by?.name.slice(0, 1)}
                          </Avatar>
                        )}
                      </div>                    </div>
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

                        {moment(item.createdAt).format("DD-MM-YYYY")}
                      </p>
                    </div>
                    <div className={styles.status}>
                      <p className={styles.duedate}>{capitalizeFirstLetter(item.status)}</p>
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

                    </div>
                    <div className={styles.row}>
                      <div className={styles.column}>
                        <p className={styles.farmname}>
                          {FarmTitleComponent(item)}
                        </p>
                        <div className={styles.prioritycontainer}>
                          <p className={styles.duedate}>{item.priority == "NONE" ? "---" : item.priority}</p>
                        </div>
                      </div>
                      <div className={styles.profile}>
                        {item.requested_by?.url ? (
                          <Avatar
                            src={item.requested_by?.url}
                            sx={{ width: 26, height: 26 }}
                          ></Avatar>
                        ) : (
                          <Avatar sx={{ width: 26, height: 26 }}>
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
          <Image src="/No_data_procurement.svg" alt="" height={150} width={300} />
          <p
            style={{
              margin: "0",
              fontFamily: "'Inter', sans-serif",
              color: "#000",
              fontSize: "clamp(14px, 3vw, 16px",
            }}
          >
            No Procurements
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