import type { NextPage } from "next";
import CardWorkType from "./card-work-type";
import Resource from "./resource";
import AdditionalInformation from "./additional-information";
import Attachments from "./attachments";
import styles from "./form.module.css";
const Form = ({ setResources, setAdditionalResources, captureDates, setWorkType }: any) => {
  return (
    <section className={styles.form}>
      <CardWorkType setWorkType={setWorkType} captureDates={captureDates} />
      <Resource setResources={setResources} />
      <AdditionalInformation setAdditionalResources={setAdditionalResources} />
      <Attachments />
    </section>
  );
};

export default Form;
