import AlertComponent from "@/components/Core/AlertComponent";
import ErrorMessages from "@/components/Core/ErrorMessages";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { FarmInTaskType, userTaskType } from "@/types/tasksTypes";
import { Button, Grid, TextField, Typography } from "@mui/material";
import {
  DatePicker,
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import { removeTheFilesFromStore } from "@/Redux/Modules/Farms";
import getAllFarmsService from "../../../../../lib/services/FarmsService/getAllFarmsServiceMobile";
import addTaskService from "../../../../../lib/services/TasksService/addTaskService";
import getAllUsersService from "../../../../../lib/services/Users/getAllUsersService";
import { MobileDatePicker } from "@mui/x-date-pickers";
import styles from "./AddTaskMobile.module.css";
import { addDays, startOfDay } from "date-fns";
import "rsuite/dist/rsuite.css";

const AddTask = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [farmData, setFarmData] = useState<Array<FarmInTaskType>>([]);
  const [defaultValue, setDefaultValue] = useState<FarmInTaskType | null>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState<Date | null | string>();
  const [deadlineString, setDeadlineString] = useState("");
  const [status, setStatus] = useState("TO-START");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [statusOptions] = useState<Array<{ value: string; title: string }>>([
    { value: "TO-START", title: "To Start" },
    { value: "INPROGRESS", title: "In Progress" },
    { value: "DONE", title: "Done" },
    { value: "PENDING", title: "Pending" },
    { value: "OVER-DUE", title: "Over-due" },
  ]);
  const [user, setUser] = useState<userTaskType>();
  const [users, setUsers] = useState<Array<userTaskType>>([]);
  const [error, setError] = useState("");

  const [multipleFiles, setMultipleFiles] = useState<any>([]);
  const [taskId, setTaskId] = useState<any>();

  const getAllFarms = async (id = "", userId = "") => {
    setLoading(true);
    let url = "farm/1/1000";

    if (userId) {
      url += `?user_id=${userId}&order_by=title&order_type=asc`;
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

  const addTask = async () => {
    setErrorMessages({});
    setLoading(true);
    let body = {
      assigned_to: user?._id,
      farm_id: defaultValue?._id,
      categories: [],
      deadline: deadlineString ? deadlineString : "",
      description: description ? description : "",
      title: title ? title : "",
      attachments: files,
      status: status,
    };

    let response = await addTaskService({ body: body, token: accessToken });
    if (response?.success) {
      toast.success(response?.message);
      router.push("/users-tasks");
      setTaskId(response?.data?._id);
    } else if (response?.status == 422) {
      setErrorMessages(response?.errors);
    }
    setLoading(false);
  };

  const getAllUsers = async () => {
    const response = await getAllUsersService({ token: accessToken });
    if (response?.success) {
      setUsers(response?.data);
    }
  };
  useEffect(() => {
    if (router.isReady && accessToken) {
      getAllUsers();
    }
  }, [router.isReady, accessToken]);

  const setUploadedFiles = (filesUploaded: any) => {
    setFiles(filesUploaded);
  };

  const captureFarmName = (selectedObject: any) => {
    dispatch(removeTheFilesFromStore([]));
    setFiles([]);
    setMultipleFiles([]);

    if (selectedObject && Object.keys(selectedObject).length) {
      setDefaultValue(selectedObject);
    } else {
      setDefaultValue(null);
    }
  };
  const onChangeUser = async (e: any, value: any) => {
    dispatch(removeTheFilesFromStore([]));
    setFiles([]);
    setMultipleFiles([]);
    setDefaultValue(null);
    setUser(value);
    if (value) await getAllFarms("", value?._id);
    else setFarmData([]);
  };

  const [filestoNullOnFarmChange, setFilestoNullOnFarmChange] = useState(false);

  //
  const afterUploadAttachements = (value: any) => {
    if (value == true) {
      setFiles([]);
      setMultipleFiles([]);
    }
  };

  // const removeFiles = () => {
  //   setFiles([]);
  //   setFilestoNullOnFarmChange(true);
  //   setDeleteFilesDialogOpen(false);
  //   dispatch(removeTheFilesFromStore([]));
  //   setTimeout(() => {
  //     setFilestoNullOnFarmChange(false);
  //   }, 100);
  // };
  return (
    <div className={styles.addTaskPageMobile}>
      <div className={styles.AddTaskHeader}>
        <img
          alt=""
          src="/iconsiconarrowleft.svg"
          onClick={() => router.back()}
        />
        <Typography className={styles.pageTitle}>Add Task</Typography>
        <div id="header-icon" style={{ width: "30px" }}></div>
      </div>

      <form className={styles.addTaskFormContainer}>
        <div className={styles.eachFormBlock}>
          <h4 className={styles.eachFormTitle}>
            Title<span style={{ color: "red" }}>*</span>
          </h4>
          <TextField
            color="primary"
            placeholder="Enter your task title here"
            required={true}
            fullWidth={true}
            size="small"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-notchedOutline ": {
                borderColor: "grey !important",
                borderRadius: "8px !important",
                color: "#000",
              },
              "& .MuiInputBase-input": {
                padding: "12px 14px",
                borderRadius: "8px !important",
                color: "#000",
                background: "#fff",
              },
            }}
          />
          <ErrorMessages errorMessages={errorMessages} keyname="title" />
        </div>
        <div className={styles.eachFormBlock}>
          <h4 className={styles.eachFormTitle}>
            Deadline<span style={{ color: "red" }}>*</span>
          </h4>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileDateTimePicker
              value={deadline}
              disablePast
              format="dd/MM/yyyy hh:mm:ss aa"
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-notchedOutline ": {
                  borderColor: "grey !important",
                  borderRadius: "8px !important",
                  color: "#000",
                },
                "& .MuiInputBase-input": {
                  padding: "12px 14px",
                  borderRadius: "8px !important",
                  color: "#000",
                  background: "#fff",
                },
                "& .MuiInputBase-root": {
                  borderRadius: "8px",
                  border: "1px solid #B4C1D6 ",
                  background: "#fff",
                },
                "& .MuiInputBase-root::before": {
                  borderBottom: "0 !important",
                },
                "& .MuiInputBase-root::after": {
                  borderBottom: "0 !important",
                },
              }}
              onChange={(newValue: any) => {
                let dateNow = new Date(newValue);

                setDeadlineString(
                  new Date(dateNow?.toUTCString())?.toISOString()
                );
                setDeadline(newValue);
              }}
              slotProps={{
                textField: {
                  placeholder: "Select date",
                  variant: "standard",
                  size: "small",
                  color: "primary",
                },
              }}
            />
          </LocalizationProvider>
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}

          <ErrorMessages errorMessages={errorMessages} keyname="deadline" />
        </div>
        <div className={styles.eachFormBlock}>
          <h4 className={styles.eachFormTitle}>Description</h4>
          <TextField
            sx={{
              "& .MuiOutlinedInput-notchedOutline ": {
                borderColor: "grey !important",
                borderRadius: "8px !important",
                color: "#000",
              },
              "& .MuiInputBase-root": {
                padding: "12px 14px",
                borderRadius: "8px !important",
                color: "#000",
                background: "#fff",
              },
            }}
            multiline
            minRows={4}
            maxRows={4}
            color="primary"
            placeholder="Enter your task description here"
            fullWidth={true}
            variant="outlined"
            value={description}
            onChange={(e) => {
              const newValue = e.target.value.replace(/^\s+/, "");
              setDescription(newValue);
            }}
          />
        </div>
        <div className={styles.addTaskBtnGrp}>
          <Button
            onClick={() => router.back()}
            variant="outlined"
            size="medium"
            className={styles.cancelTaskBtn}
          >
            Cancel
          </Button>
          <Button
            onClick={addTask}
            variant="contained"
            size="medium"
            className={styles.addTaskBtn}
          >
            Add
          </Button>
        </div>
      </form>

      <AlertComponent
        alertMessage={alertMessage}
        alertType={alertType}
        setAlertMessage={setAlertMessage}
      />
      <LoadingComponent loading={loading} />
      <Toaster richColors position="top-right" closeButton />
    </div>
  );
};

export default AddTask;
