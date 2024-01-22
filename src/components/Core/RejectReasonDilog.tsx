import Button from '@mui/material/Button';
import TextArea from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React, { ChangeEvent, useEffect, useState } from "react";
import ImageComponent from './ImageComponent';
import AlertComponent from './AlertComponent';
import updateMaterialStatusService from '../../../lib/services/ProcurementServices/MaterialService/updateMaterialItemStatus';
import { useSelector } from 'react-redux';

const RejectReasonDilog = ({ dialog, setRejectDilogOpen, afterRejectingMaterial, rejectLoading }: any) => {

    const [remarks, setRemarks] = useState<string>()
    const [validations, setValidations] = useState<any>()
    const [loading, setLoading] = useState<any>()
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(false);

    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );

    const handleClose = () => {
        setRemarks('')
        setRejectDilogOpen(false)
    };



    return (
        <>
            <Dialog open={Boolean(dialog)} sx={{
                '& .MuiPaper-root': {
                    // width: "50%",
                    minWidth: "400px",
                    maxWidth: "800px !important",
                }
            }}>
                <DialogTitle style={{ color: "#00435D" }}>
                    {"Add Remark"}
                </DialogTitle>
                <DialogContent>

                    <TextArea
                        value={remarks}
                        size="small"
                        multiline
                        minRows={3}
                        placeholder={"Add Remarks"}
                        style={{ width: "100%", marginTop: "10px" }}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setRemarks(e.target.value)}
                        onKeyDown={(e: any) => e.key == 'Enter' ? afterRejectingMaterial() : ""}
                    />
                    {validations ? <Typography variant='caption' color="error">{validations}</Typography> : ""}

                </DialogContent>
                <DialogActions sx={{ padding: "20px 24px" }}>
                    <Button className="cancelBtn" onClick={handleClose}>Cancel</Button>
                    <Button className="successBtn" onClick={() => {
                        afterRejectingMaterial(remarks)
                        setRejectDilogOpen(false)

                    }} >{rejectLoading ?
                        <ImageComponent src='/loading-blue.svg' width={30} height={30} alt='loading' />
                        : 'Proceed'}</Button>
                </DialogActions>
            </Dialog>

            <AlertComponent alertMessage={alertMessage} setAlertMessage={setAlertMessage} alertType={alertType} />

        </>



    )
}
export default RejectReasonDilog;