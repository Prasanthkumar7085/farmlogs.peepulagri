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
        value =
            value?.length > 2
                ? showAllFarms && id == viewMoreId
                    ? value
                    : value.slice(0, 2)
                : value;
        return (
            <span
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "1rem",
                    color: value?.length ? "" : "#9a9a9a",
                }}
            >
                {value?.length
                    ? value
                        .map((item: { _id: string; title: string }) => item.title)
                        .join(", ")
                    : "*No Farms*"}
                {value?.length > 2 ? (
                    <div
                        style={{
                            color: "#9a9a9a",

                        }}
                        onClick={() => {
                            if (viewMoreId) {
                                if (id == viewMoreId) {
                                    setShowAllFarms((prev) => !prev);
                                    setViewMoreId("");
                                } else {
                                    setViewMoreId(id);
                                }
                            } else {
                                setViewMoreId(id);
                                setShowAllFarms((prev) => !prev);
                            }
                        }}
                    >
                        {showAllFarms && (id == viewMoreId) ?
                            ""
                            : <Avatar sx={{ bgcolor: deepOrange[500], width: 21, height: 21, fontSize: "10px" }}>+{info?.farm_ids?.length - 2}</Avatar>}
                    </div>
                ) : (
                    ""
                )}
            </span>
        );
    }

    return (
        <div className={styles.allProcurementContainer}>
            {data?.length ? (
                data?.map((item: any, index: any) => {
                    if (data.length === index + 1 && hasMore == true) {
                        return (
                            <div className={styles.procurementcard}
                                onClick={() => router.push(`/users-procurements/${item._id}`)}
                                key={index}
                                ref={lastBookElementRef}>
                                <div className={styles.detailscontainer}>
                                    <div className={styles.datestatus}>
                                        <div className={styles.date}>
                                            <p className={styles.duedate}>  {moment(item.deadline).format("DD-MM-YYYY")}
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
                                                <p className={styles.farmname}>{FarmTitleComponent(item)}</p>
                                                <div className={styles.prioritycontainer}>
                                                    <p className={styles.duedate}>{item.priority}</p>
                                                </div>
                                            </div>
                                            <div className={styles.profile} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div className={styles.procurementcard}
                                onClick={() => router.push(`/users-procurements/${item._id}`)}
                                key={index}
                                ref={index === data.length - 15 ? lastItemRef : null}>
                                <div className={styles.detailscontainer}>
                                    <div className={styles.datestatus}>
                                        <div className={styles.date}>
                                            <p className={styles.duedate}> {moment(item.deadline).format("DD-MM-YYYY")}</p>
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
                                                <p className={styles.farmname}>{FarmTitleComponent(item)}</p>
                                                <div className={styles.prioritycontainer}>
                                                    <p className={styles.duedate}>{item.priority}</p>
                                                </div>
                                            </div>
                                            <div className={styles.profile} />
                                        </div>
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
            <LoadingComponent loading={loading} />

        </div>
    );
}

export default ProcurementCard;