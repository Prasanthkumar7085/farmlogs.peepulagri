import {
  TextField,
  Button,
  Dialog,
  CircularProgress,
} from "@mui/material";
import styles from "./location-dialog.module.css";
import { useEffect, useState } from "react";


const AddLocationDialog = ({ open, captureResponseDilog, loading, defaultTitle, errorMessages }: any) => {

  const [location, setLocation] = useState<any>(defaultTitle);

  useEffect(() => {
    setLocation(defaultTitle);
  }, [open]);
  

  return (
    <Dialog open={open} PaperProps={{
      sx: {
        borderRadius: "16px", width: "90%", margin: "0",

      }
    }}>

      <div className={styles.newfolder}>
        <div className={styles.frame}>
          <h3 className={styles.newFolder}>{`Add Location`}</h3>
          <TextField
            className={styles.input}
            color="primary"
            size="small"
            placeholder="Add Location"
            variant="outlined"
            onChange={(e) => setLocation(e.target.value)}
            value={location}
            onKeyDown={(e: any) => { if (e.key == 'Enter') { captureResponseDilog(location) } }}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: "8px !important"
              }
            }}
            error={errorMessages ? Boolean(errorMessages['title']) : false}
            helperText={errorMessages ? errorMessages['title'] : ""}
          />
         
        </div>
        <div className={styles.buttons}>
          <Button
            className={styles.buttoncreatefolder}
            color="primary"
            size="small"
            variant="contained"
            onClick={() => captureResponseDilog(location)}
            disabled={!location}
          >
            {loading ?
              <CircularProgress size="1.5rem" sx={{ color: "white" }} /> :
             ('Add Location')}

          </Button>
          <Button
            className={styles.buttoncancelfolder}
            color="primary"
            size="small"
            variant="outlined"
            onClick={() => { captureResponseDilog(false); setLocation('')}}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Dialog >
  );
};

export default AddLocationDialog;
