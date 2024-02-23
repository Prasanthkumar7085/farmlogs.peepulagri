import {
  TextField,
  Button,
  Dialog,
  CircularProgress,
} from "@mui/material";
import styles from "./location-dialog.module.css";
import { useEffect, useState } from "react";
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';


const AddLocationDialog = ({ open, captureResponseDilog, loading, defaultTitle, errorMessages }: any) => {

  const [location, setLocation] = useState<any>(defaultTitle);

  useEffect(() => {
    setLocation(defaultTitle);
  }, [open]);


  return (
    <Dialog open={open} PaperProps={{
      sx: {
        borderRadius: "8px", width: "80%", margin: "0",
        maxWidth: "330px",
        padding: "0.5rem"
      }
    }}>

      <div className={styles.newfolder}>
        <div className={styles.frame}>
          <h3 className={styles.newFolder}>New Location</h3>
          <TextField
            className={styles.input}
            color="primary"
            size="small"
            placeholder="Add Location"
            variant="outlined"
            onChange={(e) => {
              const newValue = e.target.value.replace(/^\s+/, "");
              setLocation(newValue)
            }}
            value={location}
            onKeyDown={(e: any) => { if (e.key == 'Enter') { captureResponseDilog(location) } }}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: "4px !important",
                borderColor: "green !important"
              },
              '& .MuiInputBase-input': {
                padding: "12px 14px !important"
              }
            }}
            error={errorMessages ? Boolean(errorMessages['name']) : false}
            helperText={errorMessages ? errorMessages['name'] : ""}
          />

        </div>
        <div className={styles.buttons}>
          <Button
            className={styles.buttoncancelfolder}
            color="primary"
            size="small"
            variant="outlined"
            onClick={() => { captureResponseDilog(false); setLocation('') }}
          >
            Cancel
          </Button>
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
              ('Add')}

          </Button>

        </div>
      </div>
    </Dialog >
  );
};

export default AddLocationDialog;
