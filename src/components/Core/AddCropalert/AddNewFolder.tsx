import {
  TextField,
  Button,
  Dialog,
  CircularProgress,
} from "@mui/material";
import styles from "./new-folder1.module.css";
import { useEffect, useState } from "react";



const NewFolderDiloag = ({ open, captureResponseDilog, loading,defaultTitle }: any) => {

  const [title, setTitle] = useState<any>();

  useEffect(() => {
    setTitle(defaultTitle);
  },[defaultTitle])

  return (
    <Dialog open={open} PaperProps={{ sx: { borderRadius: "16px",minWidth:"350px" } }}>

      <div className={styles.newfolder}>
        <div className={styles.frame}>
          <h3 className={styles.newFolder}>{defaultTitle ? `Rename Folder`:`New Folder`}</h3>
          <TextField
            className={styles.input}
            color="primary"
            size="small"
            placeholder="Type folder name here"
            variant="outlined"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </div>
        <div className={styles.buttons}>
          <Button
            className={styles.buttoncreatefolder}
            color="primary"
            size="small"
            variant="contained"
            onClick={() => captureResponseDilog(title)}
            disabled={!title}
          >
            {loading ?
              <CircularProgress size="1.5rem" sx={{ color: "white" }} /> :
              (defaultTitle ? 'Update Folder!' : 'Create Folder!')}

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
