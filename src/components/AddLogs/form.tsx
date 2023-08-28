import type { NextPage } from "next";
import CardWorkType from "./card-work-type";
import Resource from "./resource";
import AdditionalInformation from "./additional-information";
import Attachments from "./attachments";
import styles from "./form.module.css";
const Form = ({ setResources, setAdditionalResources, captureDates, setWorkType, singleLogDetails, setActiveStepBasedOnData }: any) => {
  return (
    <section className={styles.form}>
      <CardWorkType setWorkType={setWorkType} captureDates={captureDates} singleLogDetails={singleLogDetails} setActiveStepBasedOnData={setActiveStepBasedOnData} />
      <Resource setResources={setResources} singleLogDetails={singleLogDetails} setActiveStepBasedOnData={setActiveStepBasedOnData} />
      <AdditionalInformation setAdditionalResources={setAdditionalResources} singleLogDetails={singleLogDetails} setActiveStepBasedOnData={setActiveStepBasedOnData} />
      <Attachments />
    </section>
  );
};

export default Form;
