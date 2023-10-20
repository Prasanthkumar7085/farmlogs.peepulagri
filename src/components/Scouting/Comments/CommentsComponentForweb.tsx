import { useSelector } from "react-redux";
import CommentForm from "./comment-form"
import Threads from "./threads"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingComponent from "@/components/Core/LoadingComponent";
import AlertComponent from "@/components/Core/AlertComponent";
import styles from "./CommentsComponent.module.css";
import CommentFormComponentForListScouts from "./CommentFormComponentForListScouts";

const CommentsComponentForWeb = ({ attachmentDetails }: any) => {
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const router = useRouter();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<any>();
  const [afterReply, setAfterReply] = useState<any>();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(false);

  useEffect(() => {
    if (router.isReady && accessToken && attachmentDetails?._id) {
      getAllScoutComments();
    }
  }, [router.isReady, accessToken, attachmentDetails?._id]);

  const getAllScoutComments = async () => {
    let options = {
      method: "GET",
      headers: new Headers({
        "content-type": "application/json",
        authorization: accessToken,
      }),
    };
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/scouts/${attachmentDetails?.scout_id}/attachments/${attachmentDetails?._id}/comments/all`,
        options
      );
      let responseData = await response.json();
      console.log(responseData);

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
        `${process.env.NEXT_PUBLIC_API_URL}/scouts/${attachmentDetails?._id}/comments/${commnet_id}`,
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
        `${process.env.NEXT_PUBLIC_API_URL}/scouts/${attachmentDetails?._id}/comments/${commnet_id}`,
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
        `${process.env.NEXT_PUBLIC_API_URL}/scouts/${attachmentDetails?._id}/${commentId}/attachments`,
        options
      );
      let responseData = await response.json();
      if (responseData.success == true) {
        setAlertMessage("Attachement deleted successfully");
        setAlertType(true);
        getAllScoutComments();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.CommentsBlock}>
      <div className={styles.allThreads}>
        <Threads
          details={data}
          attachmentDetails={attachmentDetails}
          afterCommentAdd={afterCommentAdd}
          afterDeleteComment={afterDeleteComment}
          afterUpdateComment={afterUpdateComment}
          afterReply={afterReply}
          afterDeleteAttachements={afterDeleteAttachements}
        />
      </div>
      <CommentFormComponentForListScouts
        afterCommentAdd={afterCommentAdd}
        attachmentDetails={attachmentDetails}
      />

      <LoadingComponent loading={loading} />
      <AlertComponent
        alertMessage={alertMessage}
        alertType={alertType}
        setAlertMessage={setAlertMessage}
      />
    </div>
  );
};
export default CommentsComponentForWeb;