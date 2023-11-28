import ErrorMessages from "@/components/Core/ErrorMessages";
import LoadingComponent from "@/components/Core/LoadingComponent";
import timePipe from "@/pipes/timePipe";
import { TaskResponseTypes } from "@/types/tasksTypes";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
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
import Image from "next/image";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { Markup } from "interweave";
import SelectComponent from "@/components/Core/SelectComponent";
import SelectComponentNoAll from "@/components/Core/SelectComponentNoAll";

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
  const [statusOptions] = useState<Array<{ value: string; title: string }>>([
    { value: "TO-START", title: "To Start" },
    { value: "INPROGRESS", title: "In Progress" },
    { value: "DONE", title: "Done" },
    { value: "PENDING", title: "Pending" },
    { value: "OVER-DUE", title: "Over-due" },
  ]);
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

  const getDescriptionData = (description: string) => {
    let temp = description.slice(0, 1).toUpperCase() + description.slice(1);
    let stringWithActualNewLine = temp.replace(/\n/g, "<br/>");
    return stringWithActualNewLine;
  };

  return (
    <div className={styles.cardDetails}>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div className={styles.singleDetailsBox}>
              {editField == "title" && editFieldOrNot ? (
                <div style={{ width: "100%" }}>
                  <TextField
                    placeholder="Enter Title here"
                    sx={{
                      width: "100%",
                      background: "#ffff",
                      // background: "#f5f7fa",
                      // "& .MuiOutlinedInput-notchedOutline": {
                      //   border: "0 !important",
                      // },
                      // background: "#ffff",
                    }}
                    size="small"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              ) : (
                <h1 className={styles.landPreparation}>
                  {data?.title
                    ? data?.title.slice(0, 1).toUpperCase() +
                      data?.title.slice(1)
                    : "-"}
                </h1>
              )}
            </div>
            <div>
              {editField == "title" && editFieldOrNot ? (
                <div className={styles.iconBlock}>
                  <IconButton
                    onClick={() => {
                      setEditFieldOrNot(false);
                      setEditField("");
                    }}
                  >
                    <CloseIcon sx={{ color: "red", fontSize: "1.2rem" }} />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      onUpdateField();
                      // setEditFieldOrNot(false);
                      // setEditField("");
                    }}
                  >
                    <DoneIcon sx={{ color: "green", fontSize: "1.4rem" }} />
                  </IconButton>
                </div>
              ) : userType !== "farmer" ? (
                <IconButton
                  onClick={() => {
                    setEditFieldOrNot(true);
                    setEditField("title");
                  }}
                >
                  <img
                    className={styles.editicon}
                    src="/task-edit-icon.svg"
                    alt=""
                  />
                </IconButton>
              ) : (
                ""
              )}
            </div>
          </div>
          <ErrorMessages errorMessages={errorMessages} keyname="title" />
        </div>
        <div>
          <label className={styles.userLabel} style={{ width: "100px" }}>
            Due Date
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div className={styles.singleDetailsBox}>
              {editField == "deadline" && editFieldOrNot ? (
                <div className={styles.responseDate2} style={{ width: "100%" }}>
                  <div style={{ display: "flex", width: "100%" }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        sx={{
                          width: "100%",
                          "& .MuiButtonBase-root": {
                            paddingRight: "10px !important",
                          },

                          "& .MuiInputBase-root::before": {
                            borderBottom: "0 !important",
                          },
                          "& .MuiInputBase-root::after": {
                            borderBottom: "0 !important",
                          },
                        }}
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
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex" }}>
                  <p className={styles.text}>
                    <CalendarMonthOutlinedIcon sx={{ fontSize: "1rem" }} />
                    {data?.deadline
                      ? timePipe(data?.deadline, "DD, MMM YYYY")
                      : "-"}
                  </p>
                </div>
              )}
            </div>
            <div>
              {editField == "deadline" && editFieldOrNot ? (
                <div className={styles.iconBlock}>
                  <IconButton
                    onClick={() => {
                      setEditFieldOrNot(false);
                      setEditField("");
                    }}
                  >
                    <CloseIcon sx={{ color: "red", fontSize: "1.2rem" }} />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      onUpdateField();
                      // setEditFieldOrNot(false);
                      // setEditField("");
                    }}
                  >
                    <DoneIcon sx={{ color: "green", fontSize: "1.4rem" }} />
                  </IconButton>
                </div>
              ) : userType !== "farmer" ? (
                <IconButton
                  onClick={() => {
                    setEditFieldOrNot(true);
                    setEditField("deadline");
                  }}
                >
                  <img
                    className={styles.editicon}
                    src="/task-edit-icon.svg"
                    alt=""
                  />
                </IconButton>
              ) : (
                ""
              )}
            </div>
          </div>
          <ErrorMessages errorMessages={errorMessages} keyname="deadline" />
        </div>
      </div>
      <div className={styles.viewHeader}>
        <div className={styles.userBlock}>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {userType !== "farmer" ? (
              editField == "farm" && editFieldOrNot ? (
                <div className={styles.iconBlock}>
                  {" "}
                  <IconButton
                    onClick={() => {
                      setEditFieldOrNot(false);
                      setEditField("");
                    }}
                  >
                    <CloseIcon sx={{ color: "red", fontSize: "1.2rem" }} />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      onUpdateField();
                    }}
                  >
                    <DoneIcon sx={{ color: "green", fontSize: "1.4rem" }} />
                  </IconButton>
                </div>
              ) : (
                <IconButton
                  sx={{ display: "none" }}
                  onClick={() => {
                    setEditFieldOrNot(true);
                    setEditField("farm");
                  }}
                >
                  <img
                    className={styles.editicon}
                    src="/task-edit-icon.svg"
                    alt=""
                  />
                </IconButton>
              )
            ) : (
              ""
            )}
          </div>
          <div className={styles.userDetails}>
            <div
              className={styles.singleDetailsBox}
              style={{
                flexDirection: "column",
                alignItems: "flex-start !important",
              }}
            >
              <label className={styles.userLabel}>
                <PersonOutlineOutlinedIcon
                  sx={{ fontSize: "1rem", marginRight: "5px" }}
                />{" "}
                Assignee
              </label>
              {editField == "farm" && editFieldOrNot ? (
                <div style={{ width: "100%" }}>
                  <UserOptionsinViewTasks
                    userId={userId}
                    onChange={(assigned_to: any) => {
                      setFarmId("");
                      setUserId(assigned_to?._id);
                      setErrorMessages({});
                    }}
                  />
                  <ErrorMessages
                    errorMessages={errorMessages}
                    keyname="assigned_to"
                  />
                </div>
              ) : (
                <h1>
                  {data?.assigned_to ? data?.assigned_to?.full_name : "-"}
                </h1>
              )}
            </div>
            <div
              className={styles.singleDetailsBox}
              style={{
                flexDirection: "column",
                alignItems: "flex-start !important",
              }}
            >
              <label className={styles.userLabel}>
                {" "}
                <Image
                  src="/farmshape2.svg"
                  alt=""
                  height={12}
                  width={12}
                  style={{ marginRight: "4px" }}
                />
                Farm
              </label>
              {editField == "farm" && editFieldOrNot ? (
                <div style={{ width: "100%" }}>
                  <FarmOptionsInViewTasks
                    userId={userId}
                    farmId={farmId}
                    onChange={(farm_id: any) => {
                      setFarmId(farm_id?._id);
                      setFarmName(farm_id?.title);
                      setErrorMessages({});
                    }}
                  />
                  <ErrorMessages
                    errorMessages={errorMessages}
                    keyname="farm_id"
                  />
                </div>
              ) : (
                <h1>{data?.farm_id ? data?.farm_id?.title : "-"}</h1>
              )}
            </div>
          </div>
        </div>
        <div className={styles.status}>
          <label className={styles.userLabel}>Status</label>
          <div style={{ width: "100%" }}>
            {userType !== "farmer" ? (
              <SelectComponentNoAll
                options={statusOptions}
                size="small"
                onChange={(e: any) => {
                  setStatus(e.target.value);
                  onChangeStatus(e.target.value);
                }}
                value={status ? status : ""}
              />
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

      <div className={styles.description}>
        <div className={styles.descriptionText}>
          <label className={styles.label}>Description</label>
          {editField == "description" && editFieldOrNot ? (
            <div className={styles.iconBlock}>
              <IconButton
                onClick={() => {
                  setEditFieldOrNot(false);
                  setEditField("");
                }}
              >
                <CloseIcon sx={{ color: "red", fontSize: "1.2rem" }} />
              </IconButton>
              <IconButton
                onClick={() => {
                  onUpdateField();
                  // setEditFieldOrNot(false);
                  // setEditField("");
                }}
              >
                <DoneIcon sx={{ color: "green", fontSize: "1.4rem" }} />
              </IconButton>
            </div>
          ) : userType !== "farmer" ? (
            <div
              onClick={() => {
                setEditFieldOrNot(true);
                setEditField("description");
              }}
              className={styles.editDesc}
            >
              <p style={{ margin: "0" }}>Edit</p>
            </div>
          ) : (
            ""
          )}
        </div>
        {editField == "description" && editFieldOrNot ? (
          <div style={{ width: "100%" }}>
            <TextField
              className={styles.descriptionPara}
              multiline
              minRows={4}
              maxRows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ width: "100%", background: "#f5f7fa" }}
              placeholder="Enter description here"
            />
          </div>
        ) : (
          <p className={styles.farmersPrepareThe}>
            {data?.description ? (
              <Markup content={getDescriptionData(data?.description)} />
            ) : (
              "-"
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
