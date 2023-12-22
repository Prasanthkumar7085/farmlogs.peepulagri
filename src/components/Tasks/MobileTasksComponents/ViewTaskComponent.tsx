import { useSelector } from "react-redux";
import getTaskByIdService from "../../../../lib/services/TasksService/getTaskByIdService";
import ActivityContainer from "./activity-container";
import AssignedByContainer from "./assigned-by-container";
import AttachmentsContainer from "./attachments-container";
import DescriptionContainer from "./description-container";
import ViewtaskHeader from "./viewtask-header";
import { useEffect, useState } from "react";
import { TaskResponseTypes } from "@/types/tasksTypes";
import { useRouter } from "next/router";
import { Button, Drawer, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddAssigneeMembers from "./AddAssigneeMembers";
import { Toaster, toast } from "sonner";
import AssignedToContainer from "./assigned-to-container";
import MainContent from "./main-content";
import updateTaskStatusService from "../../../../lib/services/TasksService/updateTaskStatusService";
import updateTaskService from "../../../../lib/services/TasksService/updateTaskService";
import moment from "moment";


const ViewTaskComponent = () => {
    const router = useRouter();
    const id = router.query.task_id;



    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );
    const loggedInUserId = useSelector(
        (state: any) => state.auth.userDetails?.user_details?._id
    );

    const [attachmentData, setAttachmentData] = useState<any>();

    const [editField, setEditField] = useState("");
    const [editFieldOrNot, setEditFieldOrNot] = useState(false);


    const [data, setData] = useState<TaskResponseTypes | null | any>({});
    const [title, setTitle] = useState("");
    const [deadlineString, setDeadlineString] = useState<Date | string | any>("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [errorMessages, setErrorMessages] = useState({});
    const [hasEditAccess, setHasEditAccess] = useState<boolean | undefined>(false);
    const [status, setStatus] = useState("");
    const [assignedBy, setAssigneeBy] = useState('');
    const [usersDrawerOpen, setUsersDrawerOpen] = useState<any>(false);
    const [assignee, setAssignee] = useState<any>();
    const [selectedAssignee, setSelectedAssignee] = useState<any | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const [farmId, setFarmId] = useState("");
    const [userId, setUserId] = useState("");

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const getTaskById = async (id: string) => {
        setLoading(true);
        const response = await getTaskByIdService({
            taskId: id,
            token: accessToken,
        });

        if (response?.success) {
            setData(response?.data);
            setTitle(response?.data?.title ? response?.data?.title : "");
            setDeadlineString(response?.data?.deadline ? response?.data?.deadline : "")
            setDescription(response?.data?.description ? response?.data?.description : "");
            setAssigneeBy(response.data?.created_by.name ? response.data?.created_by.name : "");
            setStatus(response?.data?.status ? response?.data?.status : "");
            setAssignee(response?.data?.assign_to);
            setFarmId(response?.data?.farm_id ? response?.data?.farm_id?._id : "");



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
                    setUsersDrawerOpen(false);
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
    const [calenderOpen, setCalenderOpen] = useState(false);
    const handleCalenderOpen = () => setCalenderOpen(true);
    const handleCalenderClose = () => setCalenderOpen(false);

    return (
        <div>
            <ViewtaskHeader />
            <div style={{ padding: "1rem" }}>
                <MainContent
                    title={title}
                    onChangeStatus={onChangeStatus}
                    open={open}
                    anchorEl={anchorEl}
                    handleClose={handleClose}
                    status={status}
                    hasEditAccess={hasEditAccess}
                    data={data}
                    handleClick={handleClick}
                    editField={editField}
                    editFieldOrNot={editFieldOrNot}
                    setTitle={setTitle}
                    errorMessages={errorMessages}
                    setEditField={setEditField}
                    setEditFieldOrNot={setEditFieldOrNot}
                    onUpdateField={onUpdateField}
                    calenderOpen={calenderOpen}
                    handleCalenderOpen={handleCalenderOpen}
                    handleCalenderClose={handleCalenderClose}
                    deadlineString={deadlineString}
                    setDeadlineString={setDeadlineString}
                />
                <DescriptionContainer
                    description={description}
                    data={data}
                    editField={editField}
                    editFieldOrNot={editFieldOrNot}
                    setEditField={setEditField}
                    setEditFieldOrNot={setEditFieldOrNot}
                    onUpdateField={onUpdateField}
                    setDescription={setDescription}
                    status={status}
                />
                <AttachmentsContainer
                    data={data}
                    attachmentData={attachmentData}
                    getAllAttachments={getAllAttachments}
                    status={status}
                    hasEditAccess={hasEditAccess}
                />
                <AssignedByContainer assignedBy={assignedBy} />
                <AssignedToContainer
                    data={data}
                    setUsersDrawerOpen={setUsersDrawerOpen}
                    assignee={assignee}
                    hasEditAccess={hasEditAccess}
                    status={status}
                />
                <ActivityContainer />
            </div>

            <Drawer
                anchor={"bottom"}
                open={usersDrawerOpen}
                sx={{
                    zIndex: "1300 !important",
                    "& .MuiPaper-root": {
                        height: "400px",
                        overflowY: "auto",
                        padding: "0 1rem 1rem",
                        borderRadius: "20px 20px 0 0",
                        background: "#F5F7FA",
                        maxWidth: "calc(500px - 30px)",
                        margin: "0 auto",
                    },
                }}
            >
                <div>
                    <Typography>Select Members</Typography>
                    <IconButton
                        sx={{ marginLeft: '95%' }}
                        onClick={() => {
                            setUsersDrawerOpen(false);
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </div>
                <div style={{ padding: "1rem", paddingTop: "0" }}>
                    <AddAssigneeMembers
                        userId={userId}
                        assignee={assignee}
                        onChange={(assigned_to: any) => {
                            setSelectedAssignee(assigned_to);
                            setFarmId("");
                            setUserId(assigned_to[0]?._id);

                        }}
                    />
                    <div >
                        <Button
                            onClick={() => {
                                addAssignee();
                            }}
                            disabled={!selectedAssignee?.length}
                            variant="outlined"
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </Drawer>
        </div>
    );
}
export default ViewTaskComponent;