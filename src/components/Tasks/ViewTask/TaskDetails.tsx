import ErrorMessages from "@/components/Core/ErrorMessages";
import LoadingComponent from "@/components/Core/LoadingComponent";
import timePipe from "@/pipes/timePipe";
import { TaskResponseTypes } from "@/types/tasksTypes";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import { IconButton, MenuItem, Select, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import updateTaskStatusService from "../../../../lib/services/TasksService/updateTaskStatusService";
import FarmOptionsInViewTasks from "./FarmOptionsInViewTasks";
import styles from "./TaskDetails.module.css";
import UserOptionsinViewTasks from "./UserOptionsinViewTasks";

interface PropsType {
  data: TaskResponseTypes | null | undefined;
  updateTask: (body: any) => any;
}

const TaskDetails: React.FC<PropsType> = ({ data, updateTask }) => {
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const userType = useSelector(
    (state: any) => state.auth.userDetails?.user_details?.user_type
  );

  const [editFieldOrNot, setEditFieldOrNot] = useState(false);
  const [editField, setEditField] = useState("");
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState<Date | string | any>("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [statusOptions] = useState(["TODO", "IN-PROGRESS", "COMPLETED"]);
  const [farmId, setFarmId] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [farmName, setFarmName] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    setErrorMessages({});
    setTitle(data?.title ? data?.title : "");
    setDeadline(data?.deadline ? new Date(data?.deadline) : "");
    setDescription(data?.description ? data?.description : "");
    setStatus(data?.status ? data?.status : "");
    setFarmId(data?.farm_id ? data?.farm_id?._id : "");
    setFarmName(data?.farm_id?.title ? data?.farm_id?.title : "");
    setUserId(data?.assigned_to?._id as string);
  }, [data, editFieldOrNot]);

  const onUpdateField = async () => {
    let body = {
      ...data,
      assigned_to: userId,
      farm_id: farmId,
      deadline: deadline
        ? moment(deadline)
          .utcOffset("+05:30")
          .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        : "",
      description: description ? description : "",
      title: title ? title : "",
      status: status,
    };

    const response = await updateTask(body);

    if (response?.success) {
      setEditFieldOrNot(false);
      setEditField("");
    } else {
      if (response?.errors) {
        setErrorMessages(response?.errors);
      }
    }
  };

  const onChangeStatus = async (status: string) => {
    setLoading(true);
    const response = await updateTaskStatusService({
      token: accessToken,
      taskId: data?._id as string,
      body: { status: status },
    });
    if (response?.success) {
      toast.success(response?.message);
    } else {
      toast.error(response?.message);
    }
    setLoading(false);
  };

  return (
    <div className={styles.cardDetails}>
      <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className={styles.userBlock}>
          <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
            {userType !== "USER" ? (
              editField == "farm" && editFieldOrNot ?
                <div> <IconButton
                  onClick={() => {
                    setEditFieldOrNot(false);
                    setEditField("");
                  }}
                >
                  <CloseIcon />
                </IconButton>
                  <IconButton
                    onClick={() => {
                      onUpdateField();
                    }}
                  >
                    <DoneIcon />
                  </IconButton></div> :



                <IconButton
                  onClick={() => {
                    setEditFieldOrNot(true);
                    setEditField("farm");
                  }}
                >
                  <ModeEditOutlinedIcon />
                </IconButton>
            ) : (
              ""
            )}
          </div>
          <div className={styles.userDetails}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", width: "100%", gap: "0.5rem" }}>
              <label className={styles.userLabel}>Assigned User</label>
              <p style={{ margin: "0", fontWeight: "600" }}>:</p>
              {editField == "farm" && editFieldOrNot ? (
                <div style={{ width: "65%" }}>
                  <UserOptionsinViewTasks
                    userId={userId}
                    onChange={(assigned_to: any) => {
                      setFarmId("");
                      setUserId(assigned_to?._id);
                      setErrorMessages({});
                    }}
                  />
                </div>
              ) : (
                <h1 >
                  {data?.assigned_to ? data?.assigned_to?.full_name : "-"}
                </h1>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", width: "100%", gap: "0.5rem" }}>
              <label className={styles.userLabel}>Farm</label>
              <p style={{ margin: "0", fontWeight: "600" }}>:</p>
              {editField == "farm" && editFieldOrNot ? (
                <div style={{ width: "65%" }}>
                  <FarmOptionsInViewTasks
                    userId={userId}
                    farmId={farmId}
                    onChange={(farm_id: any) => {
                      setFarmId(farm_id?._id);
                      setFarmName(farm_id?.title);
                      setErrorMessages({});
                    }}
                  />
                  <ErrorMessages errorMessages={errorMessages} keyname="farm_id" />
                </div>
              ) : (
                <h1 >
                  {data?.farm_id ? data?.farm_id?.title : "-"}
                </h1>
              )}
            </div>
          </div>
        </div>
        <div className={styles.status}>
          <label className={styles.label1}>Status</label>

          <div className={styles.status1}>
            {/* <img
              className={styles.indicatorIcon}
              alt=""
              src="/indicator@2x.png"
            /> */}
            {userType !== "USER" ? (
              <div>
                <Select
                  className={styles.inoutbox}
                  color="primary"
                  size="small"
                  placeholder="Enter your Task title here"
                  variant="outlined"
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    onChangeStatus(e.target.value);
                  }}
                  sx={{ width: "100px" }}
                >
                  {statusOptions.map((item: string, index: number) => (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center" }}>
                <p className={styles.status2}>
                  {data?.status ? data?.status : "-"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.idandStatus}>
        <div className={styles.title}>
          <label className={styles.label}>Title</label>
          {editField == "title" && editFieldOrNot ? (
            <div>
              <TextField
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <IconButton
                onClick={() => {
                  setEditFieldOrNot(false);
                  setEditField("");
                }}
              >
                <CloseIcon />
              </IconButton>
              <IconButton
                onClick={() => {
                  onUpdateField();
                  // setEditFieldOrNot(false);
                  // setEditField("");
                }}
              >
                <DoneIcon />
              </IconButton>
            </div>
          ) : (
            <h1 className={styles.landPreparation}>
              {data?.title ? data?.title : "-"}
              {userType !== "USER" ? (
                <IconButton
                  onClick={() => {
                    setEditFieldOrNot(true);
                    setEditField("title");
                  }}
                >
                  <ModeEditOutlinedIcon />
                </IconButton>
              ) : (
                ""
              )}
            </h1>
          )}
        </div>
      </div>
      <div className={styles.date}>
        <div className={styles.response}>
          <label className={styles.responseDate}>Due Date</label>
          {editField == "deadline" && editFieldOrNot ? (
            <div className={styles.responseDate2}>
              <div style={{ display: "flex" }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    disablePast
                    value={deadline}
                    onChange={(newValue: any) => {
                      setDeadline(newValue);
                    }}
                    format="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        variant: "standard",
                        size: "medium",
                        color: "primary",
                      },
                    }}
                  />
                </LocalizationProvider>
                <IconButton
                  onClick={() => {
                    setEditFieldOrNot(false);
                    setEditField("");
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    onUpdateField();
                    // setEditFieldOrNot(false);
                    // setEditField("");
                  }}
                >
                  <DoneIcon />
                </IconButton>
              </div>
            </div>
          ) : (
            <div className={styles.responseDate1} style={{ display: "flex" }}>
              <p className={styles.text}>
                {data?.deadline
                  ? timePipe(data?.deadline, "DD, MMM YYYY")
                  : "-"}
              </p>
              {userType !== "USER" ? (
                <IconButton
                  onClick={() => {
                    setEditFieldOrNot(true);
                    setEditField("deadline");
                  }}
                >
                  <ModeEditOutlinedIcon />
                </IconButton>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      </div>
      <div className={styles.description}>
        <label className={styles.label}>Description</label>
        {editField == "description" && editFieldOrNot ? (
          <div>
            <TextField
              multiline
              minRows={3}
              maxRows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ width: "300px" }}
            />
            <IconButton
              onClick={() => {
                setEditFieldOrNot(false);
                setEditField("");
              }}
            >
              <CloseIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                onUpdateField();
                // setEditFieldOrNot(false);
                // setEditField("");
              }}
            >
              <DoneIcon />
            </IconButton>
          </div>
        ) : (
          <p className={styles.farmersPrepareThe}>
            {data?.description ? data?.description : "-"}
            {userType !== "USER" ? (
              <IconButton
                onClick={() => {
                  setEditFieldOrNot(true);
                  setEditField("description");
                }}
              >
                <ModeEditOutlinedIcon />
              </IconButton>
            ) : (
              ""
            )}
          </p>
        )}
      </div>
      <LoadingComponent loading={loading} />
      <Toaster closeButton richColors position="top-right" />
    </div>
  );
};

export default TaskDetails;
