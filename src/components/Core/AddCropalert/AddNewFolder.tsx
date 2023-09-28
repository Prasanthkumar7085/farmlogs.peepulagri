import type { NextPage } from "next";
import {
  TextField,
  InputAdornment,
  Icon,
  IconButton,
  Button,
  Dialog,
  CircularProgress,
} from "@mui/material";
import styles from "./new-folder1.module.css";
import { useState } from "react";



const NewFolderDiloag = ({ open, captureResponseDilog, loading }: any) => {

  const [title, setTitle] = useState<any>()
  return (
    <Dialog open={open} >

      <div className={styles.newfolder}>
        <div className={styles.frame}>
          <h3 className={styles.newFolder}>{`New Folder `}</h3>
          <TextField
            className={styles.input}
            color="primary"
            size="small"
            placeholder="Type folder name here"
            variant="outlined"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.buttons}>
          <Button
            className={styles.buttoncreatefolder}
            color="primary"
            size="small"
            variant="contained"
            onClick={() => captureResponseDilog(title)}

          >
            {loading ? <CircularProgress size="1.5rem" sx={{ color: "white" }} /> : 'Create Folder!'}

          </Button>
          <Button
            className={styles.buttoncreatefolder}
            color="primary"
            size="small"
            variant="outlined"
            onClick={() => captureResponseDilog(false)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Dialog >
  );
};

export default NewFolderDiloag;
