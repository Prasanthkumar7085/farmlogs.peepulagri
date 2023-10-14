import AlertComponent from "@/components/Core/AlertComponent";
import ErrorMessages from "@/components/Core/ErrorMessages";
import LoadingComponent from "@/components/Core/LoadingComponent";
import {
  Autocomplete,
  Button,
  Icon,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import addTaskService from "../../../../lib/services/TasksService/addTaskService";
import FarmAutoCompleteInAddTask from "./FarmAutoCompleteInAddTask";
import styles from "./TaskForm.module.css";
import FooterActionButtons from "./footer-action-buttons";
import { FarmInTaskType, userTaskType } from "@/types/tasksTypes";
import { Toaster, toast } from "sonner";
import TasksAttachments from "./TasksAttachments";
import moment from "moment";
import getAllUsersService from "../../../../lib/services/Users/getAllUsersService";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsServiceMobile";

const TaskForm = ({ data }: any) => {
  const router = useRouter();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [farmData, setFarmData] = useState<Array<FarmInTaskType>>([]);
  const [defaultValue, setDefaultValue] = useState<FarmInTaskType | null>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState<Date>();
  const [status, setStatus] = useState("TODO");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [statusOptions] = useState(["TODO", "IN-PROGRESS", "COMPLETED"]);
  const [user, setUser] = useState<userTaskType>();
  const [users, setUsers] = useState<Array<userTaskType>>([]);

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

  const captureFarmName = (selectedObject: any) => {
    if (selectedObject && Object.keys(selectedObject).length) {
      setDefaultValue(selectedObject);
    } else {
      setDefaultValue(null);
    }
  };
  const addTask = async () => {
    setErrorMessages({});
    setLoading(true);
    let body = {
      assigned_to: user?._id,
      farm_id: defaultValue?._id,
      categories: [],
      deadline: deadline
        ? moment(deadline)
          .utcOffset("+05:30")
          .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        : "",
      description: description ? description : "",
      title: title ? title : "",
      attachments: files,
      status: status,
    };
    console.log(body);

    let response = await addTaskService({ body: body, token: accessToken });
    if (response?.success) {
      toast.success(response?.message);
      gotoBackAfterAdd();
    } else if (response?.status == 422) {
      setErrorMessages(response?.errors);
    }
    setLoading(false);
  };

  const getAllUsers = async () => {
    const response = await getAllUsersService({ token: accessToken });
    if (response.success) {
      setUsers(response?.data);
    }
  };
  useEffect(() => {
    if (router.isReady && accessToken) {
      getAllUsers();
      // if (router.query.task_id && data) {
      //   setDataInEdit();
      //   // getAllFarms(data?.farm_id);
      // } else {
      //   getAllFarms();
      // }
    }
  }, [router.isReady, accessToken, data]);

  const setDataInEdit = () => {
    setTitle(data?.title);
    setDescription(data?.description);
    setDeadline(new Date(data?.deadline));
  };

  const setUploadedFiles = (filesUploaded: any) => {
    setFiles(filesUploaded);
  };

  const gotoBack = async () => {
    await router.back();
    setTimeout(() => {
      router.reload();
    }, 200);
  };

  const gotoBackAfterAdd = async () => {
    router.push("/tasks");
    setTimeout(() => {
      router.reload();
    }, 1000);
  };

  const onChangeUser = async (e: any, value: any) => {
    setUser(value);
    if (value) await getAllFarms("", value?._id);
    else setFarmData([]);
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <>
        <div className={styles.form}>
          <div className={styles.header}>
            <Button
              onClick={gotoBack}
              className={styles.backbutton}
              sx={{ width: 40 }}
              color="primary"
              name="Back"
              variant="contained"
              startIcon={<Icon>arrow_back_sharp</Icon>}
            />
            <div className={styles.textwrapper}>
              <p className={styles.smalltext}>{`Back to List `}</p>
              <h1 className={styles.largetext}>Add Task</h1>
            </div>
          </div>
          <div className={styles.container}>
            <form className={styles.formfields}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <label className={styles.lable}>
                    {`Select Farm`}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <Autocomplete
                    sx={{
                      width: "250px",
                      maxWidth: "250px",
                      borderRadius: "4px",
                    }}
                    id="size-small-outlined-multi"
                    size="small"
                    fullWidth
                    noOptionsText={"No such User"}
                    value={user}
                    isOptionEqualToValue={(option: any, value: any) =>
                      option._id === value._id
                    }
                    renderOption={(props, option) => {
                      return (
                        <li {...props} key={option._id}>
                          {option.phone}
                        </li>
                      );
                    }}
                    getOptionLabel={(option: any) => option.phone}
                    options={users}
                    onChange={onChangeUser}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Search by User Mobile"
                        variant="outlined"
                        size="small"
                        sx={{
                          "& .MuiInputBase-root": {
                            fontSize: "clamp(.875rem, 1vw, 1.125rem)",
                            backgroundColor: "#fff",
                            border: "none",
                          },
                        }}
                      />
                    )}
                  />
                </div>
                <div className={styles.selectfarm}>
                  <label className={styles.lable}>
                    {`Select Farm`}
                    <span style={{ color: "red" }}>*</span>
                  </label>

                  <FarmAutoCompleteInAddTask
                    options={farmData}
                    label={"title"}
                    onSelectValueFromDropDown={captureFarmName}
                    placeholder={"Select Farm"}
                    defaultValue={defaultValue}
                    loading={false}
                  />

                  <ErrorMessages
                    errorMessages={errorMessages}
                    keyname="farm_id"
                  />
                </div>
              </div>
              <div className={styles.selectfarm}>
                <h4 className={styles.title}>
                  Title<span style={{ color: "red" }}>*</span>
                </h4>
                <TextField
                  className={styles.inoutbox}
                  color="primary"
                  placeholder="Enter your Task title here"
                  required={true}
                  fullWidth={true}
                  variant="outlined"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <ErrorMessages errorMessages={errorMessages} keyname="title" />
              </div>
              <div className={styles.selectfarm}>
                <h4 className={styles.title}>
                  Status<span style={{ color: "red" }}></span>
                </h4>
                <Select
                  className={styles.inoutbox}
                  color="primary"
                  placeholder="Enter your Task title here"
                  variant="outlined"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  sx={{ width: "200px" }}
                  defaultValue="TODO"
                >
                  {statusOptions.map((item: string, index: number) => (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </div>

              <div className={styles.selectfarm}>
                <label className={styles.lable}>
                  Deadline<span style={{ color: "red" }}>*</span>
                </label>
                <div className={styles.backbutton}>
                  <DatePicker
                    value={deadline}
                    disablePast
                    onChange={(newValue: any) => {
                      setDeadline(newValue);
                    }}
                    slotProps={{
                      textField: {
                        variant: "standard",
                        size: "medium",
                        color: "primary",
                      },
                    }}
                  />
                  <ErrorMessages
                    errorMessages={errorMessages}
                    keyname="deadline"
                  />
                </div>
              </div>
              <div className={styles.selectfarm}>
                <label className={styles.lable}>Description</label>
                <TextField
                  multiline
                  minRows={4}
                  maxRows={4}
                  className={styles.inoutbox}
                  color="primary"
                  placeholder="Enter your Task title here"
                  fullWidth={true}
                  variant="outlined"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <TasksAttachments
                farmId={defaultValue?._id}
                setUploadedFiles={setUploadedFiles}
              />
            </form>
          </div>
        </div>
        <FooterActionButtons addTask={addTask} />
      </>
      <AlertComponent
        alertMessage={alertMessage}
        alertType={alertType}
        setAlertMessage={setAlertMessage}
      />
      <LoadingComponent loading={loading} />
      <Toaster richColors position="top-right" closeButton />
    </LocalizationProvider>
  );
};

export default TaskForm;
