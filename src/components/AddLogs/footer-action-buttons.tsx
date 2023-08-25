import { Icon } from "@mui/material";
import styles from "./footer-action-buttons.module.css";
import { useRouter } from "next/router";
import ButtonComponent from "../Core/ButtonComponent";

const FooterActionButtons = ({ addLogs, editLog }: any) => {
  const router = useRouter();
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

            <ButtonComponent
              direction={false}
              onClick={() => router.back()}
              variant="outlined"
              color="primary"
              title={'Back'}
              endIcon={<Icon>arrow_back_sharp</Icon>}
            />
          </div>
          {router?.query.log_id ?
            <div className={styles.button1}>
              <ButtonComponent
                direction={true}
                onClick={editLog}
                variant="contained"
                color="primary"
                title={'Update'}
                endIcon={<Icon>arrow_forward_sharp</Icon>}
              />
            </div> :
            <div className={styles.button1}>
              <ButtonComponent
                direction={true}
                onClick={addLogs}
                variant="contained"
                color="primary"
                title={'Submit'}
                endIcon={<Icon>arrow_forward_sharp</Icon>}
              />
            </div>
          }

        </div>
      </div>
    </div>
  );
};

export default FooterActionButtons;
