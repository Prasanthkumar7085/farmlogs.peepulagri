import type { NextPage } from "next";
import Header from "./header";
import ProgressSteps from "./progress-steps";
import Form from "./form";
import FooterActionButtons from "./footer-action-buttons";
import styles from "./add-a-log.module.css";
const AddALog: NextPage = () => {
  return (
    <div className={styles.form}>
      <Header />
      <div className={styles.secondaryFormField}>
        <ProgressSteps />
        <Form />
      </div>
      <FooterActionButtons />
    </div>
  );
};

export default AddALog;
