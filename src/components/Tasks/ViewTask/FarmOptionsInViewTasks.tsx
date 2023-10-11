import React, { useEffect, useState } from "react";
import FarmAutoCompleteInAddTask from "../AddTask/FarmAutoCompleteInAddTask";
import { FarmInTaskType } from "@/types/tasksTypes";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsService";
import { CircularProgress } from "@mui/material";

interface PropsType {
  farmId: string;
  onChange: (id: string) => void;
}
const FarmOptionsInViewTasks: React.FC<PropsType> = ({ farmId, onChange }) => {
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
      onChange(selectedObject?._id);
    } else {
      setDefaultValue(null);
      onChange("");
    }
  };

  const getAllFarms = async (id = "") => {
    setLoading(true);
    const response = await getAllFarmsService(accessToken);

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
    if (router.isReady && accessToken) {
      if (router.query.task_id) {
        getAllFarms(farmId);
      }
    }
  }, [router.isReady, accessToken]);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <FarmAutoCompleteInAddTask
        options={farmData}
        label={"title"}
        onSelectValueFromDropDown={captureFarmName}
        placeholder={"Select Farm"}
        defaultValue={defaultValue}
      />
      {loading ? <CircularProgress size="1.5rem" sx={{ color: "blue" }} /> : ""}
    </div>
  );
};
export default FarmOptionsInViewTasks;
