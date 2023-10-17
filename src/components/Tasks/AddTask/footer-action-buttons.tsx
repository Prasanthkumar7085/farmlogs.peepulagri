import { Button, Icon } from "@mui/material";
import styles from "./footer-action-buttons.module.css";
import { useRouter } from "next/router";
import ButtonComponent from "@/components/Core/ButtonComponent";

const FooterActionButtons = ({ addTask, editTask }: any) => {
  const router = useRouter();


  return (
    <div className={styles.footerActionButtons}>
      <Button
        className={styles.cancelBtn}
        // direction={false}
        onClick={() => router.back()}
        variant="contained"
        size="medium"
      >
        Cancel
      </Button>
      <Button
        className={styles.submitBtn}
        // direction={true}
        onClick={addTask}
        variant="contained"
        size="medium"
        endIcon={<Icon>arrow_forward_sharp</Icon>}
      >
        Submit
      </Button>
    </div>
  );
};

export default FooterActionButtons;
