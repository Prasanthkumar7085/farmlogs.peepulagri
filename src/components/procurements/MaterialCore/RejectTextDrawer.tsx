import ImageComponent from "@/components/Core/ImageComponent";
import { Button, CircularProgress, Drawer, IconButton, Typography } from "@mui/material"
import TextArea from '@mui/material/TextField';
import { ChangeEvent, useState } from "react";
import styles from "./rejectedMaterialDrawer.module.css"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import InfoIcon from '@mui/icons-material/Info';

const RejectedTextDrawer = ({ rejectedReasonText, setRejectReasonTextOpen, reasonText }: any) => {

  const [remarks, setRemarks] = useState<string>()
  const [validations, setValidations] = useState<any>()
  const [loading, setLoading] = useState<any>()


  return (
    <>
      <Drawer
        open={Boolean(rejectedReasonText)}
        anchor={"bottom"}
        className={styles.rejectReasonDrawer}
        sx={{
          zIndex: "1300 !important",
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "500px",
            margin: "0 auto",
            borderRadius: "20px 20px 0 0 ",
            minHeight: "30%",
          },
        }}
      >
        <div className={styles.rejectReasonDrawerHeading}      >
          <Typography className={styles.CommentsTitle} color="white">{"Reason"}</Typography>
          <IconButton
            onClick={() => {
              setRejectReasonTextOpen(false);
              setRemarks("");
            }}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
        </div>
        <div className={styles.rejectReasonText} >
          {reasonText?.reason}
        </div>
      </Drawer>
    </>
  );
}
export default RejectedTextDrawer;