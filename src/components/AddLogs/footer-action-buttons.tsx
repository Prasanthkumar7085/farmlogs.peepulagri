import { Icon } from "@mui/material";
import styles from "./footer-action-buttons.module.css";
import { useRouter } from "next/router";
import ButtonComponent from "../Core/ButtonComponent";

const FooterActionButtons = ({ addLogs, editLog }: any) => {
  const router = useRouter();
  return (
    <div className={styles.footerActionButtons}>
          <ButtonComponent
            direction={false}
            onClick={() => router.back()}
            variant="outlined"
            color="primary"
            title={'Back'}
            endIcon={<Icon>arrow_back_sharp</Icon>}
          />
          <ButtonComponent
            direction={true}
          onClick={router?.query.log_id || router?.query.support_id ? () => editLog() : () => addLogs()}
            variant="contained"
            color="primary"
          title={router?.query.log_id || router?.query.support_id ? 'Update' : 'Submit'}
            endIcon={<Icon>arrow_forward_sharp</Icon>}
          />
    </div>
  );
};

export default FooterActionButtons;
