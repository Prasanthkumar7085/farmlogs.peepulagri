import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"

const DeleteDialogCompoennt = ({ deleteContent, deleteDialogOpen, confirmDelete }: any) => {
    return (

        <Dialog
            open={deleteDialogOpen}
            onClose={() => confirmDelete(false, '')}
        >
            <DialogTitle id="alert-dialog-title" sx={{ color: "red" }}>
                {"Delete The Log!"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <p style={{ fontSize: "20px" }}> {`Do you really wanna delete the log `}</p>
                    <p style={{ fontSize: "15px", color: "blue" }}>{`${deleteContent?.title}`}</p>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => confirmDelete(false, '')}>Cancel</Button>
                <Button onClick={() => confirmDelete(true, deleteContent?._id)} autoFocus>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>

    )
}

export default DeleteDialogCompoennt;