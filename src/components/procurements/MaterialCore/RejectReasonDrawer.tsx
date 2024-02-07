import ImageComponent from "@/components/Core/ImageComponent";
import { Button, Drawer, Typography } from "@mui/material"
import TextArea from '@mui/material/TextField';
import { ChangeEvent, useState } from "react";
import styles from "/src/components/Core/RejectReasonDialog.module.css"


const RejectedReasonDrawer = ({ dialog, setRejectDilogOpen, afterRejectingMaterial, rejectLoading }: any) => {

    const [remarks, setRemarks] = useState<string>()
    const [validations, setValidations] = useState<any>()
    const [loading, setLoading] = useState<any>()


    return (
        <>
            <Drawer open={Boolean(dialog)}
                anchor={"bottom"}
            >


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
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setRemarks(e.target.value)}
                    onKeyDown={(e: any) => e.key == 'Enter' ? afterRejectingMaterial() : ""}
                />
                {validations ? <Typography variant='caption' color="error">{validations}</Typography> : ""}

                <Button className={styles.cancelBtn} onClick={() => setRejectDilogOpen(false)}>Cancel</Button>
                <Button className={styles.submitBtn} onClick={() => {
                    afterRejectingMaterial(remarks)
                    setRejectDilogOpen(false)
                    setRemarks('')


                }} >{rejectLoading ?
                    <ImageComponent src='/loading-blue.svg' width={30} height={30} alt='loading' />
                    : 'Proceed'}</Button>
            </Drawer>

        </>

    )
}
export default RejectedReasonDrawer;