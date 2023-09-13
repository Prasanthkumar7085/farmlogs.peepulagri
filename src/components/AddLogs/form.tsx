import CardWorkType from "./card-work-type";
import Resource from "./resource";
import AdditionalInformation from "./additional-information";
import LogAttachments from "./LogAttachments";
import styles from "./form.module.css";

const Form = ({ uploadFailedMessage, loadAttachments, deleteSelectedFile, setResources, setAdditionalResources, captureDates, setWorkType, setCategoryList, singleLogDetails, setActiveStepBasedOnData, onChangeFile, uploadFiles, files, uploadButtonLoading, uploadFailed, errorMessages, captureCategoriesArray }: any) => {

  return (
    <section className={styles.form}>
      <CardWorkType captureCategoriesArray={captureCategoriesArray} setWorkType={setWorkType} captureDates={captureDates} singleLogDetails={singleLogDetails} setActiveStepBasedOnData={setActiveStepBasedOnData} errorMessages={errorMessages} setCategoryList={setCategoryList} />
      <Resource setResources={setResources} singleLogDetails={singleLogDetails} setActiveStepBasedOnData={setActiveStepBasedOnData} errorMessages={errorMessages} />
      <AdditionalInformation setAdditionalResources={setAdditionalResources} singleLogDetails={singleLogDetails} setActiveStepBasedOnData={setActiveStepBasedOnData} errorMessages={errorMessages} />
      <LogAttachments uploadFailedMessage={uploadFailedMessage} loadAttachments={loadAttachments} deleteSelectedFile={deleteSelectedFile} onChangeFile={onChangeFile} uploadFiles={uploadFiles} files={files} uploadButtonLoading={uploadButtonLoading} uploadFailed={uploadFailed} />
    </section>
  );
};

export default Form;
