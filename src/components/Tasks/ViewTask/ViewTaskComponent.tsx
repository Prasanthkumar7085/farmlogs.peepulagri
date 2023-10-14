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

const ViewTaskComponent = () => {
  const router = useRouter();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [data, setData] = useState<TaskResponseTypes | null>();
  const [loading, setLoading] = useState(true);

  const getTaskById = async (id: string) => {
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
      getTaskById(router.query.task_id as string);
      setLoading(false);
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
    <div
      style={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        padding: "3% 0 0 0",
      }}
    >
      <div
        style={{
          width: "60%",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                cursor: "pointer",
                border: "1.5px solid #a05148",
                borderRadius: "3px",
                padding: "3px 5px 3px 5px",
              }}
              onClick={() => router.back()}
            >
              <img src="/arrow-left-back.svg" alt="" width={"18px"} />
            </div>
            <h5>View Task</h5>
          </div>
        </div>
        <Card
          sx={{
            width: "100%",
            borderRadius: "10px",
          }}
        >
          <TaskDetails data={data} updateTask={updateTask} />
          <ViewTaskAttachments data={data} />
        </Card>
      </div>
      <LoadingComponent loading={loading} />
    </div>
  );
};

export default ViewTaskComponent;
