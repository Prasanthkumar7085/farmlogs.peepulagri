import { removeUserDetails } from "@/Redux/Modules/Auth";
import {
  deleteAllMessages,
  removeTheAttachementsFilesFromStore,
} from "@/Redux/Modules/Conversations";
import AlertComponent from "@/components/Core/AlertComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import CloseIcon from "@mui/icons-material/Close";
import { Drawer, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import styles from "./CommentsComponent.module.css";
import CommentForm from "./comment-form";
import Threads from "./threads";
import { toast } from "sonner";
import CommentFormForMobile from "./comment-formMobile";

const DrawerComponentForScout = ({
  drawerClose,
  openCommentsBox,
  attachement,
  scoutDetails,
}: any) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<any>();
  const [afterReply, setAfterReply] = useState<any>();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [, , removeCookie] = useCookies(["userType_v2"]);
  const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);

  useEffect(() => {
    if ((router.isReady, accessToken, attachement && openCommentsBox == true)) {
      getAllScoutComments();
      setLoadingThreads(true);
    }
  }, [router.isReady, accessToken, scoutDetails, attachement, openCommentsBox]);

  const logout = async () => {
    try {
      removeCookie("userType_v2");
      loggedIn_v2("loggedIn_v2");
      router.push("/");
      await dispatch(removeUserDetails());
      await dispatch(deleteAllMessages());
    } catch (err: any) {
      console.error(err);
    }
  };
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
        // `${process.env.NEXT_PUBLIC_API_URL}/scouts/${scoutDetails?._id}/attachments/${attachement?._id}/comments/all`,
        `${process.env.NEXT_PUBLIC_API_URL}/farm-images/${attachement?._id}/comments`,
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
      } else if (responseData?.statusCode == 403) {
        await logout();
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
        `${process.env.NEXT_PUBLIC_API_URL}/farm-images/comment/${commnet_id}/delete`,
        options
      );
      let responseData = await response.json();
      if (responseData.success == true) {
        getAllScoutComments();
        toast.success(responseData?.message);
      } else if (responseData?.statusCode == 403) {
        await logout();
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
        `${process.env.NEXT_PUBLIC_API_URL}/farm-images/comment/${commnet_id}`,
        options
      );
      let responseData = await response.json();
      if (responseData.success == true) {
        getAllScoutComments();
        toast.success(responseData?.message);
      } else if (responseData?.statusCode == 403) {
        await logout();
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
        `${process.env.NEXT_PUBLIC_API_URL}/scout/${scoutDetails?._id}/attachments/${attachement?._id}/comments/${commentId}/attachments`,
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
      sx={{
        zIndex: "1300 !important",
        "& .MuiPaper-root": {
          width: "90%",
          maxWidth: "300px",
          margin: "0 auto",
          borderRadius: "20px 20px 0 0 ",
        },
      }}
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
        <CommentFormForMobile
          afterCommentAdd={afterCommentAdd}
          scoutDetails={data}
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
