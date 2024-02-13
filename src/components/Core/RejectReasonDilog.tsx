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
import styles from "./RejectReasonDialog.module.css"

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
                <DialogTitle className={styles.dialogHeading} >
                    {"Reason"}
                </DialogTitle>
                <DialogContent>

                    <TextArea
                        value={remarks}
                        size="small"
                        multiline
                        minRows={3}
                        placeholder={"Write"}
                        sx={{
                            width: "100%", marginTop: "4px", '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: "#A6AAB6 !important",
                                borderRadius: "10px !important"
                            }
                        }}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const newValue = e.target.value.replace(/^\s+/, "");
                            setRemarks(newValue)
                        }}
                        onKeyDown={(e: any) => e.key == 'Enter' ? afterRejectingMaterial() : ""}
                    />
                    {validations ? <Typography variant='caption' color="error">{validations}</Typography> : ""}

                </DialogContent>
                <DialogActions className={styles.dialogBtnGrp}>
                    <Button className={styles.cancelBtn} onClick={handleClose}>Cancel</Button>
                    <Button className={styles.submitBtn} onClick={() => {
                        afterRejectingMaterial(remarks)
                        setRejectDilogOpen(false)
                        setRemarks('')


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