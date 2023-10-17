import React, { useEffect, useState } from "react";
import FarmAutoCompleteInAddTask from "../AddTask/FarmAutoCompleteInTasks";
import { FarmInTaskType } from "@/types/tasksTypes";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsServiceMobile";

interface PropsType {
  userId: string;
  farmId: string;
  onChange: (id: string) => void;
}
const FarmOptionsInViewTasks: React.FC<PropsType> = ({
  userId,
  farmId,
  onChange,
}) => {
  const router = useRouter();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [farmData, setFarmData] = useState<Array<FarmInTaskType>>([]);
  const [defaultValue, setDefaultValue] = useState<FarmInTaskType | null>();
  const [loading, setLoading] = useState(false);

  const captureFarmName = (selectedObject: any) => {
    if (selectedObject && Object.keys(selectedObject).length) {
      setDefaultValue(selectedObject);
      onChange(selectedObject);
    } else {
      setDefaultValue(null);
      onChange("");
    }
  };

  const getAllFarms = async (id = "", user = "") => {
    setLoading(true);
    let url = "farm/1/1000";
    if (user) {
      url += `?user_id=${user}`;
    } else {
      setFarmData([]);
      setLoading(false);
      return;
    }
    const response = await getAllFarmsService(url, accessToken);

    if (response?.success) {
      setFarmData(response?.data);

      if (id) {
        let obj = response?.data?.find((item: any) => item._id == id);
        setDefaultValue(obj);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!farmId) {
      setDefaultValue(null);
    }
  }, [farmId]);
  useEffect(() => {
    if (router.isReady && accessToken) {
      if (router.query.task_id) {
        getAllFarms(farmId, userId);
      }
    }
  }, [router.isReady, accessToken, userId]);

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      <FarmAutoCompleteInAddTask
        options={farmData}
        label={"title"}
        onSelectValueFromDropDown={captureFarmName}
        placeholder={"Select Farm"}
        defaultValue={defaultValue}
        loading={loading}
      />
    </div>
  );
};
export default FarmOptionsInViewTasks;
