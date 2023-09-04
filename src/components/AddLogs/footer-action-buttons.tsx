import { Icon } from "@mui/material";
import styles from "./footer-action-buttons.module.css";
import { useRouter } from "next/router";
import ButtonComponent from "../Core/ButtonComponent";

const FooterActionButtons = ({ addLogs, editLog }: any) => {
  const router = useRouter();

  const goBack = () => {

    if (router.query.farm_id) {
      router.push(`/farm/${router.query.farm_id}/logs`)
    } else {
      router.push('/support')
    }
  }
  return (
    <div className={styles.footerActionButtons}>
      <ButtonComponent
            direction={false}
        onClick={goBack}
            variant="outlined"
            color="primary"
            size="medium"
        title={'Cancel'}
      // endIcon={<Icon>arrow_back_sharp</Icon>}
      />
          <ButtonComponent
            direction={true}
          onClick={router?.query.log_id || router?.query.support_id ? () => editLog() : () => addLogs()}
            variant="contained"
            color="primary"
            size="medium"
          title={router?.query.log_id || router?.query.support_id ? 'Update' : 'Submit'}
            endIcon={<Icon>arrow_forward_sharp</Icon>}
          />
    </div>
  );
};

export default FooterActionButtons;
