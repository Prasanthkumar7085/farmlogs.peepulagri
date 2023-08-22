import type { NextPage } from "next";
import CardWorkType from "./card-work-type";
import Resource from "./resource";
import AdditionalInformation from "./additional-information";
import Attachments from "./attachments";
import styles from "./form.module.css";
const Form = ({ register }: any) => {
  return (
    <section className={styles.form}>
      <CardWorkType register={register} />
      <Resource register={register} />
      <AdditionalInformation register={register} />
      <Attachments />
    </section>
  );
};

export default Form;
