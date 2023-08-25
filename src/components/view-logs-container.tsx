import type { NextPage } from "next";
import HeadPart from "./AddLogs/head-part";
import MachineryManualCard from "./AddLogs/machinery-manual-card";
import styles from "./view-logs-container.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import getLogByIdService from "../../lib/services/LogsService/getLogByIdService";
import { GetLogByIdResponseDataType } from "@/types/logsTypes";
import LoadingComponent from "./Core/LoadingComponent";

const ViewLogsContainer: NextPage = () => {

  const router: any = useRouter();

  const [data, setData] = useState<GetLogByIdResponseDataType | null | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSingleLogData = async () => {
    setLoading(true);
    try {
      const response = await getLogByIdService(router.query.log_id);
      if (response.success) {
        setData(response?.data)
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


  return (
    <div className={styles.viewLogsContainer}>
      <HeadPart data={data} />
      <MachineryManualCard data={data} />

      <LoadingComponent loading={loading} />
    </div>
  );
};

export default ViewLogsContainer;
