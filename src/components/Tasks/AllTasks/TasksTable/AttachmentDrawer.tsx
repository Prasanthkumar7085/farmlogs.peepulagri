
import { removeTheAttachementsFilesFromStore } from "@/Redux/Modules/Conversations";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress, IconButton, Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import styles from "../../TaskComments/Comments.module.css";
import Image from "next/image";
const AttachmentDrawerTaskmodule = ({ attachmentDrawerClose, rowDetails, attachmentdrawer }: any) => {
    const dispatch = useDispatch();
    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );

    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const [loading, setLoading] = useState<any>();
    const [attachmentData, setAttachmentData] = useState<any>();

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

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

            if (responseData.status == 200) {
                setAttachmentData(responseData?.data?.attachments);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getAllAttachments();
    }, []);

    return (
        <Drawer
            anchor="right"
            open={attachmentdrawer}
            sx={{
                "& .MuiPaper-root": {
                    padding: "1rem",
                    minWidth: "600px"
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
                    padding: "1rem",

                }}
            >
                {/* <div><p>09 Aug 2023 <span>10:30AM</span></p> */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gridColumnGap: "1rem" }}>


                    {attachmentData?.map((item: any, index: number) => {
                        return (
                            <div key={index}>
                                <Image src={item?.url} alt="" width={100} height={100} />
                            </div>
                        )
                    })}

                </div>
                {/* </div> */}
            </div>


            {/* <LoadingComponent loading={loading} /> */}
            <Toaster position="top-right" closeButton richColors />
        </Drawer>
    );
};
export default AttachmentDrawerTaskmodule;
