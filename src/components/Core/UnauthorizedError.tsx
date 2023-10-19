
import { Dialog, DialogContent, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ImageComponent from "./ImageComponent";

const UnauthorizedError = () => {

    const router = useRouter();
    useEffect(() => {
        removeData();
    })

    const removeData = () => {
        setTimeout(() => {
            router.push('/')
        }, 3000)
    }

    return (
        <Dialog
            open={true}
            aria-labelledby="responsive-dialog-title"
            sx={{
                '& .MuiPaper-root ': {
                    padding: "1.5rem 1rem 1rem",
                    overflow: "visible",
                },

            }}
        >
            <DialogContent>

                <ImageComponent image="/session-expired.png" height={200} alt="loading" width={300} />
                <Typography variant='h5' sx={{ color: "red" }}>Error!</Typography>
                <Typography>Unauthorized!</Typography>
            </DialogContent>
        </Dialog>
    )
}
export default UnauthorizedError;