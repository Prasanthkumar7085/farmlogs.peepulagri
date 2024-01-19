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

const RejectReasonDilog = ({ data, dialog, onDilogCloseClick, editRemark }: any) => {

    const [remarks, setRemarks] = useState<string>(data?.remarks)
    const [validations, setValidations] = useState<any>()
    const [loading, setLoading] = useState<any>()
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(false);

    useEffect(() => {
        console.log(data?.remarks);

        setRemarks(data?.remarks)
    }, [data?.remarks, dialog])

    const handleClose = () => {
        setRemarks('')
        onDilogCloseClick("close")
    };
    const addDataFeilds = () => {
        onDilogCloseClick("submit")
    }

    const addRemarks = async () => {
        setLoading(true)
        let body: any = {
            remarks: remarks
        }

        try {
            if (remarks || data?.remarks) {
                let res = await fetch(`/api/clients/updateRemarksOneClient?id=${data?.id}`, { method: "PUT", body: JSON.stringify(body) })
                let responseData = await res.json()
                if (responseData?.success == true) {
                    if (editRemark == true) {
                        setAlertMessage("Remark Updated Successfully");
                        setAlertType(true);
                    }
                    else {
                        setAlertMessage("Remark Added Successfully");
                        setAlertType(true);
                    }
                    setLoading(false)
                    setRemarks("")
                    handleClose()
                    addDataFeilds()
                }
                else {
                    setAlertMessage(responseData.message);
                    setAlertType(false);
                    setLoading(false)
                    handleClose()

                }
            }
            else {
                setValidations("Remarks Required");
                setLoading(false)

            }

        }
        catch (err) {
            console.log(err)
        }
    }
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
                    {editRemark == true ? "Edit Remark" : "Add Remark"}
                </DialogTitle>
                <DialogContent>

                    <TextArea
                        value={remarks}
                        size="small"
                        multiline
                        minRows={3}
                        placeholder={editRemark == true ? "Edit Remarks" : "Add Remarks"}
                        style={{ width: "100%", marginTop: "10px" }}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setRemarks(e.target.value)}
                        onKeyDown={(e: any) => e.key == 'Enter' ? addRemarks() : ""}
                    />
                    {validations ? <Typography variant='caption' color="error">{validations}</Typography> : ""}

                </DialogContent>
                <DialogActions sx={{ padding: "20px 24px" }}>
                    <Button className="cancelBtn" onClick={handleClose}>Cancel</Button>
                    <Button className="successBtn" onClick={() => {
                        addRemarks()
                    }} >{loading ?
                        <ImageComponent src='/loading-blue.svg' width={30} height={30} alt='loading' />
                        : 'Proceed'}</Button>
                </DialogActions>
            </Dialog>

            <AlertComponent alertMessage={alertMessage} setAlertMessage={setAlertMessage} alertType={alertType} />

        </>



    )
}
export default RejectReasonDilog;