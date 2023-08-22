import type { NextPage } from "next";
import { Button, Icon } from "@mui/material";
import styles from "./footer-action-buttons.module.css";
const FooterActionButtons: NextPage = () => {
  return (
    <div className={styles.footerActionButtons}>
      <div className={styles.modalActions}>
        <div className={styles.button}>
          <div className={styles.buttonBase}>
            <img
              className={styles.arrowLeft1Icon}
              alt=""
              src="/arrowleft-1.svg"
            />
            <div className={styles.text}>Back</div>
          </div>
        </div>
        <div className={styles.buttons}>
          <div className={styles.button1}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Icon>arrow_back_sharp</Icon>}

            >
              Back
            </Button>
          </div>
          <div className={styles.button1}>
            <Button
              type='submit'
              variant="contained"
              color="primary"
              endIcon={<Icon>arrow_forward_sharp</Icon>}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterActionButtons;
