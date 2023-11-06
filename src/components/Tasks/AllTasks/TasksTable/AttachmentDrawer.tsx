
import { removeTheAttachementsFilesFromStore } from "@/Redux/Modules/Conversations";
import timePipe from "@/pipes/timePipe";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress, IconButton, Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../TaskComments/Comments.module.css";
const AttachmentDrawerTaskmodule = ({
    attachmentDrawerClose,
    rowDetails,
    attachmentdrawer,
}: any) => {
    const dispatch = useDispatch();
    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );

    const [loading, setLoading] = useState<any>();
    const [attachmentData, setAttachmentData] = useState<any>();
    // const mockData = [
    //     {
    //         name: "2023-11-06_054518_background-img.png",
    //         original_name: "background-img.png",
    //         type: "image/png",
    //         size: 4032851,
    //         path: "65237516de9193d24c05b8f1/2023-11-06_054518_background-img.png",
    //         time: "2023-11-04T05:45:58.988Z",
    //         _id: "65487d9664c9aec9abc27c9b",
    //         url: "https://peepul-agri-dev.s3.ap-south-1.amazonaws.com/6520e0de9a170d60fa925b6d/tasks/65237516de9193d24c05b8f1/2023-11-06_054518_background-img.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIATCP4XX4BIG3O2JMK%2F20231106%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20231106T062249Z&X-Amz-Expires=3600&X-Amz-Signature=fb3a9debccc2524d444eb1bec6a5140cc8158a524fd515a79811fd1a386044c9&X-Amz-SignedHeaders=host",
    //     },
    //     {
    //         name: "2023-11-06_054555_mr-yoda-1.png",
    //         original_name: "Mr-Yoda 1.png",
    //         type: "image/png",
    //         size: 32449,
    //         path: "65237516de9193d24c05b8f1/2023-11-06_054555_mr-yoda-1.png",
    //         time: "2023-11-04T05:45:58.988Z",
    //         _id: "65487d9664c9aec9abc27c9c",
    //         url: "https://peepul-agri-dev.s3.ap-south-1.amazonaws.com/6520e0de9a170d60fa925b6d/tasks/65237516de9193d24c05b8f1/2023-11-06_054555_mr-yoda-1.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIATCP4XX4BIG3O2JMK%2F20231106%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20231106T062249Z&X-Amz-Expires=3600&X-Amz-Signature=6e87d7a1977ab1f66afb0dda13117429675f047b55ffcd364c8d91ea8099288a&X-Amz-SignedHeaders=host",
    //     },
    //     {
    //         name: "2023-11-06_054536_mr-yoda-white.png",
    //         original_name: "MR-yoda-white.png",
    //         type: "image/png",
    //         size: 5092,
    //         path: "65237516de9193d24c05b8f1/2023-11-06_054536_mr-yoda-white.png",
    //         time: "2023-11-03T05:45:58.988Z",
    //         _id: "65487d9664c9aec9abc27c9d",
    //         url: "https://peepul-agri-dev.s3.ap-south-1.amazonaws.com/6520e0de9a170d60fa925b6d/tasks/65237516de9193d24c05b8f1/2023-11-06_054536_mr-yoda-white.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIATCP4XX4BIG3O2JMK%2F20231106%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20231106T062249Z&X-Amz-Expires=3600&X-Amz-Signature=91653e6f2e35b715db6c8e3f247fd3ead49ff93b2b096cb4fb2480d681cb6942&X-Amz-SignedHeaders=host",
    //     },
    // ];


    function groupByDate(array: Array<any>) {
        const groupedByDate = array.reduce((result, obj) => {
            const dateKey = obj.time.split("T")[0]; // Extract the date from the timestamp
            if (!result[dateKey]) {
                result[dateKey] = [];
            }
            result[dateKey].push(obj);
            return result;
        }, {});

        return Object.values(groupedByDate);
    }

    const getAllAttachments = async () => {
        setLoading(true);
        let options = {
            method: "GET",
            headers: new Headers({
                "content-type": "application/json",
                authorization: accessToken,
            }),
        };
        try {
            let response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/tasks/${rowDetails?._id}`,
                options
            );
            let responseData = await response.json();
            if (responseData.status >= 200 && responseData.status <= 300) {
                let modifiedData = groupByDate(responseData?.data?.attachments);
                // let modifiedData = groupByDate([
                //     ...responseData?.data?.attachments,
                //     ...mockData,
                // ]);
                setAttachmentData(modifiedData);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (attachmentdrawer) {
            getAllAttachments();
        } else {
            setAttachmentData([]);
        }
    }, [attachmentdrawer]);

    return (
        <Drawer
            anchor="right"
            open={attachmentdrawer}
            sx={{
                "& .MuiPaper-root": {
                    padding: "1rem",
                    minWidth: "600px",
                    maxWidth: "600px",
                },
            }}
        >
            <div className={styles.drawerHeader}>
                <Typography variant="h6">Attachments</Typography>
                <IconButton
                    onClick={() => {
                        attachmentDrawerClose();
                        dispatch(removeTheAttachementsFilesFromStore([]));
                    }}
                >
                    <CloseIcon sx={{ color: "#000" }} />
                </IconButton>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    paddingBlock: "1rem"
                }}
            >
                {(!loading && attachmentData?.length) ? attachmentData?.map((item: any, index: any) => {
                    return (
                        <div style={{ marginBottom: "1rem" }}>
                            <p className={styles.AttachmentDate}>{timePipe(item[0]?.time, "DD MMM YYYY, hh:mm A")}</p>
                            <div className={styles.attachmentDrawer}>
                                {item?.map((image: any, index: number) => {
                                    return (
                                        <div key={index} className={styles.taskModuleAttachmentBlock}>
                                            <img src={image?.url} alt="" height={100}
                                                width={100} className={styles.attachmentImg} />
                                            <div className={styles.viewIcon}>
                                                <img src="/view-icon-task.svg"
                                                    height={30}
                                                    width={30}
                                                    alt="view" />
                                            </div>
                                        </div>
                                    )
                                })}

                            </div>
                        </div>
                    )
                }) : (loading ? <CircularProgress /> : "No Attachments")}
            </div>
        </Drawer >
    );
};
export default AttachmentDrawerTaskmodule;
