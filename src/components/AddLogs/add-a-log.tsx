import type { NextPage } from "next";
import ProgressSteps from "./progress-steps";
import Form from "./form";
import FooterActionButtons from "./footer-action-buttons";
import styles from "./add-a-log.module.css";
import Header from "./header";
import { useForm, SubmitHandler } from "react-hook-form"
import { useRouter } from "next/router";

const AddALog: NextPage = () => {

  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const addLogs = (data: any) => {

    console.log(data);

  }
  return (
    <div className={styles.form}>
      {router.query.farm_id ? <form onSubmit={handleSubmit(addLogs)}>
        <Header register={register} />
        <div className={styles.secondaryFormField}>
          <ProgressSteps />
          <Form register={register} />
        </div>
        <FooterActionButtons />
      </form> : ""}
    </div>
  );
};

export default AddALog;
