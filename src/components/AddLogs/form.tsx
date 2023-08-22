import type { NextPage } from "next";
import CardWorkType from "./card-work-type";
import Resource from "./resource";
import AdditionalInformation from "./additional-information";
import Attachments from "./attachments";
import styles from "./form.module.css";
const Form = ({ register, setResources, setAdditionalResources, captureDates }: any) => {
  return (
    <section className={styles.form}>
      <CardWorkType register={register} captureDates={captureDates} />
      <Resource register={register} setResources={setResources} />
      <AdditionalInformation register={register} setAdditionalResources={setAdditionalResources} />
      <Attachments />
    </section>
  );
};

export default Form;
