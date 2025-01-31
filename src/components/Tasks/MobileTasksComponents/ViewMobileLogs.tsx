import {
    Avatar,
    CircularProgress,
    Drawer,
    IconButton,
    LinearProgress,
    Typography,
} from "@mui/material";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import styles from "src/components/Tasks/ViewTask/Logs.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import getAllLogsService from "../../../../lib/services/TasksService/getAllLogsService";
import { useCookies } from "react-cookie";
import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import { TasksLogsResponseType } from "@/types/tasksTypes";
import timePipe from "@/pipes/timePipe";

interface propType {
    openLogs: boolean;
    setOpenLogs: Dispatch<SetStateAction<boolean>>;
    taskId: string;
}

const ViewMobileLogs: FC<propType> = ({ openLogs, setOpenLogs, taskId }) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );

    const [logsLoading, setLogsLoading] = useState(true);
    const [, , removeCookie] = useCookies(["userType_v2"]);
    const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);

    const [logsData, setLogsData] = useState<Array<TasksLogsResponseType>>([]);

    const logout = async () => {
        try {
            removeCookie("userType_v2");
            loggedIn_v2("loggedIn_v2");
            router.push("/");
            await dispatch(removeUserDetails());
            await dispatch(deleteAllMessages());
        } catch (err: any) {
            console.error(err);
        }
    };

    const getLogs = async () => {
        setLogsLoading(true);
        try {
            const response = await getAllLogsService({
                token: accessToken,
                taskId: taskId as string,
            });

            if (response.status == 200) {
                setLogsData(response?.data);
            }
            if (response.status == 403) {
                await logout();
                return;
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLogsLoading(false);
        }
    };
    useEffect(() => {
        if (openLogs) {
            getLogs();
        } else {
            setLogsData([]);
        }
    }, [openLogs]);
    return (
        <Drawer
            onClose={() => setOpenLogs(false)}
            anchor="bottom"
            open={openLogs}
            sx={{
                zIndex: "1300 !important",
                "& .MuiPaper-root": {
                    height: "400px",
                    overflowY: "auto",
                    borderRadius: "20px 20px 0 0",
                    background: "#fff",
                    maxWidth: "calc(500px - 30px)",
                    margin: "0 auto",
                },
            }}
        >
            <div>
                <div className={styles.drawerHeaderMobile} style={{ padding: "1rem", paddingBottom: "0.5rem", borderBottom: "1px solid lightgrey" }}>
                    <Typography variant="h5" className={styles.taskViewLogHeading}>
                        <img src="/viewTaskIcons/logs-icon.svg" alt="" width={"14px"} />

                        Logs
                    </Typography>
                    <IconButton
                        onClick={() => {
                            setOpenLogs(false);
                        }}
                    >
                        <CloseIcon sx={{ color: "#000", fontSize: "1.2rem" }} />
                    </IconButton>
                </div>
            </div>

            <div style={{ padding: "0 1rem 1rem" }} className={logsData?.length ? styles.taskLogViewCards : styles.taskLogNoDataCard}>
                {!logsLoading && logsData?.length ? (
                    logsData.map((item: TasksLogsResponseType, index: number) => {
                        return (
                            <div className={styles.tasklogViewCard} key={index}>
                                <div className={styles.taskLogCardHeader}>
                                    <Avatar sx={{ fontSize: "9px", width: "20px", height: "20px", background: "#d94841" }} >
                                        {item.user_id.name.split(' ')?.length > 1 ? `${item.user_id.name.split(' ')[0][0]}${item.user_id.name.split(' ')[1][0]}`.toUpperCase() : item.user_id.name.slice(0, 2)?.toUpperCase()}
                                    </Avatar>
                                    <div className={styles.taskViewLogTaskName}>{item.user_id.name}</div>                </div>
                                <div className={styles.taskMessageAndDate}>
                                    <p style={{ margin: "0" }} className={styles.taskStatusUpdatemessage}>{item.message}</p>
                                    <div className={styles.taskStatusUpdateTime}>{timePipe(item.createdAt, "DD/MM/YYYY hh:mm A")}</div>
                                </div>
                            </div>
                        );
                    })
                ) : !logsLoading ? (
                    "No Logs"
                ) : (
                    <LinearProgress />
                )}
            </div>
        </Drawer>
    );
}
export default ViewMobileLogs;