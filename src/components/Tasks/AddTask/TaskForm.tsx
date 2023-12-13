import AlertComponent from "@/components/Core/AlertComponent";
import ErrorMessages from "@/components/Core/ErrorMessages";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { FarmInTaskType, userTaskType } from "@/types/tasksTypes";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsServiceMobile";
import addTaskService from "../../../../lib/services/TasksService/addTaskService";
import getAllUsersService from "../../../../lib/services/Users/getAllUsersService";
import styles from "./TaskForm.module.css";
import FooterActionButtons from "./footer-action-buttons";
import { removeTheFilesFromStore } from "@/Redux/Modules/Farms";
import TasksAttachments from "./TasksAttachments";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
  const [deadline, setDeadline] = useState<Date | null>();
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
          <div style={{ width: "100%" }}>
            <div className={styles.formBlcok}>
              <form className={styles.formfields}>
                <Grid container rowSpacing={2}>
                  {/* <Grid item xs={12}>
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
                          placeholder="Search by user"
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
              </Grid> */}
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
                            placeholder="Enter your task title here"
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
                            const currentDate = new Date();
                            if (newValue < currentDate) {
                              setError("Please select a future date");
                              setDeadline(null);
                            } else {
                              setError("");
                              setDeadline(newValue);
                            }
                          }}
                          slotProps={{
                            textField: {
                              variant: "standard",
                              size: "small",
                              color: "primary",
                            },
                          }}
                        />
                        {error && (
                          <Typography variant="body2" color="error">
                            {error}
                          </Typography>
                        )}

                        <ErrorMessages
                          errorMessages={errorMessages}
                          keyname="deadline"
                        />
                      </Grid>

                      {/* <Grid item xs={4}>
                    <div className={styles.selectfarm}>
                      <h4 className={styles.title}>
                        Status<span style={{ color: "red" }}></span>
                      </h4>
                      <SelectComponentNoAll
                        options={statusOptions}
                        size="small"
                        onChange={(e: any) => setStatus(e.target.value)}
                        value={status ? status : ""}
                      />
                    </div>
                  </Grid> */}
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
                        placeholder="Enter your task description here"
                        fullWidth={true}
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </Grid>
                </Grid>
              </form>
              <div style={{ marginTop: "1.5rem" }}>
                <FooterActionButtons addTask={addTask} />
              </div>
              {/* {taskId ? <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <Button onClick={() => router.back()} variant="contained" className={styles.goBackBtn}><ArrowBackIcon />Go Back</Button>
              </div> :
                <FooterActionButtons addTask={addTask} />} */}
              {/* {taskId ?
                <TasksAttachments
                  taskId={taskId}
                  setUploadedFiles={setUploadedFiles}
                  multipleFiles={multipleFiles}
                  setMultipleFiles={setMultipleFiles}
                  afterUploadAttachements={afterUploadAttachements}
                /> : ""} */}
            </div>
          </div>
        </div>
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
