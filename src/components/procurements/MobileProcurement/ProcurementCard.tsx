import LoadingComponent from "@/components/Core/LoadingComponent";
import { Avatar, AvatarGroup } from "@mui/material";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./procurement-card.module.css";

const ProcurementCard = ({ data, lastBookElementRef, hasMore, lastItemRef, loading }: any) => {
    const router = useRouter();

    return (
        <div className={styles.allProcurementContainer}>
            {data?.length ? (
                data?.map((item: any, index: any) => {
                    if (data.length === index + 1 && hasMore == true) {
                        return (
                            <div className={styles.procurementcard}
                                onClick={() => router.push(`/users-tasks/${item._id}/view`)}
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
                                                    ? item?.title?.length > 25
                                                        ? item?.title?.slice(0, 1).toUpperCase() +
                                                        item?.title?.slice(1, 22) +
                                                        "..."
                                                        : item?.title[0].toUpperCase() +
                                                        item?.title?.slice(1)
                                                    : ""}
                                            </h1>
                                            <div className={styles.requiredmaterialscount}>
                                                <p className={styles.p}>10</p>
                                            </div>
                                        </div>
                                        <div className={styles.row}>
                                            <div className={styles.column}>
                                                <p className={styles.farmname}>HeatHarvest Farms</p>
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
                                onClick={() => router.push(`/users-tasks/${item._id}/view`)}
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
                                                    ? item?.title?.length > 25
                                                        ? item?.title?.slice(0, 1).toUpperCase() +
                                                        item?.title?.slice(1, 22) +
                                                        "..."
                                                        : item?.title[0].toUpperCase() +
                                                        item?.title?.slice(1)
                                                    : ""}
                                            </h1>
                                            <div className={styles.requiredmaterialscount}>
                                                <p className={styles.p}>10</p>
                                            </div>
                                        </div>
                                        <div className={styles.row}>
                                            <div className={styles.column}>
                                                <p className={styles.farmname}>HeatHarvest Farms</p>
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