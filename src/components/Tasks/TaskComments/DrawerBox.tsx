import { Backdrop, Button, CircularProgress, IconButton, Table, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, ClickAwayListener, Card } from "@mui/material";
import { useRouter } from "next/router";
import { useRef, useState, useCallback, useEffect } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import Drawer from '@mui/material/Drawer';
import { useSelector } from "react-redux";
import AlertComponent from "@/components/Core/AlertComponent";
import CommentForm from "@/components/Scouting/Comments/comment-form";
import Threads from "@/components/Scouting/Comments/threads";
import CommentFormForTasks from "./comment-formForTasks";
import CloseIcon from '@mui/icons-material/Close';
import ThreadsForTasks from "./threadsforTasks";


const DrawerBoxComponent = ({ drawerClose, rowDetails }: any) => {
    const router = useRouter();

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);



    const [importButton, setImportButton] = useState<any>(false)
    const [fileDetails, setFileDetails] = useState<any>(null)
    const [dilogOpen, setDilogOpen] = useState<any>(false)
    const [afterReply, setAfterReply] = useState<any>()
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [alertType, setAlertType] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const [loading, setLoading] = useState<any>()
    const [data, setData] = useState<any>()


    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);

    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
    };

    useEffect(() => {
        getAllScoutComments()
    }, [])


    const getAllScoutComments = async () => {

        let options = {
            method: "GET",
            headers: new Headers({
                'content-type': 'application/json',
                'authorization': accessToken
            }),
        }
        try {
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${rowDetails?._id}/comments/all`, options)
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
                console.log(formattedData, "p")
                setData(formattedData)

            }
        } catch (err) {
            console.log(err)
        }
    }

    //delete comment api
    const deleteComment = async (commnet_id: any) => {
        setLoading(true)
        let options = {
            method: "DELETE",
            headers: new Headers({
                'content-type': 'application/json',
                'authorization': accessToken
            }),
        }
        try {
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${rowDetails?._id}/comments/${commnet_id}`, options)
            let responseData = await response.json()
            if (responseData.success == true) {
                getAllScoutComments()
            }
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setLoading(false)
        }

    }

    //update any commnet api event
    const updateComment = async (commnet_id: any, updatedContent: any) => {
        setLoading(true)
        let options = {
            method: "PATCH",
            headers: new Headers({
                'content-type': 'application/json',
                'authorization': accessToken
            }),
            body: JSON.stringify({
                "content": updatedContent
            })
        }
        try {
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${rowDetails?._id}/comments/${commnet_id}`, options)
            let responseData = await response.json()
            if (responseData.success == true) {
                getAllScoutComments()
            }
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setLoading(false)

        }
    }

    //adding comment then call the get all api
    const afterCommentAdd = (value: any) => {
        if (value == true) {
            getAllScoutComments()
            setAfterReply(true)
        }
    }

    //delete comment 
    const afterDeleteComment = (value: any) => {
        if (value) {
            deleteComment(value)
        }
    }

    // //edit commnet function call (after update any commnet)
    const afterUpdateComment = (id: any, value: any) => {
        if (value) {
            updateComment(id, value)
        }
    }




    return (


        <Drawer
            anchor="right"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
        >
            <IconButton onClick={() => drawerClose(false)} sx={{ display: "flex", justifyContent: "flex-end" }}><CloseIcon /></IconButton>

            <div style={{ display: "flex", flexDirection: "column", width: 600, marginTop: "86%", padding: "1rem" }}>
                <ThreadsForTasks farmID={rowDetails.farm_id._id} taskId={rowDetails._id} details={data} afterCommentAdd={afterCommentAdd} afterDeleteComment={afterDeleteComment} afterUpdateComment={afterUpdateComment} afterReply={afterReply} />
                <CommentFormForTasks farmID={rowDetails.farm_id._id} taskId={rowDetails._id} afterCommentAdd={afterCommentAdd} />

            </div>

        </Drawer>

    );
}

export default DrawerBoxComponent;