import {
  CircularProgress,
  Drawer,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./Logs.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import getAllLogsService from "../../../../lib/services/TasksService/getAllLogsService";
import { useCookies } from "react-cookie";
import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import { TasksLogsResponseType } from "@/types/tasksTypes";
import timePipe from "@/pipes/timePipe";
import SummarizeIcon from "@mui/icons-material/Summarize";

interface propType {
  openLogs: boolean;
  setOpenLogs: Dispatch<SetStateAction<boolean>>;
  taskId: string;
}
const ViewLogs: FC<propType> = ({ openLogs, setOpenLogs, taskId }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [logsLoading, setLogsLoading] = useState(true);
  const [, , removeCookie] = useCookies(["userType"]);
  const [, , loggedIn] = useCookies(["loggedIn"]);

  const [logsData, setLogsData] = useState<Array<TasksLogsResponseType>>([]);

  const logout = async () => {
    try {
      removeCookie("userType");
      loggedIn("loggedIn");
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
      anchor="right"
      open={openLogs}
      sx={{
        "& .MuiPaper-root": {
          padding: "1rem",
          background: "#f5f5f5",
          width: "30%",
          maxWidth: "600px",
          minWidth: "450px"
        },
      }}
    >
      <div>
        <div className={styles.drawerHeader}>
          <Typography variant="h5" className={styles.taskViewLogHeading}>
            Logs <SummarizeIcon />
          </Typography>
          <IconButton
            onClick={() => {
              setOpenLogs(false);
            }}
          >
            <CloseIcon sx={{ color: "#000" }} />
          </IconButton>
        </div>
      </div>

      <div className={styles.taskLogViewCards}>
        {!logsLoading && logsData?.length ? (
          logsData.map((item: TasksLogsResponseType, index: number) => {
            return (
              <div className={styles.tasklogViewCard} key={index}>
                <div className={styles.taskLogCardHeader}>
                  <div className={styles.taskViewLogTaskName}>{item.task_id.title}</div>
                  <div className={styles.taskStatusUpdateTime}>{timePipe(item.createdAt, "DD/MM/YYYY hh:mm A")}</div>
                </div>
                <div>
                  <p className={styles.taskLogStatusAlrert}>{item.type}</p>
                  <p style={{ margin: "0" }} className={styles.taskStatusUpdatemessage}>{item.message}</p>
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
};

export default ViewLogs;
