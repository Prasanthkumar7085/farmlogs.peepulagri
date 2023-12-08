import { Button, CircularProgress, Dialog } from "@mui/material";
import styles from "./alert-status.module.css";

interface pagePropsType {
  open: boolean;
  statusChange: () => void;
  setDialogOpen: (newValue: boolean) => void;
  loading: boolean;
}
const AlertStautsChange = ({
  open,
  statusChange,
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
          >{`Are you sure  Want To change status `}</div>
          <div className={styles.thisWillBe}>
            This Will Be Changed Permanently
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
            color="info"
            size="small"
            disabled={loading}
            onClick={() => statusChange()}
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
                "Done"
              )}
            </div>
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default AlertStautsChange;
