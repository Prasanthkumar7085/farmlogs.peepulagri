import { Button, CircularProgress, Dialog } from "@mui/material";
import styles from "./alert-delete.module.css";

interface pagePropsType {
  open: boolean;
  deleteFarm: () => void;
  setDialogOpen: (newValue: boolean) => void;
  loading: boolean;
}
const AlertDelete = ({
  open,
  deleteFarm,
  setDialogOpen,
  loading,
}: pagePropsType) => {
  return (
    <Dialog
      open={open}
      PaperProps={{ sx: { borderRadius: "16px", minWidth: "290px", maxWidth: "320px" } }}
    >
      <div className={styles.alertdelete}>
        <img className={styles.infoIcon} alt="" src="/info-icon.svg" />
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
            size="small"
          >
            <div className={styles.text}>Cancel</div>
          </Button>
          <Button
            className={styles.buttongotit}
            variant="contained"
            color="error"
            size="small"
            onClick={() => deleteFarm()}
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

export default AlertDelete;
