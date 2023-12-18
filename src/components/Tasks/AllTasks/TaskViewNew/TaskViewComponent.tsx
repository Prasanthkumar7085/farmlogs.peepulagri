import { Avatar, Box, Button, Card, Checkbox, CircularProgress, ClickAwayListener, Collapse, Fade, Grid, IconButton, Menu, MenuItem, TextField } from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import styles from "./TaskViewComponent.module.css"
import { ChangeEvent, useEffect, useState } from "react";
import { TaskAttachmentsType, TaskResponseTypes } from "@/types/tasksTypes";
import getTaskByIdService from "../../../../../lib/services/TasksService/getTaskByIdService";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Markup } from "interweave";
import timePipe from "@/pipes/timePipe";
import { toast } from "sonner";
import deleteTaskAttachmentService from "../../../../../lib/services/TasksService/deleteTaskAttachmentService";
import TasksAttachments from "../../AddTask/TasksAttachments";
import updateTaskStatusService from "../../../../../lib/services/TasksService/updateTaskStatusService";
import LoadingComponent from "@/components/Core/LoadingComponent";
import moment from "moment";
import updateTaskService from "../../../../../lib/services/TasksService/updateTaskService";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import UserOptionsinViewTasks from "../../ViewTask/UserOptionsinViewTasks";

