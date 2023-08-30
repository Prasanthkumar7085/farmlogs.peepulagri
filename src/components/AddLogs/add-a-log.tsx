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

  const [singleLogDetails, setSingleData] = useState<GetLogByIdResponseDataType | null | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const accessToken = useSelector((state: any) => state.auth.userDetails.userDetails?.access_token);

  const [resources, setResources] = useState([]);
  const [additionalResources, setAdditionalResources] = useState([]);
  const [dates, setDates] = useState<any>([]);
  const [formDetails, setFormDetails] = useState<any>();
  const [workType, setWorkType] = useState(singleLogDetails?.work_type ? singleLogDetails?.work_type : "");
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(false);

  const [files, setFiles] = useState<any>([]);
  const [filesDetailsAfterUpload, setFilesDetailsAfterUpload] = useState<any>([]);

  const [activeStepBasedOnData, setActiveStepBasedOnData] = useState(0);

  const captureDates = (fromDate: string, toDate: string) => {
    setDates([fromDate, toDate]);
  };





  const addLogs = async () => {
    setLoading(true);

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
      total_machinary_hours: resources.reduce((acc: number, item: any) => (item.type == "Machinary" ? acc + ((+item.quantity) * (+item.total_hours)) : acc + 0), 0),
      total_manual_hours: resources.reduce((acc: number, item: any) => (item.type == "Manual" ? acc + ((+item.quantity) * (+item.total_hours)) : acc + 0), 0),
      attachments: filesDetailsAfterUpload
    }
    try {
      let response = await addLogService(obj);
      if (response.success) {
        setAlertMessage('Log Added Successfully!');
        setAlertType(true);
        router.back();
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
    setFiles(e.target.files);
  }
  const uploadFiles = async () => {
    let tempFilesStorage = Array.from(files).map((item: any) => { return { original_name: item.name, type: item.type, size: item.size } });

    const response = await addLogsAttachmentService({ attachments: tempFilesStorage }, accessToken);
    if (response.success) {
      await postAllImages(response.data, tempFilesStorage);
    }

  }

  const postAllImages = async (response: any, tempFilesStorage: any) => {
    let arrayForResponse: any = [];

    for (let index = 0; index < response.length; index++) {
      let uploadResponse: any = await uploadFileToS3(response[index].target_url, files[index]);
      if (uploadResponse.ok) {
        const { target_url, ...rest } = response[index];
        arrayForResponse.push({ ...rest, size: tempFilesStorage[index].size });
      }
    }
    setFilesDetailsAfterUpload(arrayForResponse);


  }


  return (
    <div className={styles.form}>

        <div>
          <Header setFormDetails={setFormDetails} singleLogDetails={singleLogDetails} />
          <div className={styles.secondaryFormField}>
          <ProgressSteps activeStepBasedOnData={activeStepBasedOnData} />
          <Form
            setActiveStepBasedOnData={setActiveStepBasedOnData}
            setWorkType={setWorkType}
            captureDates={captureDates}
            setResources={setResources}
            setAdditionalResources={setAdditionalResources}
            singleLogDetails={singleLogDetails}
            onChangeFile={onChangeFile}
            uploadFiles={uploadFiles}
            files={files}
          />

          </div>
        <FooterActionButtons addLogs={addLogs} singleLogDetails={singleLogDetails} />
      </div> 

      
      <AlertComponent alertMessage={alertMessage} alertType={alertType} setAlertMessage={setAlertMessage} />
      <LoadingComponent loading={loading} />
    </div>
  );
};

export default AddALog;
