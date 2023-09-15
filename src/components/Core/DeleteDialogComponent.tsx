import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material"
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Styles from './DeleteDialogComponent.module.css';

const DeleteDialogCompoennt = ({ deleteContent, deleteDialogOpen, confirmDelete }: any) => {
    return (

        <Dialog
            open={deleteDialogOpen}
            onClose={() => confirmDelete(false, '')}
            className={Styles.deleteDialog}
        >
            <DialogTitle id="alert-dialog-title">
                <div>
                    <Typography variant="h5" color="secondary" className={Styles.title}>
                        <ReportProblemIcon />
                        <span>
                            DELETE
                        </span> 
                    </Typography>              
                </div>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Typography> {`Do you really wanna delete the entry? `}</Typography>
                    <Typography variant="h6" color="primary">{deleteContent?.title?.slice(0, 1).toUpperCase() + deleteContent?.title?.slice(1,)}</Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" className={Styles.DefaultBtn} onClick={() => confirmDelete(false, '')}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={() => confirmDelete(true, deleteContent?._id)} autoFocus>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>

    )
}

export default DeleteDialogCompoennt;