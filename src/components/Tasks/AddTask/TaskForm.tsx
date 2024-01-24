import ErrorMessages from "@/components/Core/ErrorMessages";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { Grid, TextField } from "@mui/material";
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import addTaskService from "../../../../lib/services/TasksService/addTaskService";
import styles from "./TaskForm.module.css";
import FooterActionButtons from "./footer-action-buttons";

const TaskForm = () => {
  const router = useRouter();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState<Date | null | string>();
  const [deadlineString, setDeadlineString] = useState("");

  const [alertMessage, setAlertMessage] = useState("");

  const [errorMessages, setErrorMessages] = useState({});
  const [loading, setLoading] = useState(false);

  const addTask = async () => {
    setErrorMessages({});
    setLoading(true);
    let body = {
      categories: [],
      deadline: deadlineString ? deadlineString : "",
      description: description ? description : "",
      title: title ? title : "",
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

  return (
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
                              variant: "standard",
                              size: "small",
                              color: "primary",
                            },
                          }}
                        />
                      </LocalizationProvider>
                      <ErrorMessages
                        errorMessages={errorMessages}
                        keyname="deadline"
                      />
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
                </Grid>
              </Grid>
            </form>
            <div style={{ marginTop: "1.5rem" }}>
              <FooterActionButtons addTask={addTask} />
            </div>
          </div>
        </div>
      </div>

      <LoadingComponent loading={loading} />
      <Toaster richColors position="top-right" closeButton />
    </>
  );
};

export default TaskForm;
