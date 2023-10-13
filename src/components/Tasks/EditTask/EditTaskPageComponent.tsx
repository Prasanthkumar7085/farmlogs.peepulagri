import { useEffect, useState } from "react";
import TaskForm from "../AddTask/TaskForm";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import getTaskByIdService from "../../../../lib/services/TasksService/getTaskByIdService";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { loadComponents } from "next/dist/server/load-components";

const EditTaskPageComponent = () => {
  const router = useRouter();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const getTaskById = async () => {
    setLoading(true);
    const response = await getTaskByIdService({
      taskId: router.query.task_id as string,
      token: accessToken,
    });
    if (response?.success) {
      setData(response?.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (router.isReady && router.query.task_id && accessToken) {
      getTaskById();
    }
  }, [router.isReady, router.query.task_id, accessToken]);
  return (
    <div style={{ padding: "4rem" }}>
      <TaskForm data={data} />
      <LoadingComponent loading={loading} />
    </div>
  );
};

export default EditTaskPageComponent;