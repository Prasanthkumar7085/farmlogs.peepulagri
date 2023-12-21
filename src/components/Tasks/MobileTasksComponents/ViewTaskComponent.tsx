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



    const [data, setData] = useState<TaskResponseTypes | null | any>({});
    const [title, setTitle] = useState("");
    const [deadlineString, setDeadlineString] = useState<Date | string | any>("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [hasEditAccess, setHasEditAccess] = useState<boolean | undefined>(false);
    const [assignedBy, setAssigneeBy] = useState('');
    const [usersDrawerOpen, setUsersDrawerOpen] = useState<any>(false);
    const [assignee, setAssignee] = useState<any>();
    const [selectedAssignee, setSelectedAssignee] = useState<any | null>(null);

    const [farmId, setFarmId] = useState("");
    const [userId, setUserId] = useState("");

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

    return (
        <div>
            <ViewtaskHeader />
            <DescriptionContainer description={description} />
            <AttachmentsContainer attachmentData={attachmentData} getAllAttachments={getAllAttachments} />
            <AssignedByContainer assignedBy={assignedBy} />
            <AssignedToContainer setUsersDrawerOpen={setUsersDrawerOpen} assignee={assignee} />
            <ActivityContainer />

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