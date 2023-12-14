import { TextField } from "@mui/material";
import { useState } from "react";


const AddMultipleComments = ({ captureComment }: any) => {

    const [comment, setComment] = useState<any>();

    return (
        <div>
            <div style={{ paddingBottom: "5px", fontSize: "clamp(13px, 2.5vw, 14px)", fontFamily: "'Inter', sans-serif" }}>Comments</div>
            <TextField
                color="primary"
                name="desciption"
                id="description"
                minRows={4}
                maxRows={4}
                placeholder="Enter your comment here"
                fullWidth={true}
                variant="outlined"
                multiline
                value={comment}
                onChange={(e) => {
                    setComment(e.target.value);
                    captureComment(e.target.value)
                }}
                sx={{ background: "#fff" }}
            />
        </div>
    )
}
export default AddMultipleComments;