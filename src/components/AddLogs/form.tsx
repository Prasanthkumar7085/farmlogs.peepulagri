import CardWorkType from "./card-work-type";
import Resource from "./resource";
import AdditionalInformation from "./additional-information";
import LogAttachments from "./LogAttachments";
import styles from "./form.module.css";

const Form = ({ setResources, setAdditionalResources, captureDates, setWorkType, singleLogDetails, setActiveStepBasedOnData, onChangeFile, uploadFiles, files }: any) => {
  return (
    <section className={styles.form}>
      <CardWorkType setWorkType={setWorkType} captureDates={captureDates} singleLogDetails={singleLogDetails} setActiveStepBasedOnData={setActiveStepBasedOnData} />
      <Resource setResources={setResources} singleLogDetails={singleLogDetails} setActiveStepBasedOnData={setActiveStepBasedOnData} />
      <AdditionalInformation setAdditionalResources={setAdditionalResources} singleLogDetails={singleLogDetails} setActiveStepBasedOnData={setActiveStepBasedOnData} />
      <LogAttachments onChangeFile={onChangeFile} uploadFiles={uploadFiles} files={files} />
    </section>
  );
};

export default Form;
