import LoadingComponent from "@/components/Core/LoadingComponent";
import { TaskResponseTypes } from "@/types/tasksTypes";
import { Button, Card } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getTaskByIdService from "../../../../lib/services/TasksService/getTaskByIdService";
import TaskDetails from "./TaskDetails";
import updateTaskService from "../../../../lib/services/TasksService/updateTaskService";
import ViewTaskAttachments from "./ViewTaskAttachments";
import styles from "./ViewTaskPage.module.css";
import { toast } from "sonner";
import SummarizeIcon from "@mui/icons-material/Summarize";
import ViewLogs from "./ViewLogs";

const ViewTaskComponent = () => {
  const router = useRouter();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
const loggedInUserId = useSelector(
  (state: any) => state.auth.userDetails?.user_details?._id
);
const [data, setData] = useState<TaskResponseTypes | null>();
const [loading, setLoading] = useState(true);
const [openLogs, setOpenLogs] = useState(false);
const [hasEditAccess, setHasEditAccess] = useState<boolean | undefined>(false);

const getTaskById = async (id: string) => {
  setLoading(true);
  const response = await getTaskByIdService({
    taskId: id,
    token: accessToken,
  });

  if (response?.success) {
    setData(response?.data);

    console.log(
      response?.data?.assign_to?.some(
        (item: any) => item?._id == loggedInUserId
      )
    );

    setHasEditAccess(
      response?.data?.assign_to?.some(
        (item: any) => item?._id == loggedInUserId
      )
    );
  }
  setLoading(false);
};

const updateTask = async (body: any) => {
  setLoading(true);
  const response = await updateTaskService({
    taskId: data?._id as string,
    body: body,
    token: accessToken,
  });
  if (response?.success) {
    toast.success(response?.message);
    await getTaskById(router.query.task_id as string);
  }
  setLoading(false);
  return response;
};

useEffect(() => {
  if (router.isReady && accessToken && router.query.task_id) {
    getTaskById(router.query.task_id as string);
  }
}, [router.isReady, accessToken, router.query.task_id]);

return (
  <div className={styles.viewTaskPage}>
    <div className={styles.viewTaskContainer}>
      <div className={styles.viewPageHeader}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div className={styles.backButton} onClick={() => router.back()}>
              <img src="/arrow-left-back.svg" alt="" width={"18px"} />
            </div>
            <h5>View Task</h5>
          </div>
          <div>
            <Button
              sx={{ display: "flex", gap: "10px" }}
              variant="outlined"
              onClick={() => setOpenLogs((prev) => !prev)}
            >
              View Logs <SummarizeIcon />
            </Button>
          </div>
        </div>
      </div>
      <Card
        sx={{
          width: "100%",
          borderRadius: "10px",
          marginBottom: "1rem",
        }}
      >
        <ViewLogs
          openLogs={openLogs}
          setOpenLogs={setOpenLogs}
          taskId={router.query.task_id as string}
        />
        <TaskDetails
          data={data}
          updateTask={updateTask}
          getTaskById={getTaskById}
          hasEditAccess={hasEditAccess}
        />
        <ViewTaskAttachments
          data={data}
          getTaskById={getTaskById}
          hasEditAccess={hasEditAccess}
        />
      </Card>
    </div>
    <LoadingComponent loading={loading} />
  </div>
);
};

export default ViewTaskComponent;
