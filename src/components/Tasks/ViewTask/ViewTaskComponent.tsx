import LoadingComponent from "@/components/Core/LoadingComponent";
import { TaskResponseTypes } from "@/types/tasksTypes";
import { Card } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getTaskByIdService from "../../../../lib/services/TasksService/getTaskByIdService";
import TaskDetails from "./TaskDetails";
import updateTaskService from "../../../../lib/services/TasksService/updateTaskService";
import ViewTaskAttachments from "./ViewTaskAttachments";
import styles from "./ViewTaskPage.module.css";
const ViewTaskComponent = () => {
  const router = useRouter();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [data, setData] = useState<TaskResponseTypes | null>();
  const [loading, setLoading] = useState(true);

  const getTaskById = async (id: string) => {
    setLoading(true);
    const response = await getTaskByIdService({
      taskId: id,
      token: accessToken,
    });

    if (response?.success) {
      setData(response?.data);
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
          <div className={styles.backButton} onClick={() => router.back()}>
            <img src="/arrow-left-back.svg" alt="" width={"18px"} />
          </div>
          <h5>View Task</h5>
        </div>
        <Card
          sx={{
            width: "100%",
            borderRadius: "10px",
            marginBottom: "1rem",
          }}
        >
          <TaskDetails data={data} updateTask={updateTask} />
          {data?.attachments?.length ? (
            <ViewTaskAttachments data={data} getTaskById={getTaskById} />
          ) : (
            ""
          )}
        </Card>
      </div>
      <LoadingComponent loading={loading} />
    </div>
  );
};

export default ViewTaskComponent;
