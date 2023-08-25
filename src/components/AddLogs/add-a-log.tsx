import type { NextPage } from "next";
import ProgressSteps from "./progress-steps";
import FooterActionButtons from "./footer-action-buttons";
import styles from "./add-a-log.module.css";
import Header from "./header";
import { useRouter } from "next/router";
import { useState } from "react";
import addLogService from "../../../lib/services/LogsService/addLogService";
import Form from "./form";

const AddALog: NextPage = () => {

  const router = useRouter();

  const [resources, setResources] = useState([]);
  const [additionalResources, setAdditionalResources] = useState([]);
  const [dates, setDates] = useState<any>([]);
  const [formDetails, setFormDetails] = useState<any>();
  const [workType, setWorkType] = useState('');

  const captureDates = (fromDate: string, toDate: string) => {
    setDates([fromDate, toDate]);
  }


  const addLogs = async (data: any) => {


    const obj = {
      ...formDetails,
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
    } catch (err: any) {
      console.error(err);
    }
  }
  return (
    <div className={styles.form}>
      {router.query.farm_id ?
        <div>
          <Header setFormDetails={setFormDetails} />
          <div className={styles.secondaryFormField}>
            <ProgressSteps />
            <Form setWorkType={setWorkType} captureDates={captureDates} setResources={setResources} setAdditionalResources={setAdditionalResources} />
          </div>
          <FooterActionButtons addLogs={addLogs} />
        </div> : ""}
    </div>
  );
};

export default AddALog;