const TaskViewComponent = () => {
    const router = useRouter();
    const [attachmentData, setAttachmentData] = useState<any>();
    const [uploadAttachmentsOpen, setUploadAttachmentsOpen] = useState(false);
    const [selectedAttachmentIds, setSelectedAttachmentsIds] = useState<
        Array<string>
    >([]);
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
    const [hasEditAccess, setHasEditAccess] = useState<boolean | undefined>(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [multipleFiles, setMultipleFiles] = useState<any>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [anchorAssignyEl, setAnchorAssignyEl] = useState<null | HTMLElement>(null);
    const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>(
        []
    );
    const [statusOptions] = useState<Array<{ value: string; title: string }>>([
        { value: "TO-START", title: "To-Start" },
        { value: "INPROGRESS", title: "In-Progress" },
        { value: "DONE", title: "Done" },
        { value: "PENDING", title: "Pending" },
        // { value: "OVER-DUE", title: "Over-due" },
    ]);
    const [farmId, setFarmId] = useState("");
    const [userId, setUserId] = useState("");
    const today = new Date();
    const id = router.query.task_id;

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
        setDeadlineString(data?.deadline ? data?.deadline : "")
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

            console.log(
                response?.data?.assign_to?.some(
                    (item: any) => item?._id == loggedInUserId
                )
            );

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
                console.log(responseData?.data?.attachments);

                setAttachmentData([...responseData?.data?.attachments]);
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
    const downLoadAttachements = async (file: any) => {
        setLoading(true);
        try {
            if (file) {
                fetch(file)
                    .then((response) => {
                        // Get the filename from the response headers
                        const contentDisposition = response.headers.get(
                            "content-disposition"
                        );
                        let filename = "downloaded_file"; // Default filename if not found in headers

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
            setLoading(false);
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
    console.log(selectedAttachmentIds);

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
    const onUpdateField = async ({ deadlineProp }: Partial<{ deadlineProp: string }>) => {
        setLoading(true);
        let body = {
            ...data,
            assigned_to: userId,
            farm_id: farmId,
            deadline: deadlineProp ? deadlineProp : (deadlineString
                ? moment(deadlineString)
                    .utcOffset("+05:30")
                    .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
                : ""),
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

        }
        else {
            if (response?.errors) {
                setErrorMessages(response?.errors);
            }
        }
        setLoading(false);
        // return response;
    };
    // const onUpdateField = async () => {
    //     let body = {
    //         ...data,
    //         assigned_to: userId,
    //         farm_id: farmId,
    //         deadline: deadline
    //             ? moment(deadline)
    //                 .utcOffset("+05:30")
    //                 .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
    //             : "",
    //         description: description ? description : "",
    //         title: title ? title : "",
    //         status: status,
    //     };

    //     const response = await updateTask(body);

    //     if (response?.success) {
    //         setEditFieldOrNot(false);
    //         setEditField("");
    //     } else {
    //         if (response?.errors) {
    //             setErrorMessages(response?.errors);
    //         }
    //     }
    // };
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
                    setDeleteFieldOrNot(false);
                    setDeleteField("");
                    setSelectedAssigneeIds([]);
                    getTaskById(id as string);
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

    return (
        <div className={styles.taskViewPage}>
            <div >
                <Button className={styles.backBtn}> <img src="/viewTaskIcons/back-icon.svg" alt="" width="18px" /> </Button>
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
                                        }}
                                        size="small"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                            ) : (
                                <h6 className={styles.farmTitle} onClick={() => { setEditField('title'); setEditFieldOrNot(true) }}>{data?.title
                                    ? data?.title.slice(0, 1).toUpperCase() +
                                    data?.title.slice(1)
                                    : "-"}</h6>
                            )}
                            {editField == "title" && editFieldOrNot ? (
                                <div className={styles.editModeBtnGrp}>
                                    <IconButton sx={{ padding: "0" }} onClick={() => {
                                        setEditField('');
                                        setEditFieldOrNot(false)
                                    }}>
                                        <img src="/ViewTaskIcons/cancel-icon.svg" alt="" width={"20px"} />
                                    </IconButton>

                                    <IconButton sx={{ padding: "0" }} onClick={() => {
                                        onUpdateField({});
                                        setEditField('');
                                        setEditFieldOrNot(false)
                                    }}>
                                        <img src="/viewTaskIcons/confirm-icon.svg" alt="" width={"20px"} />
                                    </IconButton>
                                </div>) : ("")}
                            <div >
                                <p className={styles.statusButtton} onClick={handleClick}>
                                    {data?.status ? statusOptions?.find((item) => item.value == data?.status)?.title : ""}
                                </p>
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
                                    onChange={(e) => setDescription(e.target.value)}
                                    sx={{ width: "100%", background: "#f5f7fa" }}
                                    placeholder="Enter description here"
                                />
                            ) : (
                                <p className={styles.descriptionText} onClick={() => {
                                    setEditFieldOrNot(true);
                                    setEditField("description");
                                }}>  {data?.description ? (
                                    <Markup content={getDescriptionData(data?.description)} />
                                ) : (
                                    "-"
                                )}</p>
                            )}
                            {editField == "description" && editFieldOrNot ? (
                                <div className={styles.editModeBtnGrp}>
                                    <IconButton sx={{ padding: "0" }} onClick={() => {
                                        setEditField('');
                                        setEditFieldOrNot(false)
                                    }}>
                                        <img src="/ViewTaskIcons/cancel-icon.svg" alt="" width={"20px"} />
                                    </IconButton>

                                    <IconButton sx={{ padding: "0" }} onClick={() => {
                                        onUpdateField({});
                                        setEditField('');
                                        setEditFieldOrNot(false)
                                    }}>
                                        <img src="/viewTaskIcons/confirm-icon.svg" alt="" width={"20px"} />
                                    </IconButton>
                                </div>) : ("")}
                        </div>
                        <div className={styles.fileUploadBlock}>
                            <h6 className={styles.fileUploadHeading}>Upload Attachment</h6>
                            <div>
                                <TasksAttachments
                                    taskId={""}
                                    setUploadedFiles={setUploadedFiles}
                                    multipleFiles={multipleFiles}
                                    setMultipleFiles={setMultipleFiles}
                                    afterUploadAttachements={afterUploadAttachements}
                                />
                            </div>
                        </div>
                        {attachmentData?.length ?
                            <div className={styles.taskAttachmentsBlock}>
                                <div className={styles.attachmentsHeader}>
                                    <p className={styles.attachmentHeading}>Attachments</p>
                                    <div className={styles.attachmentBtnGrp}>
                                        {/* <Button className={styles.addAttachmentBtn} onClick={() =>
                                        setUploadAttachmentsOpen(!uploadAttachmentsOpen)
                                    }><img src="/viewTaskIcons/plus-icon.svg" alt="" width="15px" height="15px" /> Add</Button> */}
                                        {selectedAttachmentIds?.length ? <Button
                                            className={styles.deleteAttachmentBtn} disabled={deleteLoading} onClick={deleteSelectedImages}>
                                            {deleteLoading ? (
                                                <CircularProgress size="1.5rem" sx={{ color: "red" }} />
                                            ) : (
                                                <img src="/viewTaskIcons/delete-icon.svg" alt="" width="15px" height={"16px"} />
                                            )}
                                        </Button> : ""}
                                    </div>
                                </div>
                                <div className={styles.allAttachmentsBlock}>
                                    {attachmentData?.length
                                        ? attachmentData?.map(
                                            (item: TaskAttachmentsType | any, index: number) => {
                                                return (
                                                    <div key={index} className={styles.singleAttachmentBlock}>
                                                        <div className={styles.tumblineBlock}>
                                                            <div className={styles.checkbox}>
                                                                <Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} onChange={(e) =>
                                                                    selectImagesForDelete(e, item)
                                                                }
                                                                    checked={selectedAttachmentIds.includes(
                                                                        item?._id
                                                                    )} />

                                                            </div>
                                                            <img src={item.url} alt="" className={styles.thumbnailImg} />
                                                        </div>

                                                        <div className={styles.imgTitle}> {item?.key?.length > 20
                                                            ? item?.key.slice(0, 20) + "..." + item?.key?.split('.')[item?.key?.split('.')?.length - 1]
                                                            : item?.key}</div>

                                                        <div className={styles.uploadedDate}>{timePipe(item?.createdAt, "DD MMM YYYY")}</div>
                                                        <div style={{ width: "15%" }} onClick={() => {
                                                            downLoadAttachements(item.url);
                                                        }}>
                                                            <img src="/viewTaskIcons/download.svg" alt="" />
                                                        </div>
                                                    </div>

                                                );
                                            }
                                        )
                                        : "No Attachements"}
                                </div>
                            </div> : ""}
                    </div>
                    <div className={styles.assignedDetailsBlock}>
                        <div className={styles.DatePickerBlock}>
                            <p className={styles.dueDate}>Due Date</p>
                            <div className={styles.datePicker}>
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
                                        value={new Date(deadlineString)}
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

                                            onUpdateField({ deadlineProp: dateWithPresentTime })
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
                        <div className={styles.assignedByBlock}>
                            <div className={styles.assignedByHeading}>Assigned By</div>
                            <div className={styles.assignedByName}>
                                <Avatar sx={{ fontSize: "6px", width: "18px", height: "18px", background: "#45A845" }} >
                                    {data?.created_by?.name?.split(' ')?.length > 1 ? `${data?.created_by?.name?.split(' ')[0][0]}${data?.created_by?.name?.split(' ')[1][0]}`.toUpperCase() : data?.created_by?.name.slice(0, 2)?.toUpperCase()}
                                </Avatar>
                                <p className={styles.assignedByFullName}>
                                    {data?.created_by?.name ? data?.created_by?.name : "-"}
                                </p>

                            </div>
                        </div>
                        <div className={styles.taskAssignedTeamBlock}>
                            <div className={styles.assigneeTeamHeader}>
                                <div className={styles.assigneeHeading}>
                                    Assign To
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                                    <Button className={styles.addAssignyBtn} onClick={handleAssignyClick}> <img src="/viewTaskIcons/plus-icon.svg" alt="" width="15px" height="15px" /> Add</Button>

                                    {selectedAssigneeIds?.length ? <Button
                                        className={styles.deleteAttachmentBtn} onClick={() => {
                                            deleteAssignee();
                                        }}>
                                        {deleteLoading ? (
                                            <CircularProgress size="1.5rem" sx={{ color: "red" }} />
                                        ) : (
                                            <img src="/viewTaskIcons/delete-icon.svg" alt="" width="15px" height={"16px"} />
                                        )}
                                    </Button> : ""}
                                </div>
                            </div>
                            {data?.assign_to?.length ?
                                <div className={styles.allAssignysBlock}>
                                    {data?.assign_to
                                        ? data?.assign_to.map(
                                            (item: { _id: string; name: string }, index: number) => {
                                                return (
                                                    <div key={index} className={styles.singleAssignyBlock}>
                                                        <div className={styles.checkbox}>
                                                            <Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} onChange={(e) =>
                                                                handleAssigneeCheckboxChange(e, item._id)
                                                            }
                                                                checked={selectedAssigneeIds.includes(
                                                                    item?._id
                                                                )}
                                                            />

                                                        </div>
                                                        <div className={styles.assingyNameBlock}>
                                                            <Avatar sx={{ fontSize: "6px", width: "18px", height: "18px", background: "#6A7185" }} >
                                                                {item.name.split(' ')?.length > 1 ? `${item.name.split(' ')[0][0]}${item.name.split(' ')[1][0]}`.toUpperCase() : item.name.slice(0, 2)?.toUpperCase()}

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
                                : ""}
                        </div>
                    </div>

                </Card>
            </div>
            <Menu
                id="fade-menu"
                MenuListProps={{
                    'aria-labelledby': 'fade-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
                PaperProps={{
                    style: {
                        width: '20ch',
                    },
                }}
            >

                {statusOptions?.length &&
                    statusOptions.map((item: { value: string; title: string }, index: number) => {
                        return (
                            <MenuItem className={styles.statusMenuItem} onClick={() => {
                                handleClose()
                                onChangeStatus(item.value)
                            }} key={index} value={item.value}>
                                {item.title}
                            </MenuItem>
                        );
                    })}
            </Menu>
            <Menu
                id="fade-menu"
                MenuListProps={{
                    'aria-labelledby': 'fade-button',
                }}
                anchorEl={anchorAssignyEl}
                open={assignyOpen}
                onClose={handleAssignyClose}
                TransitionComponent={Fade}
                PaperProps={{
                    style: {
                        width: '30ch',
                    },
                }}
            >
                <div style={{ padding: "1rem" }}>
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
                    <div className={styles.AssignyBtnGrp}>
                        <Button onClick={() => {
                            addAssignee();
                            handleAssignyClose();
                        }} variant="outlined" className={styles.confirmAssignyBtn} >Confirm</Button>
                    </div>
                </div>
            </Menu>
            <LoadingComponent loading={loading} />

        </div>

    );
}

export default TaskViewComponent;