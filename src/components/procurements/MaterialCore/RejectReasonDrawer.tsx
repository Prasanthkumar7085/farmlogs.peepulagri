import ImageComponent from "@/components/Core/ImageComponent";
import { Button, CircularProgress, Drawer, IconButton, Typography } from "@mui/material"
import TextArea from '@mui/material/TextField';
import { ChangeEvent, useState } from "react";
import styles from "./rejectedMaterialDrawer.module.css"
import { Clear } from "@mui/icons-material";


const RejectedReasonDrawer = ({ dialog, setRejectDilogOpen, afterRejectingMaterial, rejectLoading }: any) => {

    const [remarks, setRemarks] = useState<string>()
    const [validations, setValidations] = useState<any>()
    const [loading, setLoading] = useState<any>()


    return (
        <>
            <Drawer open={Boolean(dialog)}
                anchor={"bottom"}
                sx={{
                    zIndex: "1300 !important",
                    '& .MuiPaper-root': {
                        width: "100%", maxWidth: "500px", margin: "0 auto", borderRadius: "20px 20px 0 0 ",
                        minHeight: "30%"
                    }
                }}
            >
                <div className={styles.drawerHeader}              >
                    <Typography className={styles.CommentsTitle}>{"Reason"}</Typography>
                    <IconButton
                        sx={{ padding: "0" }}
                        onClick={() => {
                            setRejectDilogOpen(false);
                            setRemarks("")
                            setValidations("");
                        }}
                    >
                        <Clear />
                    </IconButton>
                </div>
                <div className={styles.textfieldBlock} >
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
                </div>

                <div className={styles.procurementFormBtn}>
                    <Button
                        className={styles.cancelBtn}
                        variant="outlined"
                        onClick={() => {
                            setRejectDilogOpen(false)
                            setRemarks("")
                            setValidations("");


                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        className={styles.submitBtn}

                        variant="contained"
                        onClick={() => {
                            if (remarks) {
                                afterRejectingMaterial(remarks)
                                setRejectDilogOpen(false)
                                setRemarks('')
                            } else {
                                setValidations("Reason is Required")
                            }

                        }}
                    >
                        {rejectLoading ? (
                            <CircularProgress size="1.5rem" sx={{ color: "white" }} />
                        ) : (
                            "Submit"
                        )}
                    </Button>
                </div>

            </Drawer>

        </>

    )
}
export default RejectedReasonDrawer;