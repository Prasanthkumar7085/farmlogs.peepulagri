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
                setData(responseData.data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const afterCommentAdd = (value: any) => {
        if (value == true) {
            getAllScoutComments()
        }
    }

    return (
        <div style={{ width: '100%' }}>
            <CommentForm afterCommentAdd={afterCommentAdd} />
            <div style={{ marginTop: "30px" }}>
                <Threads details={data} afterCommentAdd={afterCommentAdd} />
            </div>
        </div>
    )
}
export default CommentsComponent;