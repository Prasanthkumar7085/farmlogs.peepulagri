import ErrorMessages from "@/components/Core/ErrorMessages";
import LoadingComponent from "@/components/Core/LoadingComponent";
import timePipe from "@/pipes/timePipe";
import { TaskResponseTypes } from "@/types/tasksTypes";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import { IconButton, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import updateTaskStatusService from "../../../../lib/services/TasksService/updateTaskStatusService";
import styles from "./TaskDetails.module.css";
import UserOptionsinViewTasks from "./UserOptionsinViewTasks";
import Image from "next/image";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { Markup } from "interweave";
import SelectComponentNoAll from "@/components/Core/SelectComponentNoAll";
import { useRouter } from "next/router";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import dayjs from "dayjs";
interface PropsType {
  data: TaskResponseTypes | null | undefined;
  updateTask: (body: any) => any;
  getTaskById: (id: string) => void;
  hasEditAccess: boolean | undefined;
}
const TaskDetails: React.FC<PropsType> = ({
  data,
  updateTask,
  getTaskById,
  hasEditAccess,
}) => {
  const router = useRouter();
  const id = router.query.task_id;
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const userType_v2 = useSelector(
    (state: any) => state.auth.userDetails?.user_details?.user_type
  );
  const loggedInUserId = useSelector(
    (state: any) => state.auth.userDetails?.user_details?._id
  );
  const [editFieldOrNot, setEditFieldOrNot] = useState(false);
  const [deleteFieldOrNot, setDeleteFieldOrNot] = useState(false);
  const [editField, setEditField] = useState("");
  const [deleteField, setDeleteField] = useState("");
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState<any>();
  const [deadline, setDeadline] = useState<Date | string | any>(null);
  const [deadlineString, setDeadlineString] = useState("");

  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const [statusOptions] = useState<Array<{ value: string; title: string }>>([
    { value: "TO-START", title: "To-Start" },
    { value: "INPROGRESS", title: "In-Progress" },
    { value: "DONE", title: "Done" },
    // { value: "OVER-DUE", title: "Over-due" },
  ]);
  const [farmId, setFarmId] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState<any | null>(null);
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>([]);

  useEffect(() => {
    setErrorMessages({});
    setTitle(data?.title ? data?.title : "");
    setDeadline(data?.deadline ? new Date(data?.deadline) : "");
    setDescription(data?.description ? data?.description : "");
    setStatus(data?.status ? data?.status : "");
    setFarmId(data?.farm_id ? data?.farm_id?._id : "");
    setUserId(data?.assigned_to?._id as string);
    setAssignee(data?.assign_to);
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

  const addAssignee = async () => {
    setLoading(true);

    try {
      if (selectedAssignee) {
        let body = {
          assign_to: selectedAssignee.map((user: any) => user._id),
        };
        let options = {
          method: "POST",
          headers: new Headers({
            "content-type": "application/json",
            authorization: accessToken,
          }),
          body: JSON.stringify(body),
        };

        let response: any = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}/assignee`,
          options
        );
        let responseData = await response.json();

        if (responseData?.success) {
          getTaskById(id as string);
          setEditFieldOrNot(false);
          setEditField("");
          toast.success(responseData?.message);
        } else {
          toast.error(responseData?.message);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAssignee = async () => {
    setLoading(true);

    try {
      if (selectedAssigneeIds.length > 0) {
        let body = {
          assign_to: selectedAssigneeIds,
        };

        let options = {
          method: "DELETE",
          headers: new Headers({
            "content-type": "application/json",
            authorization: accessToken,
          }),
          body: JSON.stringify(body),
        };

        let response: any = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}/assignee`,
          options
        );
        let responseData = await response.json();

        if (responseData?.success) {
          getTaskById(id as string);
          setDeleteFieldOrNot(false);
          setDeleteField("");
          setSelectedAssigneeIds([]);
          toast.success(responseData?.message);
        } else {
          toast.error(responseData?.message);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssigneeCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    assigneeId: string
  ) => {
    if (e.target.checked) {
      setSelectedAssigneeIds((prevIds) => [...prevIds, assigneeId]);
    } else {
      setSelectedAssigneeIds((prevIds) =>
        prevIds.filter((id) => id !== assigneeId)
      );
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
      await getTaskById(router.query.task_id as string);
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
  const today = new Date();
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
              ) : (
                <>
                  {status !== "DONE" &&
                  loggedInUserId == data?.created_by?._id ? (
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
                </>
              )}
            </div>
          </div>
          <ErrorMessages errorMessages={errorMessages} keyname="title" />
        </div>
        {/* <h1 className={styles.landPreparation}>
          {data?.created_by.name ? data?.created_by.name : "-"}
        </h1> */}
        <div>
          <label className={styles.userLabel} style={{ width: "100px" }}>
            Due Date
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              className={styles.singleDetailsBox}
              style={{ display: "flex" }}
            >
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
                        value={dayjs(deadline)}
                        onChange={(newValue: any) => {
                          let dateNow = new Date();
                          let dateWithPresentTime = moment(new Date(newValue))
                            .set({
                              hour: dateNow.getHours(),
                              minute: dateNow.getMinutes(),
                              second: dateNow.getSeconds(),
                              millisecond: dateNow.getMilliseconds(),
                            })
                            .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

                          setDeadlineString(dateWithPresentTime);
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
              ) : (
                <>
                  {status !== "DONE" &&
                  loggedInUserId == data?.created_by?._id ? (
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
                </>
              )}
            </div>
          </div>
          <div>
            <ErrorMessages errorMessages={errorMessages} keyname="deadline" />
          </div>
        </div>
      </div>
      <div className={styles.viewHeader}>
        <div className={styles.userBlock}>
          <div className={styles.userDetails}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <label className={styles.userLabel}>
                <PersonOutlineOutlinedIcon
                  sx={{ fontSize: "1rem", marginRight: "5px" }}
                />
                Assignee
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <div>
                  {deleteField == "assignee" &&
                  deleteFieldOrNot &&
                  hasEditAccess ? (
                    <div className={styles.iconBlock}>
                      <IconButton
                        onClick={() => {
                          setDeleteFieldOrNot(false);
                          setDeleteField("");
                          setSelectedAssigneeIds([]);
                        }}
                      >
                        <CloseIcon sx={{ color: "red", fontSize: "1.2rem" }} />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          deleteAssignee();
                        }}
                        disabled={
                          selectedAssigneeIds.length === 0 ||
                          status === "DONE" ||
                          !hasEditAccess
                        }
                      >
                        <DeleteForeverIcon
                          sx={{ color: "green", fontSize: "1.4rem" }}
                        />
                      </IconButton>
                    </div>
                  ) : data?.assign_to?.length &&
                    !(editField == "assignee" && editFieldOrNot) ? (
                    <>
                      {status !== "DONE" &&
                      loggedInUserId == data?.created_by?._id ? (
                        <IconButton
                          onClick={() => {
                            setDeleteFieldOrNot(true);
                            setDeleteField("assignee");
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
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  {editField == "assignee" && editFieldOrNot ? (
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
                          addAssignee();
                        }}
                      >
                        <DoneIcon sx={{ color: "green", fontSize: "1.4rem" }} />
                      </IconButton>
                    </div>
                  ) : !(deleteField == "assignee" && deleteFieldOrNot) ? (
                    <>
                      {status !== "DONE" &&
                      (loggedInUserId == data?.created_by?._id ||
                        hasEditAccess) ? (
                        <IconButton
                          onClick={() => {
                            setEditFieldOrNot(true);
                            setEditField("assignee");
                          }}
                        >
                          <img
                            className={styles.addicon}
                            src="/add-plus-icon.svg"
                            alt=""
                          />
                        </IconButton>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div>
              {editField == "assignee" && editFieldOrNot ? (
                <div style={{ width: "100%" }}>
                  <UserOptionsinViewTasks
                    userId={userId}
                    assignee={assignee}
                    onChange={(assigned_to: any) => {
                      setSelectedAssignee(assigned_to);
                      setFarmId("");
                      setUserId(assigned_to[0]?._id);
                      setErrorMessages({});
                    }}
                  />
                  <ErrorMessages
                    errorMessages={errorMessages}
                    keyname="assign_to"
                  />
                </div>
              ) : (
                ""
              )}
              <div className={styles.allAsigneeGrp}>
                {data?.assign_to
                  ? data?.assign_to.map(
                      (item: { _id: string; name: string }, index: number) => {
                        return (
                          <div key={index} className={styles.singleAsignee}>
                            {deleteField == "assignee" && deleteFieldOrNot ? (
                              <input
                                type="checkbox"
                                onChange={(e) =>
                                  handleAssigneeCheckboxChange(e, item._id)
                                }
                              />
                            ) : (
                              ""
                            )}
                            {item.name},
                          </div>
                        );
                      }
                    )
                  : "-"}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.status}>
          <label className={styles.userLabel}>Status</label>
          <div style={{ width: "100%" }}>
            <SelectComponentNoAll
              options={statusOptions}
              disabled={
                status === "DONE" ||
                !(!(loggedInUserId != data?.created_by?._id) || !hasEditAccess)
              }
              size="small"
              onChange={(e: any) => {
                // setStatus(e.target.value);
                onChangeStatus(e.target.value);
              }}
              value={status ? status : ""}
            />
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
          ) : userType_v2 !== "farmer" ? (
            <>
              {status !== "DONE" && loggedInUserId == data?.created_by?._id ? (
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
            </>
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
              onChange={(e) => {
                const newValue = e.target.value.replace(/^\s+/, "");
                setDescription(newValue);
              }}
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
