import { Icon } from "@mui/material";
import styles from "./footer-action-buttons.module.css";
import { useRouter } from "next/router";
import ButtonComponent from "@/components/Core/ButtonComponent";

const FooterActionButtons = ({ addTask, editTask }: any) => {
  const router = useRouter();


  return (
    <div className={styles.footerActionButtons}>
      <ButtonComponent
            direction={false}
        onClick={() => router.back()}
            variant="outlined"
            color="primary"
            size="medium"
        title={'Cancel'}
      // endIcon={<Icon>arrow_back_sharp</Icon>}
      />
          <ButtonComponent
            direction={true}
            onClick={addTask}
            variant="contained"
            color="primary"
            size="medium"
            title={'Submit'}
            endIcon={<Icon>arrow_forward_sharp</Icon>}
          />
    </div>
  );
};

export default FooterActionButtons;
