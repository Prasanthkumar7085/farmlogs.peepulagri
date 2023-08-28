import type { NextPage } from "next";

import styles from "./../add-a-log.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { GetLogByIdResponseDataType } from "@/types/logsTypes";
import getLogByIdService from "../../../../lib/services/LogsService/getLogByIdService";
import ProgressSteps from "../progress-steps";
import Form from "../form";
import FooterActionButtons from "../footer-action-buttons";
import Header from "../header";

const EditALog: NextPage = () => {

    const router: any = useRouter();

    const [singleLogDetails, setSingleData] = useState<GetLogByIdResponseDataType | null | undefined>();
    const [loading, setLoading] = useState<boolean>(false);


    const [resources, setResources] = useState([]);
    const [additionalResources, setAdditionalResources] = useState([]);
    const [dates, setDates] = useState<any>([]);
    const [formDetails, setFormDetails] = useState<any>();
    const [workType, setWorkType] = useState(singleLogDetails?.work_type ? singleLogDetails?.work_type : "");

    const captureDates = (fromDate: string, toDate: string) => {
        setDates([fromDate, toDate]);
    }


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

    // const addLogs = async (data: any) => {
    //     const { categories, ...rest } = formDetails;
    //     const obj = {
    //         ...rest,
    //         categories: [categories],
    //         work_type: workType,
    //         farm_id: router.query.farm_id,
    //         status: 'ACTIVE',
    //         from_date_time: dates[0] ? new Date(dates[0]).toISOString() : "",
    //         to_date_time: dates[1] ? new Date(new Date(new Date(dates[1]).toISOString()).getTime() + 86399999).toISOString() : "",
    //         resources: resources,
    //         additional_resources: additionalResources,
    //         total_machinary_hours: resources.reduce((acc: number, item: any) => (item.type == "Machinary" ? acc + ((+item.quantity) * (+item.total_hours)) : acc + 0), 0),
    //         total_manual_hours: resources.reduce((acc: number, item: any) => (item.type == "Manual" ? acc + ((+item.quantity) * (+item.total_hours)) : acc + 0), 0)
    //     }
    //     try {
    //         let response = await addLogService(obj);
    //     } catch (err: any) {
    //         console.error(err);
    //     }
    // }

    const editLog = async () => {
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
            const url = `${process.env.NEXT_PUBLIC_API_URL}/log/${router?.query?.log_id}`;
            const options = {
                method: "PATCH",
                body: JSON.stringify({ ...obj, farm_id: router?.query?.farm_id }),
                headers: new Headers({
                    'content-type': 'application/json'
                })
            }
            const response: any = await fetch(url, options);
            const responseData = await response.json();
            if (response.ok) {
                return responseData;
            } else {
                return { message: 'Something Went Wrong', status: 500, details: responseData }
            }

        }
        catch (err: any) {
            console.error(err);
        }
    }


    const [activeStepBasedOnData, setActiveStepBasedOnData] = useState(0);
    const setActiveStep = () => {
        activeStepBasedOnData
    }
    return (
        <div className={styles.form}>
            {router.query.log_id && singleLogDetails ?
                <div>
                    <Header setFormDetails={setFormDetails} singleLogDetails={singleLogDetails} />
                    <div className={styles.secondaryFormField}>
                        <ProgressSteps activeStepBasedOnData={activeStepBasedOnData} />
                        <Form setWorkType={setWorkType} captureDates={captureDates} setResources={setResources} setAdditionalResources={setAdditionalResources} singleLogDetails={singleLogDetails} />
                    </div>
                    <FooterActionButtons editLog={editLog} singleLogDetails={singleLogDetails} />
                </div> : ""}
        </div>
    );
};

export default EditALog;
