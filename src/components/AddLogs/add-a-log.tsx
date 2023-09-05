import type { NextPage } from "next";
import ProgressSteps from "./progress-steps";
import FooterActionButtons from "./footer-action-buttons";
import styles from "./add-a-log.module.css";
import Header from "./header";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import addLogService from "../../../lib/services/LogsService/addLogService";
import Form from "./form";
import { GetLogByIdResponseDataType } from "@/types/logsTypes";
import getLogByIdService from "../../../lib/services/LogsService/getLogByIdService";
import LoadingComponent from "../Core/LoadingComponent";
import AlertComponent from "../Core/AlertComponent";
import uploadFileToS3 from "../../../lib/services/LogsService/uploadFileToS3InLog";
import addLogsAttachmentService from "../../../lib/services/LogsService/addLogsAttachmentService";
import { useSelector } from "react-redux";


const AddALog: NextPage = () => {

  const router: any = useRouter();

  const id = router.query?.farm_id;

  const [loading, setLoading] = useState<boolean>(false);

  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

  const [resources, setResources] = useState([]);
  const [additionalResources, setAdditionalResources] = useState([]);
  const [dates, setDates] = useState<any>([]);
  const [formDetails, setFormDetails] = useState<any>();
  const [workType, setWorkType] = useState("");
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(false);

  const [files, setFiles] = useState<any>([]);
  const [filesDetailsAfterUpload, setFilesDetailsAfterUpload] = useState<any>([]);
  const [activeStepBasedOnData, setActiveStepBasedOnData] = useState(0);
  const [uploadButtonLoading, setUploadButtonLoading] = useState(false);
  const [uploadFailed, setUploadFailed] = useState(false);

  const [errorMessages, setErrorMessages] = useState<any>();

  const captureDates = (fromDate: string, toDate: string) => {
    setDates([fromDate, toDate]);
  };

  const addLogs = async () => {
    setLoading(true);
    setErrorMessages({});
    const { categories, ...rest } = formDetails;
    const obj = {
      ...rest,
      categories: categories,
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
        router.back();
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



  const onChangeFile = (e: any) => {
    setUploadFailed(false);
    setFiles(e.target.files);
  }
  const uploadFiles = async () => {
    setUploadButtonLoading(true);
    setUploadFailed(false);
    let tempFilesStorage = Array.from(files).map((item: any) => { return { original_name: item.name, type: item.type, size: item.size } });

    const response = await addLogsAttachmentService({ attachments: tempFilesStorage }, accessToken);
    if (response.success) {
      await postAllImages(response.data, tempFilesStorage);
    } else {
      setUploadFailed(true);
      setUploadButtonLoading(false)
    }

  }

  const postAllImages = async (response: any, tempFilesStorage: any) => {
    let arrayForResponse: any = [];

    for (let index = 0; index < response.length; index++) {
      let uploadResponse: any = await uploadFileToS3(response[index].target_url, files[index]);
      if (uploadResponse.ok) {
        const { target_url, ...rest } = response[index];
        arrayForResponse.push({ ...rest, size: tempFilesStorage[index].size });
        setAlertMessage(`${index + 1} image(s) Uploaded Successfully`);
        setAlertType(true);
      } else {
        setUploadFailed(true);
        setAlertMessage('Upload Failed!');
        setAlertType(false);
      }
    }
    setFilesDetailsAfterUpload(arrayForResponse);
    setUploadButtonLoading(false);
  }


  return (
    <div className={styles.form}>

        <div>
        <Header setFormDetails={setFormDetails} errorMessages={errorMessages} />
          <div className={styles.secondaryFormField}>
          <ProgressSteps activeStepBasedOnData={activeStepBasedOnData} />
          <Form
            setActiveStepBasedOnData={setActiveStepBasedOnData}
            setWorkType={setWorkType}
            captureDates={captureDates}
            setResources={setResources}
            setAdditionalResources={setAdditionalResources}
            onChangeFile={onChangeFile}
            uploadFiles={uploadFiles}
            files={files}
            uploadButtonLoading={uploadButtonLoading}
            uploadFailed={uploadFailed}
            errorMessages={errorMessages}
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
