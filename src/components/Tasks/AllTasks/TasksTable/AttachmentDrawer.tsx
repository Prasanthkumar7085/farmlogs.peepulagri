
import { removeTheAttachementsFilesFromStore } from "@/Redux/Modules/Conversations";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress, IconButton, Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import styles from "../../TaskComments/Comments.module.css";
import Image from "next/image";
import timePipe from "@/pipes/timePipe";
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
          paddingBlock: "1rem",
        }}
      >
        {attachmentData?.map((item: any, index: any) => {
          return (
            <div key={index}>
              <p>{timePipe(item[0]?.time, "DD MMM YYYY, hh:mm A")}</p>
              <div className={styles.attachmentDrawer}>
                {item?.map((image: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className={styles.taskModuleAttachmentBlock}
                    >
                      <img src={image?.url} alt="" height={100} width={100} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {/* </div> */}
      </div>

      {/* <LoadingComponent loading={loading} /> */}
      <Toaster position="top-right" closeButton richColors />
    </Drawer>
  );
};
export default AttachmentDrawerTaskmodule;
