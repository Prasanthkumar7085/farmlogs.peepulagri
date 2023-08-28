import CardWorkType from "./card-work-type";
import Resource from "./resource";
import AdditionalInformation from "./additional-information";
import Attachments from "./attachments";
import styles from "./form.module.css";

const Form = ({ setFiles, setResources, setAdditionalResources, captureDates, setWorkType, singleLogDetails, setActiveStepBasedOnData, onChangeFile, uploadFiles, files }: any) => {
  return (
    <section className={styles.form}>
      <CardWorkType setWorkType={setWorkType} captureDates={captureDates} singleLogDetails={singleLogDetails} setActiveStepBasedOnData={setActiveStepBasedOnData} />
      <Resource setResources={setResources} singleLogDetails={singleLogDetails} setActiveStepBasedOnData={setActiveStepBasedOnData} />
      <AdditionalInformation setAdditionalResources={setAdditionalResources} singleLogDetails={singleLogDetails} setActiveStepBasedOnData={setActiveStepBasedOnData} />
      <Attachments onChangeFile={onChangeFile} uploadFiles={uploadFiles} files={files} setFiles={setFiles} />
    </section>
  );
};

export default Form;
