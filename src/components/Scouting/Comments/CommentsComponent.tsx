import { useSelector } from "react-redux";
import CommentForm from "./comment-form"
import Threads from "./threads"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CommentsComponent = () => {

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);
    const router = useRouter()
    const [data, setData] = useState<any>()


    useEffect(() => {
        if (router.isReady) {
            getAllScoutComments()
        }
    }, [router.isReady, accessToken])

    const getAllScoutComments = async () => {

        let options = {
            method: "GET",
            headers: new Headers({
                'content-type': 'application/json',
                'authorization': accessToken
            }),
        }
        try {
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouts/${router.query.scout_id}/comments/all`, options)
            let responseData = await response.json()
            if (responseData.success == true) {
                const commentsById: any = {};

                responseData.data.forEach((comment: any) => {
                    commentsById[comment._id] = {
                        ...comment,
                        replies: [] // Initialize an empty array for replies
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

                // Convert the commentsById object to an array of comments
                const formattedData = Object.values(commentsById);

                console.log(formattedData, "lk");
                setData(formattedData)

            }
        } catch (err) {
            console.log(err)
        }
    }

    //delete comment api
    const deleteComment = async (commnet_id: any) => {
        let options = {
            method: "DELETE",
            headers: new Headers({
                'content-type': 'application/json',
                'authorization': accessToken
            }),
        }
        try {
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouts/${router.query.scout_id}/comments/${commnet_id}`, options)
            let responseData = await response.json()
            if (responseData.success == true) {
                getAllScoutComments()
            }
        }
        catch (err) {
            console.log(err)
        }
        finally {

        }

    }

    //adding comment then call the get all api
    const afterCommentAdd = (value: any) => {
        if (value == true) {
            getAllScoutComments()
        }
    }

    //delete comment 
    const afterDeleteComment = (value: any) => {
        if (value) {
            deleteComment(value)
        }
    }



    return (
        <div style={{ width: "100%", marginTop: "1rem" }}>
            <CommentForm afterCommentAdd={afterCommentAdd} />
            <div style={{ marginTop: "30px" }}>
                <Threads details={data} afterCommentAdd={afterCommentAdd} afterDeleteComment={afterDeleteComment} />
            </div>
        </div>
    )
}
export default CommentsComponent;