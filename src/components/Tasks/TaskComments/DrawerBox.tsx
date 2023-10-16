import { removeTheAttachementsFilesFromStore } from "@/Redux/Modules/Conversations";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress, IconButton, Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommentFormForTasks from "./comment-formForTasks";
import ThreadsForTasks from "./threadsforTasks";
import { Toaster, toast } from "sonner";
import SkeletonLoadingForAttachments from "@/components/Core/LoadingComponents/SkeletonLoadingForAttachments";
import styles from "./Comments.module.css";
const DrawerBoxComponent = ({ drawerClose, rowDetails, drawerOpen }: any) => {
  const dispatch = useDispatch();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [afterReply, setAfterReply] = useState<any>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [loading, setLoading] = useState<any>();
  const [data, setData] = useState<any>();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    getAllScoutComments();
  }, []);

  const getAllScoutComments = async () => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${rowDetails?._id}/comments/all`,
        options
      );
      let responseData = await response.json();
      if (responseData.success == true) {
        const commentsById: any = {};

        responseData.data.forEach((comment: any) => {
          commentsById[comment._id] = {
            ...comment,
            replies: [], // Initialize an empty array for replies
          };
        });

        // Populate the replies for each comment
        responseData.data.forEach((comment: any) => {
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
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
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
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${rowDetails?._id}/comments/${commnet_id}`,
        options
      );
      let responseData = await response.json();
      if (responseData.success == true) {
        getAllScoutComments();
      }
    } catch (err) {
      console.log(err);
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
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${rowDetails?._id}/comments/${commnet_id}`,
        options
      );
      let responseData = await response.json();
      if (responseData.success == true) {
        getAllScoutComments();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
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
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${rowDetails?._id}/comments/${commentId}/attachments`,
        options
      );
      let responseData = await response.json();
      if (responseData.success == true) {
        toast.success(responseData?.message);
        getAllScoutComments();
      }
    } catch (err) {
      console.log(err);
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

  // //edit commnet function call (after update any commnet)
  const afterUpdateComment = (id: any, value: any) => {
    if (value) {
      updateComment(id, value);
    }
  };

  return (
    <Drawer anchor="right" open={drawerOpen} sx={{
      '& .MuiPaper-root': {
        padding: "1rem"
      }
    }}>
      <div className={styles.drawerHeader}>
        <Typography variant="h6">Comments</Typography>
        <IconButton
          onClick={() => {
            drawerClose();
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
          width: 600,
          padding: "1rem",
          maxHeight: "500px",
          overflow: "auto",
        }}
      >
        {loading ? <SkeletonLoadingForAttachments /> : ""}
        <ThreadsForTasks
          farmID={rowDetails.farm_id._id}
          taskId={rowDetails._id}
          details={data}
          afterCommentAdd={afterCommentAdd}
          afterDeleteComment={afterDeleteComment}
          afterUpdateComment={afterUpdateComment}
          afterReply={afterReply}
          afterDeleteAttachements={afterDeleteAttachements}
        />
      </div>

      <CommentFormForTasks
        farmID={rowDetails.farm_id._id}
        taskId={rowDetails._id}
        afterCommentAdd={afterCommentAdd}
      />

      {/* <LoadingComponent loading={loading} /> */}
      <Toaster position="top-right" closeButton richColors />
    </Drawer>
  );
};
export default DrawerBoxComponent
