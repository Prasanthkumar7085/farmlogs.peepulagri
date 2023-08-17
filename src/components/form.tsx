import type { NextPage } from "next";
import CardWorkType from "./card-work-type";
import Resource from "./resource";
import AdditionalInformation from "./additional-information";
import Attachments from "./attachments";
import styles from "./form.module.css";
const Form: NextPage = () => {
  return (
    <section className={styles.form}>
      <CardWorkType />
      <Resource />
      <AdditionalInformation />
      <Attachments />
    </section>
  );
};

export default Form;
