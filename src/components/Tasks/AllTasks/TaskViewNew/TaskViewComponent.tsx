import ErrorMessages from "@/components/Core/ErrorMessages";
import LoadingComponent from "@/components/Core/LoadingComponent";
import timePipe from "@/pipes/timePipe";
import { TaskAttachmentsType, TaskResponseTypes } from "@/types/tasksTypes";
import CloseIcon from "@mui/icons-material/Close";
import { Avatar, Button, Card, Checkbox, CircularProgress, Fade, IconButton, Menu, MenuItem, TextField } from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Markup } from "interweave";
import moment from "moment";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import deleteTaskAttachmentService from "../../../../../lib/services/TasksService/deleteTaskAttachmentService";
import getTaskByIdService from "../../../../../lib/services/TasksService/getTaskByIdService";
import updateTaskService from "../../../../../lib/services/TasksService/updateTaskService";
import updateTaskStatusService from "../../../../../lib/services/TasksService/updateTaskStatusService";
import TasksAttachments from "../../AddTask/TasksAttachments";
import UserOptionsinViewTasks from "../../ViewTask/UserOptionsinViewTasks";
import ViewLogs from "../../ViewTask/ViewLogs";
import styles from "./TaskViewComponent.module.css";
import getImageSrcUrl from "@/pipes/getImageSrcUrl";
import deleteAssigneeInTaskService from "../../../../../lib/services/TasksService/deleteAssigneeInTaskService";
import updateTaskDeadlineService from "../../../../../lib/services/TasksService/updateTaskDeadlineService";

