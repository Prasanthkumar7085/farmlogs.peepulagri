import { TaskResponseTypes } from "@/types/tasksTypes";
import styles from "./TaskDetails.module.css";
import timePipe from "@/pipes/timePipe";
import { useEffect, useState } from "react";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, MenuItem, Select, TextField } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import FarmOptionsInViewTasks from "./FarmOptionsInViewTasks";
import ErrorMessages from "@/components/Core/ErrorMessages";
import { useSelector } from "react-redux";
import updateSupportStatusService from "../../../../lib/services/SupportService/updateSupportStatusService";
import updateTaskStatusService from "../../../../lib/services/TasksService/updateTaskStatusService";
import { Toaster, toast } from "sonner";
import LoadingComponent from "@/components/Core/LoadingComponent";

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

  useEffect(() => {
    setErrorMessages({});
    setTitle(data?.title ? data?.title : "");
    setDeadline(data?.deadline ? new Date(data?.deadline) : "");
    setDescription(data?.description ? data?.description : "");
    setStatus(data?.status ? data?.status : "");
    setFarmId(data?.farm_id ? data?.farm_id?._id : "");
    setFarmName(data?.farm_id?.title ? data?.farm_id?.title : "");
  }, [data, editFieldOrNot]);

  const onUpdateField = async () => {
    let body = {
      ...data,
      assigned_to: undefined,
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
    console.log(body);

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
      <div className={styles.idandStatus}>
        <div className={styles.title}>
          <label className={styles.label}>Assigned User</label>
          {editField == "user" && editFieldOrNot ? (
            <div>
              <div style={{ display: "flex" }}>
                <FarmOptionsInViewTasks
                  farmId={data?.farm_id?._id as string}
                  onChange={(farm_id: any) => {
                    console.log(farm_id);
                    setFarmId(farm_id?._id);
                    setFarmName(farm_id?.title);
                    setErrorMessages({});
                  }}
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
            </div>
          ) : (
            <h1 className={styles.landPreparation}>
              {data?.assigned_to ? data?.assigned_to?.full_name : "-"}
              {userType !== "USER" ? (
                <IconButton
                  onClick={() => {
                    setEditFieldOrNot(true);
                    setEditField("user");
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
                  placeholder="Enter your Task title here"
                  variant="outlined"
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    onChangeStatus(e.target.value);
                  }}
                  sx={{ width: "200px" }}
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
      <div className={styles.title}>
        <label className={styles.label}>Farm</label>
        {editField == "farm" && editFieldOrNot ? (
          <div>
            <div style={{ display: "flex" }}>
              <FarmOptionsInViewTasks
                farmId={data?.farm_id?._id as string}
                onChange={(farm_id: any) => {
                  console.log(farm_id);
                  setFarmId(farm_id?._id);
                  setFarmName(farm_id?.title);
                  setErrorMessages({});
                }}
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
            <ErrorMessages errorMessages={errorMessages} keyname="farm_id" />
          </div>
        ) : (
          <h1 className={styles.landPreparation}>
            {data?.farm_id ? data?.farm_id?.title : "-"}
            {userType !== "USER" ? (
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
          </h1>
        )}
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
