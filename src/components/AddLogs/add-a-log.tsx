import type { NextPage } from "next";
import ProgressSteps from "./progress-steps";
import FooterActionButtons from "./footer-action-buttons";
import styles from "./add-a-log.module.css";
import Header from "./header";
import { useRouter } from "next/router";
import { useState } from "react";
import addLogService from "../../../lib/services/LogsService/addLogService";
import Form from "./form";
import LoadingComponent from "../Core/LoadingComponent";
import AlertComponent from "../Core/AlertComponent";
import uploadFileToS3 from "../../../lib/services/LogsService/uploadFileToS3InLog";
import addLogsAttachmentService from "../../../lib/services/LogsService/addLogsAttachmentService";
import { useSelector } from "react-redux";


const AddALog: NextPage = () => {

  const router: any = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

  const [resources, setResources] = useState([]);
  const [additionalResources, setAdditionalResources] = useState([]);
  const [dates, setDates] = useState<any>([]);
  const [formDetails, setFormDetails] = useState<any>();
  const [workType, setWorkType] = useState("");
  const [categoriesList, setCategoryList] = useState([])
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(false);

  const [files, setFiles] = useState<any>([]);
  const [filesDetailsAfterUpload, setFilesDetailsAfterUpload] = useState<any>([]);
  const [activeStepBasedOnData, setActiveStepBasedOnData] = useState(0);
  const [uploadButtonLoading, setUploadButtonLoading] = useState(false);
  const [uploadFailed, setUploadFailed] = useState(false);

  const [errorMessages, setErrorMessages] = useState<any>();
  const [loadAttachments, setLoadAttachments] = useState(true);
  const [uploadFailedMessage, setUploadFailedMessage] = useState('');


  const addLogs = async () => {
    setLoading(true);
    setErrorMessages({});

    const { categories, ...rest } = formDetails;
    const obj = {
      ...rest,
      categories: categoriesList,
      work_type: workType,
      farm_id: router.query.farm_id,
      status: 'ACTIVE',
      from_date_time: dates[0] ? new Date(dates[0]).toISOString() : "",
      to_date_time: dates[1] ? new Date(new Date(new Date(dates[1]).toISOString()).getTime() + 86399999).toISOString() : "",
      resources: resources,
      additional_resources: additionalResources,
      total_machinary_hours: resources.reduce((acc: number, item: any) => (item.type.toLowerCase() == "machinery" ? acc + ((+item.quantity) * (+item.total_hours)) : acc + 0), 0),
      total_manual_hours: resources.reduce((acc: number, item: any) => (item.type.toLowerCase() == "manual" ? acc + ((+item.quantity) * (+item.total_hours)) : acc + 0), 0),
      attachments: filesDetailsAfterUpload
    }
    try {
      let response = await addLogService(obj);

      if (response.success) {
        setAlertMessage('Log Added Successfully!');
        setAlertType(true);
        setTimeout(() => {
          router.push(`/farm/${router.query.farm_id}/logs`);
        }, 300)
      } else if (response?.status == 422) {
        setErrorMessages(response?.errors);
      } else {
        setAlertMessage('Failed to Add Logs!');
        setAlertType(false);
      }

    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }




  const onChangeFile = async (e: any) => {
    setUploadFailedMessage('');
    setLoadAttachments(false);
    setTimeout(() => {
      setLoadAttachments(true);
    }, 1);
    let filesSelected = e.target.files;
    setUploadFailed(false);
    setFiles(filesSelected);

    await uploadFiles(filesSelected);
  }
  const uploadFiles = async (filesSelected: any) => {

    setUploadButtonLoading(true);
    setUploadFailed(false);
    let tempFilesStorage = Array.from(filesSelected).map((item: any) => { return { original_name: item.name, type: item.type, size: item.size } });

    const response = await addLogsAttachmentService({ attachments: tempFilesStorage }, accessToken);
    if (response.success) {
      await postAllImages(response.data, tempFilesStorage, filesSelected);
    } else {
      setFiles([]);
      setUploadFailedMessage(response?.message);
      setUploadFailed(true);
      setUploadButtonLoading(false)
      setAlertMessage("File(s) uploaded failed!");
      setAlertType(false);
    }
  }

  const postAllImages = async (response: any, tempFilesStorage: any, filesSelected: any) => {

    let arrayForResponse: any = [];

    for (let index = 0; index < response.length; index++) {
      let uploadResponse: any = await uploadFileToS3(response[index].target_url, filesSelected[index]);
      if (uploadResponse.ok) {
        const { target_url, ...rest } = response[index];
        arrayForResponse.push({ ...rest, size: tempFilesStorage[index].size });
        setAlertMessage(`File(s) uploaded successfully`);
        setAlertType(true);
        setActiveStep(4);
      } else {
        setFiles([]);
        setUploadFailed(true);
        setAlertMessage('File(s) upload failed!');
        setAlertType(false);
      }
    }
    setFilesDetailsAfterUpload(arrayForResponse);
    setUploadButtonLoading(false);
  }

  const deleteSelectedFile = (index: any) => {
    let array = [...filesDetailsAfterUpload];
    let filesArray = [...files];
    array.splice(index, 1);
    filesArray.splice(index, 1);
    setFiles([...filesArray])
    setFilesDetailsAfterUpload([...array]);
    if (!filesArray.length) {
      setActiveStep(4, false);
    }
  }


  const [activeStepsArray, setActiveStepsArray] = useState([false, false, false, false]);
  const setActiveStep = (data: number, value = true) => {

    let arr = [...activeStepsArray];
    if (data) {
      arr[data - 1] = value;
    }
    setActiveStepsArray(arr);

    let itemIndex = arr.findIndex((item: boolean) => item == false);

    if (itemIndex == -1) {
      setActiveStepBasedOnData(4);
    } else {
      setActiveStepBasedOnData(itemIndex);
    }

  }

  const captureDates = (fromDate: string, toDate: string) => {
    setDates([fromDate, toDate]);
  };

  const captureCategoriesArray = (categories: any) => {
    setCategoryList(categories)
  }

  return (
    <div className={styles.form}>

      <div>
        <Header setFormDetails={setFormDetails} errorMessages={errorMessages} />
        <div className={styles.secondaryFormField}>
          <ProgressSteps activeStepsArray={activeStepsArray} activeStepBasedOnData={activeStepBasedOnData} />
          <Form
            loadAttachments={loadAttachments}
            deleteSelectedFile={deleteSelectedFile}
            setActiveStepBasedOnData={setActiveStep}
            setWorkType={setWorkType}
            captureDates={captureDates}
            setResources={setResources}
            setAdditionalResources={setAdditionalResources}
            onChangeFile={onChangeFile}
            files={files}
            uploadButtonLoading={uploadButtonLoading}
            uploadFailed={uploadFailed}
            errorMessages={errorMessages}
            captureCategoriesArray={captureCategoriesArray}
            uploadFailedMessage={uploadFailedMessage}

          />

        </div>
        <FooterActionButtons addLogs={addLogs} />
      </div>


      <AlertComponent alertMessage={alertMessage} alertType={alertType} setAlertMessage={setAlertMessage} />
      <LoadingComponent loading={loading} />
    </div>
  );
};

export default AddALog;
