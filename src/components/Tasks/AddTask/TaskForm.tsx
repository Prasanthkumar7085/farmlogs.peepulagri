import AlertComponent from "@/components/Core/AlertComponent";
import ErrorMessages from "@/components/Core/ErrorMessages";
import LoadingComponent from "@/components/Core/LoadingComponent";
import {
  Autocomplete,
  Button,
  Grid,
  Icon,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import addTaskService from "../../../../lib/services/TasksService/addTaskService";
import FarmAutoCompleteInAddTask from "./FarmAutoCompleteInTasks";
import styles from "./TaskForm.module.css";
import FooterActionButtons from "./footer-action-buttons";
import { FarmInTaskType, userTaskType } from "@/types/tasksTypes";
import { Toaster, toast } from "sonner";
import TasksAttachments from "./TasksAttachments";
import moment from "moment";
import getAllUsersService from "../../../../lib/services/Users/getAllUsersService";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsServiceMobile";
import AlertDelete from "@/components/Core/DeleteAlert/alert-delete";
import AlertDeleteFilesOnFarmChangeInTasks from "@/components/Core/DeleteAlert/AlertDeleteFilesOnFarmChangeInTasks";
import { removeTheFilesFromStore } from "@/Redux/Modules/Farms";

const TaskForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();

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
  const [deleteFilesDialogOpen, setDeleteFilesDialogOpen] = useState(false);

  const [multipleFiles, setMultipleFiles] = useState<any>([]);

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

    let response = await addTaskService({ body: body, token: accessToken });
    if (response?.success) {
      toast.success(response?.message);
      router.push("/tasks");
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

  const onChangeUser = async (e: any, value: any) => {
    setUser(value);
    if (value) await getAllFarms("", value?._id);
    else setFarmData([]);
  };

  const [filestoNullOnFarmChange, setFilestoNullOnFarmChange] = useState(false);

  console.log(files);

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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <>
        <div className={styles.form}>
          <div className={styles.header}>
            <div className={styles.backButton} onClick={() => router.back()}>
              <img src="/arrow-left-back.svg" alt="" width={"18px"} />
            </div>
            <div className={styles.textwrapper}>
              <p className={styles.caption}>Back to List</p>
              <h1 className={styles.header}>Add Task</h1>
            </div>
          </div>
          <form className={styles.formfields}>
            <Grid container rowSpacing={2}>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={8}></Grid>
                  <Grid item xs={4} className={styles.selectfarm}>
                    <label className={styles.lable}>
                      Deadline<span style={{ color: "red" }}>*</span>
                    </label>
                    <DatePicker
                      value={deadline}
                      disablePast
                      format="dd/MM/yyyy"
                      sx={{
                        width: "100%",
                        "& .MuiInputBase-root": {
                          padding: "5px 10px",
                          borderRadius: "4px",
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
                        setDeadline(newValue);
                      }}
                      slotProps={{
                        textField: {
                          variant: "standard",
                          size: "small",
                          color: "primary",
                        },
                      }}
                    />
                    <ErrorMessages
                      errorMessages={errorMessages}
                      keyname="deadline"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container columnSpacing={2}>
                  <Grid item xs={6} className={styles.selectfarm}>
                    <label className={styles.lable}>
                      {`Select User `}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <Autocomplete
                      sx={{
                        width: "100%",
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
                      renderOption={(props, option: any) => {
                        return (
                          <li {...props} key={option._id}>
                            {option.full_name}
                          </li>
                        );
                      }}
                      getOptionLabel={(option: any) => option.full_name}
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
                    <ErrorMessages
                      errorMessages={errorMessages}
                      keyname="assigned_to"
                    />
                  </Grid>
                  <Grid item xs={6}>
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
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container columnSpacing={2}>
                  <Grid item xs={8}>
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
                        size="small"
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                      <ErrorMessages
                        errorMessages={errorMessages}
                        keyname="title"
                      />
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div className={styles.selectfarm}>
                      <h4 className={styles.title}>
                        Status<span style={{ color: "red" }}></span>
                      </h4>
                      <Select
                        className={styles.inoutbox}
                        color="primary"
                        size="small"
                        placeholder="Enter your Task title here"
                        variant="outlined"
                        fullWidth
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        defaultValue="TODO"
                      >
                        {statusOptions.map((item: string, index: number) => (
                          <MenuItem key={index} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
                <TasksAttachments
                  farmId={defaultValue?._id}
                  setUploadedFiles={setUploadedFiles}
                  multipleFiles={multipleFiles}
                  setMultipleFiles={setMultipleFiles}
                />
              </Grid>
            </Grid>
          </form>
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
      {/* <AlertDeleteFilesOnFarmChangeInTasks
        open={deleteFilesDialogOpen}
        deleteFiles={removeFiles}
        setDialogOpen={setDeleteFilesDialogOpen}
      /> */}
    </LocalizationProvider>
  );
};

export default TaskForm;
