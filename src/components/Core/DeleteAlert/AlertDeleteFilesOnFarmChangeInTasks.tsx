import { Button, CircularProgress, Dialog } from "@mui/material";
import styles from "./alert-delete.module.css";

interface pagePropsType {
  open: boolean;
  deleteFiles: () => void;
  setDialogOpen: (newValue: boolean) => void;
}
const AlertDeleteFilesOnFarmChangeInTasks = ({
  open,
  deleteFiles,
  setDialogOpen,
}: pagePropsType) => {
  return (
    <Dialog
      open={open}
      PaperProps={{ sx: { borderRadius: "16px", minWidth: "350px" } }}
    >
      <div className={styles.alertdelete}>
        <img className={styles.infoIcon} alt="" src="/info-icon.svg" />
        <div>
          <div
            className={styles.areYouSure}
          >{`Are you sure  Want To Delete Files`}</div>
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
            variant="contained"
            color="error"
            onClick={() => deleteFiles()}
          >
            <div className={styles.text}>{"Delete"}</div>
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default AlertDeleteFilesOnFarmChangeInTasks;
