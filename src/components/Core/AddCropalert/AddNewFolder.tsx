import {
  TextField,
  Button,
  Dialog,
  CircularProgress,
} from "@mui/material";
import styles from "./new-folder1.module.css";
import { useEffect, useState } from "react";


const NewFolderDiloag = ({ open, captureResponseDilog, loading, defaultTitle, errorMessages, defaultArea }: any) => {

  const [title, setTitle] = useState('');
  const [area, setArea] = useState('');

  useEffect(() => {
    setTitle(defaultTitle);
    setArea(defaultArea);
  }, [open]);


  const handleKeyPress = (event: any) => {
    const keyPressed = event.key;
    const allowedCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];

    if (!allowedCharacters.includes(keyPressed)) {
      event.preventDefault();
    }
  };

  const callData = () => {

    let obj = {
      title: title ? title : "",
      crop_area: area ? +area : null,
    };
    captureResponseDilog(obj)
  }

  return (
    <Dialog open={open} PaperProps={{
      sx: {
        borderRadius: "16px", width: "90%", margin: "0", maxWidth: "370px !important"
      }
    }}>

      <div className={styles.newfolder}>
        <div className={styles.frame}>
          <h3 className={styles.newFolder}>{defaultTitle ? `Rename Crop` : `New Crop`}</h3>

          <div style={{ textAlign: "left", width: "100%" }}>
            <h4 style={{ margin: "0", paddingBlock: "0.5rem" }}>{'Title'}<strong style={{ color: "rgb(228 12 15)" }}>*</strong></h4>
          </div>
          <TextField
            className={styles.input}
            color="primary"
            size="small"
            placeholder="Enter folder title here"
            variant="outlined"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            onKeyDown={(e: any) => { if (e.key == 'Enter') callData(); }}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: "8px !important"
              }
            }}
            error={errorMessages ? errorMessages['title'] : ""}
            helperText={errorMessages ? errorMessages['title'] : ""}
          />

        </div>

        <div className={styles.frame}>
          <div style={{ textAlign: "left", width: "100%" }}>

            <h4 style={{ margin: "0", paddingBlock: "0.5rem" }}>{'Crop Area'}<strong style={{ color: "rgb(228 12 15)" }}>*</strong></h4>
          </div>
          <TextField
            sx={{
              '& .MuiInputBase-root': {
                background: "#fff"
              }
            }}
            className={styles.input}
            name="area"
            size="small"
            placeholder="Enter total area"
            fullWidth
            type={'number'}
            onWheel={(e: any) => e.target.blur()}
            variant="outlined"
            error={Boolean(errorMessages?.['crop_area'])}
            helperText={errorMessages?.['crop_area'] ? errorMessages?.['crop_area'] : ""}
            onKeyPress={handleKeyPress}
            inputProps={{
              step: 'any'
            }}
            value={area}
            onChange={(e) => setArea(e.target.value)}
            InputProps={{ style: { appearance: 'none' } }}
            onKeyDown={(e: any) => { if (e.key == 'Enter') callData(); }}
          />

        </div>
        <div className={styles.buttons}>
          <Button
            className={styles.buttoncancelfolder}
            color="primary"
            size="small"
            variant="outlined"
            onClick={() => { captureResponseDilog(false); setTitle(''); setArea('') }}
          >
            Cancel
          </Button>
          <Button
            className={styles.buttoncreatefolder}
            color="primary"
            size="small"
            variant="contained"
            fullWidth
            onClick={() => callData()}
            disabled={loading}
          >
            {loading ?
              <CircularProgress size="1.5rem" sx={{ color: "white" }} /> :
              (defaultTitle ? 'Update Crop' : 'Create Crop')}

          </Button>
        </div>
      </div>
    </Dialog >
  );
};

export default NewFolderDiloag;
