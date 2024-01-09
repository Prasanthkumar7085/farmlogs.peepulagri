import type { NextPage } from "next";
import styles from "./alert-delete.module.css";
import { Button, CircularProgress, Dialog } from "@mui/material";


interface pagePropsType {
  open: boolean;
  deleteImagesEvent: () => void;
  setDialogOpen: (newValue: boolean) => void;
  loading: boolean

}
const AlertImagesDelete = ({ open, deleteImagesEvent, setDialogOpen, loading }: pagePropsType) => {
  return (
    <Dialog
      open={open}
      PaperProps={{ sx: { borderRadius: "16px", minWidth: "350px" } }}
    >
      <div className={styles.alertdelete}>
        <picture>
          <img className={styles.infoIcon} alt="" src="/info-icon.svg" />
        </picture>
        <div>
          <div
            className={styles.areYouSure}
          >{`Are you sure  Want To Delete `}</div>
          <div className={styles.thisWillBe}>
            This Will Be deleted Permanently
          </div>
        </div>
        <div className={styles.buttons}>
          <Button
            className={styles.buttoncancel}
            onClick={() => setDialogOpen(false)}
          >
            <div className={styles.text}>Cancel</div>
          </Button>
          <Button
            className={styles.buttongotit}
            onClick={() => deleteImagesEvent()}
          >
            <div className={styles.text}>
              {loading ? (
                <CircularProgress size="1.5rem" sx={{ color: "white" }} />
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

export default AlertImagesDelete;
