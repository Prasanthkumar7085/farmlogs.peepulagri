import { Button, CircularProgress, Dialog } from "@mui/material";
import styles from "./alert-delete.module.css";
import { useEffect, useState } from "react";

interface pagePropsType {
  open: boolean;
  deleteFarm: () => void;
  setDialogOpen: (newValue: boolean) => void;
  loading: boolean;
  deleteTitleProp?: string;
}
const AlertDelete = ({
  open,
  deleteFarm,
  setDialogOpen,
  loading,
  deleteTitleProp,

}: pagePropsType) => {
  // const [deleteContent, setDeleteContent] = useState("");
  // useEffect(() => {
  //   if (deleteTitleProp) {
  //     setDeleteContent(deleteTitleProp)
  //   } else {
  //     setDeleteContent("Farm")
  //   }
  // },
  //   [])
  return (
    <Dialog
      open={open}
      PaperProps={{ sx: { borderRadius: "10px", minWidth: "290px", maxWidth: "320px" } }}
    >
      <div className={styles.alertdelete}>

        <div style={{ margin: "0 auto" }}>
          <div
            className={styles.areYouSure}
          >{`Delete this ${deleteTitleProp}`}</div>
          <div className={styles.thisWillBe}>
            {`This ${deleteTitleProp} will be deleted permanently`}
          </div>
        </div>
        <div className={styles.buttons}>
          <Button
            className={styles.buttoncancel}
            onClick={() => setDialogOpen(false)}
            size="small"
          >
            <div className={styles.text}>Cancel</div>
          </Button>
          <Button
            className={styles.buttongotit}
            variant="contained"
            color="error"
            size="small"
            disabled={loading}
            onClick={() => deleteFarm()}
            sx={{
              "&.Mui-disabled": {
                background: "#c62828",
                color: "#000"
              }
            }}
          >
            <div className={styles.text}>
              {loading ? (
                <CircularProgress size="1.3rem" sx={{ color: "white" }} />
              ) : (
                "Delete"
              )}
            </div>
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default AlertDelete;
