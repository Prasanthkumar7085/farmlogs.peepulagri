import type { NextPage } from "next";
import CardWorkType from "./card-work-type";
import Resource from "./resource";
import AdditionalInformation from "./additional-information";
import Attachments from "./attachments";
import styles from "./form.module.css";
const Form = ({ setResources, setAdditionalResources, captureDates, setWorkType, singleLogDetails, onChangeFile }: any) => {
  return (
    <section className={styles.form}>
      <CardWorkType setWorkType={setWorkType} captureDates={captureDates} singleLogDetails={singleLogDetails} />
      <Resource setResources={setResources} singleLogDetails={singleLogDetails} />
      <AdditionalInformation setAdditionalResources={setAdditionalResources} singleLogDetails={singleLogDetails} />
      <Attachments onChangeFile={onChangeFile} />
    </section>
  );
};

export default Form;
