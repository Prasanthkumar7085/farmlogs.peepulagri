import { removeTheAttachementsFilesFromStore } from "@/Redux/Modules/Conversations";
import AlertComponent from "@/components/Core/AlertComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import CloseIcon from "@mui/icons-material/Close";
import { Drawer, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./CommentsComponent.module.css";
import CommentForm from "./comment-form";
import Threads from "./threads";

const DrawerComponentForScout = ({
  drawerClose,
  openCommentsBox,
  attachement,
  scoutDetails,
}: any) => {
  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<any>();
  const [afterReply, setAfterReply] = useState<any>();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(true);

  useEffect(() => {
    if (attachement) {
      getAllScoutComments();
      setLoadingThreads(true);
    }
  }, [attachement]);

  const getAllScoutComments = async () => {
    setLoadingThreads(true);
    let options = {
      method: "GET",
      headers: new Headers({
        "content-type": "application/json",
        authorization: accessToken,
      }),
    };
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/scouts/${scoutDetails?._id}/attachments/${attachement?._id}/comments/all`,
        options
      );
      let responseData = await response.json();
      if (responseData.success == true) {
        const commentsById: any = {};

        responseData.data[0]?.comments.forEach((comment: any) => {
          commentsById[comment._id] = {
            ...comment,
            replies: [], // Initialize an empty array for replies
          };
        });

        // Populate the replies for each comment
        responseData.data[0]?.comments.forEach((comment: any) => {
          if (comment.type === "REPLY" && comment.reply_to_comment_id) {
            const parentId = comment.reply_to_comment_id;
            if (commentsById[parentId]) {
              commentsById[parentId].replies.push(comment);
            }
          }
        });

        // Sort the replies array within each comment by createdAt
        for (const commentId in commentsById) {
          if (commentsById.hasOwnProperty(commentId)) {
            commentsById[commentId].replies.sort((a: any, b: any) => {
              // Assuming updated_date is in ISO8601 format, you can compare them as strings
              return a.createdAt.localeCompare(b.createdAt);
            });
          }
        }
        // Convert the commentsById object to an array of comments
        const formattedData = Object.values(commentsById);
        let reverse = formattedData.slice().reverse();

        setData(reverse);
        dispatch(removeTheAttachementsFilesFromStore([]));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingThreads(false);
    }
  };

  //delete comment api
  const deleteComment = async (commnet_id: any) => {
    setLoading(true);
    let options = {
      method: "DELETE",
      headers: new Headers({
        "content-type": "application/json",
        authorization: accessToken,
      }),
    };
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/scouts/${scoutDetails?._id}/attachments/${attachement?._id}/comments/${commnet_id}`,
        options
      );
      let responseData = await response.json();
      if (responseData.success == true) {
        getAllScoutComments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //update any commnet api event
  const updateComment = async (commnet_id: any, updatedContent: any) => {
    setLoading(true);
    let options = {
      method: "PATCH",
      headers: new Headers({
        "content-type": "application/json",
        authorization: accessToken,
      }),
      body: JSON.stringify({
        content: updatedContent,
      }),
    };
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/scouts/${scoutDetails?._id}/attachments/${attachement?._id}/comments/${commnet_id}`,
        options
      );
      let responseData = await response.json();
      if (responseData.success == true) {
        getAllScoutComments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //adding comment then call the get all api
  const afterCommentAdd = (value: any) => {
    if (value == true) {
      getAllScoutComments();
      setAfterReply(true);
    }
  };

  //delete comment
  const afterDeleteComment = (value: any) => {
    if (value) {
      deleteComment(value);
    }
  };

  //edit commnet function call (after update any commnet)
  const afterUpdateComment = (id: any, value: any) => {
    if (value) {
      updateComment(id, value);
    }
  };

  const afterDeleteAttachements = async (attachmentID: any, commentId: any) => {
    setLoading(true);
    let obj = {
      attachment_ids: [attachmentID],
    };
    let options = {
      method: "DELETE",
      body: JSON.stringify(obj),
      headers: new Headers({
        "content-type": "application/json",
        authorization: accessToken,
      }),
    };
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/scouts/${scoutDetails?._id}/attachments/${attachement?._id}/comments/${commentId}/attachments`,
        options
      );
      let responseData = await response.json();
      if (responseData.success == true) {
        setAlertMessage("Attachement deleted successfully");
        setAlertType(true);
        getAllScoutComments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      anchor={"bottom"}
      open={openCommentsBox}
      sx={{ zIndex: "1300 !important" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.5rem",
          borderBottom: "1px solid #dddddd",
        }}
      >
        <Typography className={styles.CommentsTitle}>{"Comments"}</Typography>
        <IconButton
          onClick={() => {
            drawerClose(false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>

      <div className={styles.CommentsBlock}>
        <div className={styles.CommentsContainer}>
          <Threads
            details={data}
            afterCommentAdd={afterCommentAdd}
            afterDeleteComment={afterDeleteComment}
            afterUpdateComment={afterUpdateComment}
            afterReply={afterReply}
            afterDeleteAttachements={afterDeleteAttachements}
            loadingThreads={loadingThreads}
            attachement={attachement}
            scoutDetails={scoutDetails}
          />
        </div>
        <CommentForm
          afterCommentAdd={afterCommentAdd}
          scoutDetails={scoutDetails}
          attachement={attachement}
        />

        <LoadingComponent loading={loading} />
        <AlertComponent
          alertMessage={alertMessage}
          alertType={alertType}
          setAlertMessage={setAlertMessage}
        />
      </div>
    </Drawer>
  );
};
export default DrawerComponentForScout;
