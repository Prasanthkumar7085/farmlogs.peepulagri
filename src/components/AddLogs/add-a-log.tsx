import type { NextPage } from "next";
import ProgressSteps from "./progress-steps";
import Form from "./form";
import FooterActionButtons from "./footer-action-buttons";
import styles from "./add-a-log.module.css";
import Header from "./header";
import { useForm, SubmitHandler } from "react-hook-form"
import { useRouter } from "next/router";
import { useState } from "react";
import addLog from "../../../lib/services/LogsService/addLog";

const AddALog: NextPage = () => {

  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [resources, setResources] = useState([]);
  const [additionalResources, setAdditionalResources] = useState([]);
  const [dates, setDates] = useState<any>([]);

  const captureDates = (fromDate: string, toDate: string) => {
    setDates([fromDate, toDate]);

  }
  const addLogs = async (data: any) => {

    const { date, ...rest } = data;

    const obj = {
      ...rest,
      farm_id: router.query.farm_id,
      status: 'ACTIVE',
      total_machinary_hours: 10,
      total_manual_hours: 20,
      from_date_time: new Date(dates[0]).toISOString(),
      to_date_time: new Date(new Date(new Date(dates[1]).toISOString()).getTime() + 86399999).toISOString(),
      resources: resources,
      additional_resources: additionalResources
    }
    console.log(obj);

    try {
      let response = addLog(obj);
    } catch (err: any) {
      console.error(err);

    }
  }
  return (
    <div className={styles.form}>
      {router.query.farm_id ? <form onSubmit={handleSubmit(addLogs)}>
        <Header register={register} />
        <div className={styles.secondaryFormField}>
          <ProgressSteps />
          <Form captureDates={captureDates} register={register} setResources={setResources} setAdditionalResources={setAdditionalResources} />
        </div>
        <FooterActionButtons />
      </form> : ""}
    </div>
  );
};

export default AddALog;