const TaskViewComponent = () => {
  const router = useRouter();
  const [attachmentData, setAttachmentData] = useState<any>();
  const [uploadAttachmentsOpen, setUploadAttachmentsOpen] = useState(false);
  const [selectedAttachmentIds, setSelectedAttachmentsIds] = useState<
    Array<string>
  >([]);
  const [openLogs, setOpenLogs] = useState(false);

  const [editField, setEditField] = useState("");
  const [editFieldOrNot, setEditFieldOrNot] = useState(false);
  const [title, setTitle] = useState("");
  const [deadlineString, setDeadlineString] = useState<Date | string | any>("");
  const [description, setDescription] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [assignee, setAssignee] = useState<any>();
  const [status, setStatus] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState<any | null>(null);
  const [deleteField, setDeleteField] = useState("");
  const [deleteFieldOrNot, setDeleteFieldOrNot] = useState(false);

  const [data, setData] = useState<TaskResponseTypes | null | any>({});
  const [loading, setLoading] = useState(true);
  const [hasEditAccess, setHasEditAccess] = useState<boolean | undefined>(
    false
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [multipleFiles, setMultipleFiles] = useState<any>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorAssignyEl, setAnchorAssignyEl] = useState<null | HTMLElement>(
    null
  );
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>([]);
  const [statusOptions] = useState<Array<{ value: string; title: string }>>([
    { value: "TO-START", title: "To-Start" },
    { value: "INPROGRESS", title: "In-Progress" },
    { value: "DONE", title: "Done" },
    { value: "OVER-DUE", title: "Over-due" },
  ]);
  const [farmId, setFarmId] = useState("");
  const [userId, setUserId] = useState("");

  const [downloadImageId, setDownloadImageId] = useState("");

  const id = router.query.task_id as string;

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const assignyOpen = Boolean(anchorAssignyEl);
  const handleAssignyClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorAssignyEl(event.currentTarget);
  };
  const handleAssignyClose = () => {
    setAnchorAssignyEl(null);
  };

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const loggedInUserId = useSelector(
    (state: any) => state.auth.userDetails?.user_details?._id
  );
  useEffect(() => {
    setErrorMessages({});
    setTitle(data?.title ? data?.title : "");
    setDeadlineString(data?.deadline ? data?.deadline : "");
    setDescription(data?.description ? data?.description : "");
    setStatus(data?.status ? data?.status : "");
    setFarmId(data?.farm_id ? data?.farm_id?._id : "");
    setUserId(data?.assigned_to?._id as string);
    setAssignee(data?.assign_to);
  }, [data, editFieldOrNot]);

  //Get Task by Id
  const getTaskById = async (id: string) => {
    setLoading(true);
    const response = await getTaskByIdService({
      taskId: id,
      token: accessToken,
    });

    if (response?.success) {
      setData(response?.data);

      setHasEditAccess(
        response?.data?.assign_to?.some(
          (item: any) => item?._id == loggedInUserId
        )
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    if (router.isReady && accessToken && router.query.task_id) {
      getTaskById(router.query.task_id as string);
    }
  }, [router.isReady, accessToken, router.query.task_id]);
  //description data getting
  const getDescriptionData = (description: string) => {
    let temp = description.slice(0, 1).toUpperCase() + description.slice(1);
    let stringWithActualNewLine = temp.replace(/\n/g, "<br/>");
    return stringWithActualNewLine;
  };
  //getting all attachements
  function groupByDate(array: Array<any>) {
    const groupedByDate = array.reduce((result, obj) => {
      const dateKey = obj.createdAt.split("T")[0]; // Extract the date from the timestamp
      if (!result[dateKey]) {
        result[dateKey] = [];
      }
      result[dateKey].push(obj);
      return result;
    }, {});
    return Object.values(groupedByDate).reverse();
  }
  const getAllAttachments = async () => {
    setLoading(true);
    let options = {
      method: "GET",
      headers: new Headers({
        authorization: accessToken,
      }),
    };
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${router?.query?.task_id}/attachments`,
        options
      );
      let responseData = await response.json();
      if (responseData.status >= 200 && responseData.status <= 300) {
        // let modifiedData = groupByDate(responseData?.data?.attachments);
        setAttachmentData([...responseData?.data?.attachments.reverse()]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady && accessToken) {
      getAllAttachments();
    }
  }, [router.isReady, accessToken]);
  //select images for delete
  const selectImagesForDelete = (
    e: ChangeEvent<HTMLInputElement>,
    item: TaskAttachmentsType
  ) => {
    setUploadAttachmentsOpen(false);
    let ids = [...selectedAttachmentIds];
    if (ids.includes(item?._id)) {
      ids = ids.filter((itemId: string) => itemId !== item?._id);
    } else {
      ids.push(item?._id);
    }
    setSelectedAttachmentsIds(ids);
  };
  //download attachment
  const downLoadAttachements = async (file: any, name: string, id: string) => {

    setDownloadImageId(id);
    try {
      if (file) {
        fetch(file)
          .then((response) => {
            // Get the filename from the response headers
            const contentDisposition = response.headers.get(
              "content-disposition"
            );
            let filename = "downloaded_file"; // Default filename if not found in headers
            if (name) {
              filename = name;
            }

            if (contentDisposition) {
              const filenameMatch = contentDisposition.match(/filename="(.+)"/);
              if (filenameMatch && filenameMatch.length > 1) {
                filename = filenameMatch[1];
              }
            }

            // Create a URL for the blob
            return response.blob().then((blob) => ({ blob, filename }));
          })
          .then(({ blob, filename }) => {
            const blobUrl = window.URL.createObjectURL(blob);

            const downloadLink = document.createElement("a");
            downloadLink.href = blobUrl;
            downloadLink.download = filename; // Use the obtained filename
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            // Clean up the blob URL
            window.URL.revokeObjectURL(blobUrl);
            toast.success("Attachement downloaded successfully");
          })
          .catch((error) => {
            console.error("Error downloading file:", error);
          });
        // setAlertMessage("Attachement downloaded successfully")
        // setAlertType(true)
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        setDownloadImageId("");
      }, 500);
    }
  };

  //delete selected images

  const deleteSelectedImages = async () => {
    setDeleteLoading(true);

    let response = await deleteTaskAttachmentService({
      token: accessToken,
      taskId: data?._id as string,
      body: { attachment_ids: selectedAttachmentIds },
    });

    if (response?.success) {
      toast.success(response?.message);
      setSelectedAttachmentsIds([]);
      getAllAttachments();
    } else {
      toast.error(response?.message);
    }

    setDeleteLoading(false);
  };
  const setUploadedFiles = (filesUploaded: any) => {
    setFiles(filesUploaded);
  };

  //after upload attachements
  const afterUploadAttachements = (value: any) => {
    if (value == true) {
      setUploadAttachmentsOpen(!uploadAttachmentsOpen);
      setFiles([]);
      setMultipleFiles([]);
      getAllAttachments();
    }
  };

  //status change api
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
  //updated farm title api
  const onUpdateField = async ({
    deadlineProp,
  }: Partial<{ deadlineProp: string }>) => {
    setLoading(true);
    let body = {
      ...data,
      assigned_to: userId,
      farm_id: farmId,
      deadline: deadlineProp
        ? deadlineProp
        : deadlineString
          ? moment(deadlineString)
            .utcOffset("+05:30")
            .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          : "",
      description: description ? description : "",
      title: title ? title : "",
      status: status,
    };
    const response = await updateTaskService({
      taskId: data?._id as string,
      body: body,
      token: accessToken,
    });
    if (response?.success) {
      toast.success(response?.message);
      await getTaskById(router.query.task_id as string);
      setEditFieldOrNot(false);
      setEditField("");
    } else {
      if (response?.errors) {
        setErrorMessages(response?.errors);
      }
    }
    setLoading(false);
    // return response;
  };
  const onUpdateDeadlineField = async ({
    deadlineProp,
  }: Partial<{ deadlineProp: string }>) => {
    setLoading(true);
    let body = {


      deadline: deadlineProp
        ? deadlineProp
        : deadlineString
          ? moment(deadlineString)
            .utcOffset("+05:30")
            .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          : "",

    };
    const response = await updateTaskDeadlineService({
      taskId: data?._id as string,
      body: body,
      token: accessToken,
    });
    if (response?.success) {
      toast.success(response?.message);
      await getTaskById(router.query.task_id as string);
      setEditFieldOrNot(false);
      setEditField("");
    } else {
      if (response?.errors) {
        setErrorMessages(response?.errors);
      }
    }
    setLoading(false);
    // return response;
  };

  //select assingee for delete
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
  //delete assignee
  const deleteAssignee = async () => {
    setLoading(true);

    try {
      if (selectedAssigneeIds.length > 0) {
        let body = {
          assign_to: selectedAssigneeIds,
        };

        let response = await deleteAssigneeInTaskService({ id: id, token: accessToken, body: body })

        if (response?.success) {
          setDeleteFieldOrNot(false);
          setDeleteField("");
          setSelectedAssigneeIds([]);
          getTaskById(id as string);
          toast.success(response?.message);
        } else {
          toast.error(response?.message);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  //add assignee aapi
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
          setSelectedAssignee([])
          toast.success(responseData?.message);
        } else if (responseData?.status == 422) {
          toast.error(responseData?.errors?.assign_to);
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

  const [calenderOpen, setCalenderOpen] = useState(false);
  const handleCalenderOpen = () => setCalenderOpen(true);
  const handleCalenderClose = () => setCalenderOpen(false);


  return (
    <div className={styles.taskViewPage}>
      <div>
        <Button className={styles.backBtn} onClick={() => router.back()}>
          {" "}
          <img src="/viewTaskIcons/back-icon.svg" alt="" width="18px" />{" "}
        </Button>
      </div>
      <div className={styles.taskViewPageContainer}>
        <Card className={styles.taskViewBlock}>
          <div className={styles.taskDetailsBlock}>
            <div className={styles.blockHeading}>
              <p className={styles.viewTask}>View TAsk</p>

              {editField == "title" && editFieldOrNot ? (
                <div style={{ width: "100%" }}>
                  <TextField
                    placeholder="Enter Title here"
                    sx={{
                      width: "100%",
                      background: "#ffff",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#45A845 !important",
                        borderRadius: "8px !important",
                      },
                    }}
                    size="small"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <ErrorMessages
                    errorMessages={errorMessages}
                    keyname="title"
                  />
                </div>
              ) : (
                <div>
                  {status !== "DONE" &&
                    loggedInUserId == data?.created_by?._id ? (
                    <h6
                      className={styles.farmTitle}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setEditField("title");
                        setEditFieldOrNot(true);
                      }}
                    >
                      {data?.title
                        ? data?.title.slice(0, 1).toUpperCase() +
                        data?.title.slice(1)
                        : "-"}
                    </h6>
                  ) : (
                    <h6 className={styles.farmTitle}>
                      {data?.title
                        ? data?.title.slice(0, 1).toUpperCase() +
                        data?.title.slice(1)
                        : "-"}
                    </h6>
                  )}
                </div>
              )}
              {editField == "title" && editFieldOrNot ? (
                <div className={styles.editModeBtnGrp}>
                  <IconButton
                    sx={{ padding: "0" }}
                    onClick={() => {
                      setEditField("");
                      setEditFieldOrNot(false);
                    }}
                  >
                    <img
                      src="/viewTaskIcons/cancel-icon.svg"
                      alt=""
                      width={"20px"}
                    />
                  </IconButton>

                  <IconButton
                    sx={{ padding: "0" }}
                    onClick={() => {
                      onUpdateField({});
                    }}
                  >
                    <img
                      src="/viewTaskIcons/confirm-icon.svg"
                      alt=""
                      width={"20px"}
                    />
                  </IconButton>
                </div>
              ) : (
                ""
              )}

              <div>
                <p
                  className={styles.statusButtton}
                  style={{
                    cursor:
                      status !== "DONE" &&
                        (loggedInUserId == data?.created_by?._id || hasEditAccess)
                        ? "pointer"
                        : "default",
                  }}
                  onClick={(e) =>
                    status !== "DONE" &&
                      (loggedInUserId == data?.created_by?._id || hasEditAccess)
                      ? handleClick(e)
                      : ""
                  }
                >
                  {data?.status
                    ? statusOptions?.find((item) => item.value == data?.status)
                      ?.title
                    : ""}
                </p>

                {/* {status !== "DONE" &&
                                    (loggedInUserId == data?.created_by?._id || hasEditAccess) ? (
                                    <p className={styles.statusButtton} style={{ cursor: "pointer" }} onClick={handleClick}>
                                        {data?.status ? statusOptions?.find((item) => item.value == data?.status)?.title : ""}
                                    </p>) : (<p className={styles.statusButtton} >
                                        {data?.status ? statusOptions?.find((item) => item.value == data?.status)?.title : ""}</p>)} */}
              </div>
            </div>
            <div className={styles.blockDescription}>
              <h6 className={styles.description}>Description</h6>
              {editField == "description" && editFieldOrNot ? (
                <TextField
                  className={styles.descriptionPara}
                  multiline
                  minRows={4}
                  maxRows={4}
                  value={description}
                  onChange={(e) => {
                    const newValue = e.target.value.replace(/^\s+/, "");

                    setDescription(newValue)
                  }}
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#45A845 !important",
                      borderRadius: "8px !important",
                    },
                  }}
                  placeholder="Enter description here"
                />
              ) : (
                <div>
                  {status !== "DONE" &&
                    loggedInUserId == data?.created_by?._id ? (
                    <p
                      className={styles.descriptionText}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setEditFieldOrNot(true);
                        setEditField("description");
                      }}
                    >
                      {" "}
                      {data?.description ? (
                        <Markup
                          content={getDescriptionData(data?.description)}
                        />
                      ) : (
                        "-"
                      )}
                    </p>
                  ) : (
                    <p className={styles.descriptionText}>
                      {" "}
                      {data?.description ? (
                        <Markup
                          content={getDescriptionData(data?.description)}
                        />
                      ) : (
                        "-"
                      )}
                    </p>
                  )}
                </div>
              )}
              {editField == "description" && editFieldOrNot ? (
                <div className={styles.editModeBtnGrp}>
                  <IconButton
                    sx={{ padding: "0" }}
                    onClick={() => {
                      setEditField("");
                      setEditFieldOrNot(false);
                      setDescription("")
                    }}
                  >
                    <img
                      src="/viewTaskIcons/cancel-icon.svg"
                      alt=""
                      width={"20px"}
                    />
                  </IconButton>

                  <IconButton
                    sx={{ padding: "0" }}
                    onClick={() => {
                      onUpdateField({});
                    }}
                    disabled={description ? false : true}
                  >
                    <img
                      src="/viewTaskIcons/confirm-icon.svg"
                      alt=""
                      width={"20px"}
                    />
                  </IconButton>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className={styles.fileUploadBlock}>
              {loggedInUserId == data?.created_by?._id || hasEditAccess ? (
                <>
                  <h6 className={styles.fileUploadHeading}>
                    Upload Attachment
                  </h6>
                  <div>
                    <TasksAttachments
                      taskId={""}
                      disabled={status === "DONE"}
                      setUploadedFiles={setUploadedFiles}
                      multipleFiles={multipleFiles}
                      setMultipleFiles={setMultipleFiles}
                      afterUploadAttachements={afterUploadAttachements}
                    />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
            {attachmentData?.length ? (
              <div className={styles.taskAttachmentsBlock}>
                <div className={styles.attachmentsHeader}>
                  <p className={styles.attachmentHeading}>Attachments</p>
                  <div className={styles.attachmentBtnGrp}>
                    {/* <Button className={styles.addAttachmentBtn} onClick={() =>
                                        setUploadAttachmentsOpen(!uploadAttachmentsOpen)
                                    }><img src="/viewTaskIcons/plus-icon.svg" alt="" width="15px" height="15px" /> Add</Button> */}
                    {selectedAttachmentIds?.length ? (
                      <Button
                        className={styles.deleteAttachmentBtn}
                        disabled={deleteLoading}
                        onClick={deleteSelectedImages}
                      >
                        {deleteLoading ? (
                          <CircularProgress
                            size="1.1rem"
                            sx={{ color: "white" }}
                          />
                        ) : (
                          <img
                            src="/viewTaskIcons/delete-icon.svg"
                            alt=""
                            width="15px"
                            height={"16px"}
                          />
                        )}
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className={styles.allAttachmentsBlock}>
                  {attachmentData?.length
                    ? attachmentData?.map(
                      (item: TaskAttachmentsType | any, index: number) => {
                        return (
                          <div
                            key={index}
                            className={styles.singleAttachmentBlock}
                          >
                            <div className={styles.tumblineBlock}>
                              <div className={styles.checkbox}>
                                {loggedInUserId == data?.created_by?._id ? (
                                  <Checkbox
                                    sx={{
                                      "& .MuiSvgIcon-root": {
                                        fontSize: 18,
                                      },
                                    }}
                                    disabled={
                                      status === "DONE" &&
                                      loggedInUserId == data?.created_by?._id
                                    }
                                    onChange={(e) =>
                                      selectImagesForDelete(e, item)
                                    }
                                    checked={selectedAttachmentIds.includes(
                                      item?._id
                                    )}
                                  />
                                ) : (
                                  ""
                                )}
                              </div>
                              <img
                                src={getImageSrcUrl(item)}
                                className={styles.thumbnailImg}
                                alt={""}
                                onClick={() => {
                                  window.open(item.url);
                                }}
                              />
                            </div>

                            <div
                              className={styles.imgTitle}
                              style={{
                                cursor: "pointer",
                                width: "25%",
                              }}
                              onClick={() => {
                                window.open(item.url);
                              }}
                            >
                              {" "}
                              {item?.metadata?.original_name?.length > 15
                                ? item?.metadata?.original_name.slice(0, 13) +
                                "..." +
                                item?.metadata?.original_name?.split(".")[
                                item?.metadata?.original_name?.split(".")
                                  ?.length - 1
                                ]
                                : item?.metadata?.original_name}
                            </div>

                            <div className={styles.uploadedDate}>
                              {timePipe(
                                item?.createdAt,
                                "DD MMM YYYY hh:mm A"
                              )}
                            </div>
                            <div
                              style={{ width: "5%" }}
                              onClick={() => {
                                downLoadAttachements(
                                  item.url,
                                  item?.metadata?.original_name,
                                  item?._id
                                );
                              }}
                            >
                              <picture>
                                {downloadImageId == item?._id ? (
                                  <CircularProgress
                                    size="1rem"
                                    sx={{ color: "green" }}
                                  />
                                ) : (
                                  <img
                                    style={{
                                      cursor: "pointer",
                                    }}
                                    src="/viewTaskIcons/download.svg"
                                    alt=""
                                  />
                                )}
                              </picture>
                            </div>
                          </div>
                        );
                      }
                    )
                    : "No Attachements"}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className={styles.assignedDetailsBlock}>
            <div>
              <div className={styles.DatePickerBlock}>
                <p className={styles.dueDate}>Due Date</p>
                <div className={styles.datePicker} style={{ display: "flex" }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileDatePicker
                      open={calenderOpen}
                      onOpen={handleCalenderOpen}
                      onClose={handleCalenderClose}
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
                      value={new Date(deadlineString)}
                      disabled={
                        status === "DONE" ||
                        !(loggedInUserId == data?.created_by?._id)
                      }
                      onAccept={(newValue: any) => {
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

                        onUpdateDeadlineField({ deadlineProp: dateWithPresentTime });
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
                  <img
                    onClick={handleCalenderOpen}
                    src="/viewTaskIcons/calender-icon.svg"
                    alt=""
                    style={{
                      background: "#E9EDF1",
                      paddingInline: "1rem",
                      borderRadius: "0 6px 6px 0",
                    }}
                  />
                </div>
              </div>
              <div className={styles.assignedByBlock}>
                <div className={styles.assignedByHeading}>Assigned By</div>
                <div className={styles.assignedByName}>
                  <Avatar
                    sx={{
                      fontSize: "6px",
                      width: "18px",
                      height: "18px",
                      background: "#45A845",
                    }}
                  >
                    {data?.created_by?.name?.split(" ")?.length > 1
                      ? `${data?.created_by?.name?.split(" ")[0][0]}${data?.created_by?.name?.split(" ")[1][0]
                        }`.toUpperCase()
                      : data?.created_by?.name.slice(0, 2)?.toUpperCase()}
                  </Avatar>
                  <p className={styles.assignedByFullName}>
                    {data?.created_by?.name ? data?.created_by?.name : "-"}
                  </p>
                </div>
              </div>
              <div className={styles.taskAssignedTeamBlock}>
                <div className={styles.assigneeTeamHeader}>
                  <div className={styles.assigneeHeading}>Assign To</div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                    }}
                  >
                    {loggedInUserId == data?.created_by?._id ||
                      hasEditAccess ? (
                      <Button
                        className={styles.addAssignyBtn}
                        disabled={
                          status === "DONE" &&
                          !(loggedInUserId == data?.created_by?._id)
                        }
                        onClick={handleAssignyClick}
                      >
                        {" "}
                        <img
                          src="/viewTaskIcons/plus-icon.svg"
                          alt=""
                          width="15px"
                          height="15px"
                        />{" "}
                        Add
                      </Button>
                    ) : (
                      ""
                    )}
                    {status !== "DONE" &&
                      loggedInUserId == data?.created_by?._id ? (
                      <div>
                        {selectedAssigneeIds?.length ? (
                          <Button
                            className={styles.deleteAttachmentBtn}
                            onClick={() => {
                              deleteAssignee();
                            }}
                          >
                            {deleteLoading ? (
                              <CircularProgress
                                size="1.1rem"
                                sx={{ color: "white" }}
                              />
                            ) : (
                              <img
                                src="/viewTaskIcons/delete-icon.svg"
                                alt=""
                                width="15px"
                                height={"16px"}
                              />
                            )}
                          </Button>
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                {data?.assign_to?.length ? (
                  <div className={styles.allAssignysBlock}>
                    {data?.assign_to
                      ? data?.assign_to.map(
                        (
                          item: { _id: string; name: string },
                          index: number
                        ) => {
                          return (
                            <div
                              key={index}
                              className={styles.singleAssignyBlock}
                            >
                              <div className={styles.checkbox}>
                                {loggedInUserId == data?.created_by?._id ? (
                                  <Checkbox
                                    sx={{
                                      "& .MuiSvgIcon-root": {
                                        fontSize: 18,
                                      },
                                    }}
                                    disabled={
                                      status === "DONE" &&
                                      loggedInUserId == data?.created_by?._id
                                    }
                                    onChange={(e) =>
                                      handleAssigneeCheckboxChange(
                                        e,
                                        item._id
                                      )
                                    }
                                    checked={selectedAssigneeIds.includes(
                                      item?._id
                                    )}
                                  />
                                ) : (
                                  ""
                                )}
                              </div>
                              <div className={styles.assingyNameBlock}>
                                <Avatar
                                  sx={{
                                    fontSize: "6px",
                                    width: "18px",
                                    height: "18px",
                                    background: "#6A7185",
                                  }}
                                >
                                  {item.name.split(" ")?.length > 1
                                    ? `${item.name.split(" ")[0][0]}${item.name.split(" ")[1][0]
                                      }`.toUpperCase()
                                    : item.name.slice(0, 2)?.toUpperCase()}
                                </Avatar>
                                <p className={styles.assignedByFullName}>
                                  {item.name}
                                </p>
                              </div>
                            </div>
                          );
                        }
                      )
                      : "-"}
                  </div>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "12px",
                      }}
                    >
                      Not at assigned
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.viewLogsBlock}>
              <Button
                className={styles.viewLogsBtn}
                onClick={() => setOpenLogs((prev) => !prev)}
              >
                View Logs
                <img src="/viewTaskIcons/logs-icon.svg" alt="" width={"15px"} />
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <ViewLogs
        openLogs={openLogs}
        setOpenLogs={setOpenLogs}
        taskId={router.query.task_id as string}
      />
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        className={styles.statusMenu}
        PaperProps={{
          style: {
            width: "15ch",
            borderRadius: "20px !important",
          },
        }}
      >
        {statusOptions?.length &&
          statusOptions.map(
            (item: { value: string; title: string }, index: number) => {
              if (item.value !== "OVER-DUE")
                return (
                  <MenuItem
                    disabled={status == item.value}
                    className={
                      status == item.value
                        ? styles.statusMenuItemSelected
                        : styles.statusMenuItem
                    }
                    onClick={() => {
                      handleClose();
                      onChangeStatus(item.value);
                    }}
                    key={index}
                    value={item.value}
                  >
                    {item.title}
                  </MenuItem>
                );
            }
          )}
      </Menu>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorAssignyEl}
        open={assignyOpen}
        // onClose={handleAssignyClose}
        TransitionComponent={Fade}
        PaperProps={{
          style: {
            width: "30ch",
          },
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={handleAssignyClose}>
            <CloseIcon sx={{ color: "#000", fontSize: "1.2rem" }} />
          </IconButton>
        </div>
        <div style={{ padding: "1rem", paddingTop: "0" }}>
          <UserOptionsinViewTasks
            userId={userId}
            assignee={assignee}
            // closeAssigne={closeAssigne}
            onChange={(assigned_to: any) => {
              setSelectedAssignee(assigned_to);
              setFarmId("");
              setUserId(assigned_to[0]?._id);
              setErrorMessages({});
            }}
          />

          <div className={styles.AssignyBtnGrp}>
            <Button
              onClick={() => {
                addAssignee();
                handleAssignyClose();
              }}
              disabled={selectedAssignee?.length ? false : true}
              variant="outlined"
              className={
                !selectedAssignee?.length
                  ? styles.confirmAssignyBtnDisabled
                  : styles.confirmAssignyBtn
              }
            >
              Confirm
            </Button>
          </div>
        </div>
      </Menu>
      <LoadingComponent loading={loading} />
      <Toaster closeButton richColors position="top-right" />
    </div>
  );
}

export default TaskViewComponent;