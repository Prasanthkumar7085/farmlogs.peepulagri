import type { NextPage } from "next";

import styles from "./../add-a-log.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import getLogByIdService from "../../../../lib/services/LogsService/getLogByIdService";
import ProgressSteps from "../progress-steps";
import Form from "../form";
import FooterActionButtons from "../footer-action-buttons";
import Header from "../header";
import updateLogService from "../../../../lib/services/LogsService/updateLogService";
import AlertComponent from "@/components/Core/AlertComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import addLogsAttachmentService from "../../../../lib/services/LogsService/addLogsAttachmentService";
import uploadFileToS3 from "../../../../lib/services/LogsService/uploadFileToS3InLog";
import { useSelector } from "react-redux";

const EditALog: NextPage = () => {

    const router: any = useRouter();

    const [singleLogDetails, setSingleLogDetails] = useState<any>();
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

    const [uploadButtonLoading, setUploadButtonLoading] = useState(false);
    const [uploadFailed, setUploadFailed] = useState(false);

    const [activeStepBasedOnData, setActiveStepBasedOnData] = useState(0);

    const captureDates = (fromDate: string, toDate: string) => {
        setDates([fromDate, toDate]);
    }


    useEffect(() => {
        setResources(singleLogDetails?.resources)
    }, [singleLogDetails])
    const fetchSingleLogData = async () => {
        setLoading(true);
        try {
            const response = await getLogByIdService(router.query.log_id);
            if (response.success) {
                setSingleLogDetails(response?.data)
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



    const getTotalHours = (type: string) => {

        let result = resources.reduce((acc: number, item: any) => (item.type?.toLowerCase() == type.toLowerCase() ? acc + ((+item.quantity) * (+item.total_hours)) : acc + 0), 0)

        return result;
    }
    const editLog = async () => {

        setLoading(true);
        const { categories, title, description } = formDetails;

        const obj = {
            title: title ? title : singleLogDetails?.title,
            description: description ? description : singleLogDetails?.description,
            categories: categories,
            work_type: workType ? workType : singleLogDetails?.work_type,
            farm_id: router.query.farm_id,
            status: 'ACTIVE',
            from_date_time: dates[0] ? new Date(dates[0]).toISOString() : singleLogDetails?.from_date_time,
            to_date_time: dates[1] ? new Date(new Date(new Date(dates[1]).toISOString()).getTime() + 86399999).toISOString() : singleLogDetails?.to_date_time,
            resources: resources.length ? resources : singleLogDetails?.resources,
            additional_resources: additionalResources.length ? additionalResources : singleLogDetails?.additional_resources,
            total_machinary_hours: getTotalHours("Machinery"),
            total_manual_hours: getTotalHours("Manual"),
            // attachments: filesDetailsAfterUpload.length ? filesDetailsAfterUpload : singleLogDetails?.attachments,
            attachments: [...filesDetailsAfterUpload, ...singleLogDetails?.attachments]
        }
        try {
            const response = await updateLogService(obj, router.query.log_id);
            if (response.success) {
                setAlertMessage('Log Updated Successfully!');
                setAlertType(true);
                setTimeout(() => router.back(), 1000)
            } else {
                setAlertMessage('Failed to Update Log!');
                setAlertType(false);
            }

        }
        catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }





    const onChangeFile = (e: any) => {

        setFiles(e.target.files);
    }
    const uploadFiles = async () => {
        setUploadButtonLoading(true)
        let tempFilesStorage = Array.from(files).map((item: any) => { return { original_name: item.name, type: item.type, size: item.size } });

        const response = await addLogsAttachmentService({ attachments: tempFilesStorage }, accessToken);
        if (response.success) {
            await postAllImages(response.data, tempFilesStorage);
        } else {
            setUploadFailed(true);
        }
        setUploadButtonLoading(false);
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
                break;
            }
        }
        setFilesDetailsAfterUpload(arrayForResponse);


    }

    return (
        <div className={styles.form}>
            {router.query.log_id && singleLogDetails ?
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
                            uploadButtonLoading={uploadButtonLoading}
                            uploadFailed={uploadFailed}
                        />
                    </div>
                    <FooterActionButtons editLog={editLog} singleLogDetails={singleLogDetails} />
                </div> : ""}

            <AlertComponent alertMessage={alertMessage} alertType={alertType} setAlertMessage={setAlertMessage} />
            <LoadingComponent loading={loading} />
        </div>
    );
};

export default EditALog;
