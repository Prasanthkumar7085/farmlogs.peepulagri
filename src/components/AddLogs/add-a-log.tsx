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

const AddALog: NextPage = () => {

  const router: any = useRouter();

  const [singleLogDetails, setSingleData] = useState<GetLogByIdResponseDataType | null | undefined>();
  const [loading, setLoading] = useState<boolean>(false);


  const [resources, setResources] = useState([]);
  const [additionalResources, setAdditionalResources] = useState([]);
  const [dates, setDates] = useState<any>([]);
  const [formDetails, setFormDetails] = useState<any>();
  const [workType, setWorkType] = useState(singleLogDetails?.work_type ? singleLogDetails?.work_type : "");
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(false);

  const captureDates = (fromDate: string, toDate: string) => {
    setDates([fromDate, toDate]);
  };



  const fetchSingleLogData = async () => {
    setLoading(true);
    try {
      const response = await getLogByIdService(router.query.log_id);
      if (response.success) {
        setSingleData(response?.data)
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (router.isReady) {
      fetchSingleLogData();
    }
  }, [router.isReady]);

  const addLogs = async () => {
    setLoading(true);

    const { categories, ...rest } = formDetails;
    const obj = {
      ...rest,
      categories: [categories],
      work_type: workType,
      farm_id: router.query.farm_id,
      status: 'ACTIVE',
      from_date_time: dates[0] ? new Date(dates[0]).toISOString() : "",
      to_date_time: dates[1] ? new Date(new Date(new Date(dates[1]).toISOString()).getTime() + 86399999).toISOString() : "",
      resources: resources,
      additional_resources: additionalResources,
      total_machinary_hours: resources.reduce((acc: number, item: any) => (item.type == "Machinary" ? acc + ((+item.quantity) * (+item.total_hours)) : acc + 0), 0),
      total_manual_hours: resources.reduce((acc: number, item: any) => (item.type == "Manual" ? acc + ((+item.quantity) * (+item.total_hours)) : acc + 0), 0)
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

  const [activeStepBasedOnData, setActiveStepBasedOnData] = useState(0);

  return (
    <div className={styles.form}>

        <div>
          <Header setFormDetails={setFormDetails} singleLogDetails={singleLogDetails} />
          <div className={styles.secondaryFormField}>
          <ProgressSteps activeStepBasedOnData={activeStepBasedOnData} />
          <Form setActiveStepBasedOnData={setActiveStepBasedOnData} setWorkType={setWorkType} captureDates={captureDates} setResources={setResources} setAdditionalResources={setAdditionalResources} singleLogDetails={singleLogDetails} />
          </div>
        <FooterActionButtons addLogs={addLogs} singleLogDetails={singleLogDetails} />
      </div> 
      <AlertComponent alertMessage={alertMessage} alertType={alertType} setAlertMessage={setAlertMessage} />
      <LoadingComponent loading={loading} />
    </div>
  );
};

export default AddALog;
