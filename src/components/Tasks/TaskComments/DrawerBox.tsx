import { removeTheAttachementsFilesFromStore } from "@/Redux/Modules/Conversations";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import styles from "./Comments.module.css";
import CommentFormForTasks from "./comment-formForTasks";
import ThreadsForTasks from "./threadsforTasks";
import { useRouter } from "next/router";
const DrawerBoxComponent = ({ drawerClose, rowDetails, drawerOpen }: any) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [afterReply, setAfterReply] = useState<any>();
  const [loading, setLoading] = useState<any>();
  const [data, setData] = useState<any>();
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (rowDetails && drawerOpen) {
      getAllScoutComments();
    } else {
      setData([]);
    }
  }, [drawerOpen]);

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

        responseData.data?.forEach((comment: any) => {
          commentsById[comment._id] = {
            ...comment,
            replies: [], // Initialize an empty array for replies
          };
        });

        // Populate the replies for each comment
        responseData.data?.forEach((comment: any) => {
          if (comment.reply_to) {
            const parentId = comment.reply_to;
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
        toast.success(responseData?.message);
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
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${rowDetails?._id}/comments/${commnet_id}`,
        options
      );
      let responseData = await response.json();
      if (responseData.success == true) {
        getAllScoutComments();
        toast.success(responseData?.message);

      }
    } catch (err) {
      console.error(err);
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

  // //edit commnet function call (after update any commnet)
  const afterUpdateComment = (id: any, value: any) => {
    if (value) {
      updateComment(id, value);
    }
  };

  return (
    <Drawer
      anchor={router.pathname?.includes("/users-tasks") ? "bottom" : "right"}
      open={drawerOpen}
      sx={{
        "& .MuiPaper-root": {
          minWidth: router.pathname?.includes("/users-tasks")
            ? "100px"
            : "600px",
          maxWidth: router.pathname?.includes("/users-tasks")
            ? "500px"
            : "600px",
          margin: router.pathname?.includes("/users-tasks")
            ? "0 auto"
            : "inherit",
          padding: router.pathname?.includes("/users-tasks") ? "0" : "1rem",
          borderRadius: router.pathname?.includes("/users-tasks")
            ? "10px 10px 0px 0px"
            : "none",
        },
      }}
    >
      <div className={styles.drawerHeader} style={{ borderBottom: "1px solid lightgrey" }}>
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
        className={styles.threadsDrawerTasks}
        id={
          router.pathname?.includes("/users-tasks")
            ? styles.commentDrawerDivMobile
            : styles.commentDrawerDivWeb
        }
      >
        <ThreadsForTasks
          farmID={rowDetails?.farm_id?._id}
          taskId={rowDetails?._id}
          details={data}
          afterCommentAdd={afterCommentAdd}
          afterDeleteComment={afterDeleteComment}
          afterUpdateComment={afterUpdateComment}
          afterReply={afterReply}
          loading={loading}
          afterDeleteAttachements={afterDeleteAttachements}
          deleteLoading={deleteLoading}
        />
      </div>

      <CommentFormForTasks
        farmID={rowDetails?.farm_id?._id}
        taskId={rowDetails?._id}
        afterCommentAdd={afterCommentAdd}
        scoutDetails={rowDetails}
        attachement={""}
      />

      {/* <LoadingComponent loading={loading} /> */}
      <Toaster position="top-right" closeButton richColors />
    </Drawer>
  );
};
export default DrawerBoxComponent
