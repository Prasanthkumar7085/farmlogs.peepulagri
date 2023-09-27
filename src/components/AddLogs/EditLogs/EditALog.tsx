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

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

    const [singleLogDetails, setSingleLogDetails] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [categoriesList, setCategoryList] = useState([])
    const [resources, setResources] = useState([]);
    const [additionalResources, setAdditionalResources] = useState([]);
    const [dates, setDates] = useState<any>([]);
    const [formDetails, setFormDetails] = useState<any>();
    const [workType, setWorkType] = useState("");
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(false);
    const [loadAttachments, setLoadAttachments] = useState(true);
    const [uploadFailedMessage, setUploadFailedMessage] = useState('');



    const [files, setFiles] = useState<any>([]);
    const [filesDetailsAfterUpload, setFilesDetailsAfterUpload] = useState<any>([]);

    const [uploadButtonLoading, setUploadButtonLoading] = useState(false);
    const [uploadFailed, setUploadFailed] = useState(false);

    const [activeStepBasedOnData, setActiveStepBasedOnData] = useState(0);
    const [errorMessages, setErrorMessages] = useState<any>();

    const captureDates = (fromDate: string, toDate: string) => {
        setDates([fromDate, toDate]);
    }

    const captureCategoriesArray = (categories: any) => {
        setCategoryList(categories)
    }

    useEffect(() => {
        setResources(singleLogDetails?.resources);

        setFormDetails({
            title: singleLogDetails?.title,
            description: singleLogDetails?.description,
            categories: singleLogDetails?.categories,
        })
        setWorkType(singleLogDetails?.work_type);
        setDates([singleLogDetails?.from_date_time, singleLogDetails?.to_date_time]);
        setResources(singleLogDetails?.resources);
        setAdditionalResources(singleLogDetails?.additional_resources);
        captureCategoriesArray(singleLogDetails?.categories);
    }, [singleLogDetails]);

    const fetchSingleLogData = async () => {
        setLoading(true);
        try {
            const response = await getLogByIdService(router.query.log_id);
            if (response?.success) {
                setSingleLogDetails(response?.data);
                setActiveStepsFromResponse(response?.data);
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
        setErrorMessages({});
        setLoading(true);
        const { title, description } = formDetails;

        const fromDate = dates[0]?.slice(0, 10);
        const toDate = dates[1]?.slice(0, 10);
        const obj = {
            title: title,
            description: description,
            categories: categoriesList,
            work_type: workType,
            farm_id: router.query.farm_id,
            status: 'ACTIVE',
            from_date_time: fromDate ? new Date(fromDate).toISOString() : '',
            to_date_time: toDate ? new Date(new Date(new Date(toDate)?.toISOString()).getTime() + 86399999).toISOString() : '',
            resources: resources.length ? resources : [],
            additional_resources: additionalResources.length ? additionalResources : [],
            total_machinary_hours: getTotalHours("Machinery"),
            total_manual_hours: getTotalHours("Manual"),

            attachments: [...filesDetailsAfterUpload, ...singleLogDetails?.attachments]
        }
        try {
            const response = await updateLogService(obj, router.query.log_id);
            if (response?.success) {
                setAlertMessage('Log Updated Successfully!');
                setAlertType(true);
                setTimeout(() => router.back(), 1000)
            } else if (response?.status == 422) {
                setErrorMessages(response?.errors);
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


    const onChangeFile = async (e: any) => {
        setLoadAttachments(false);
        setTimeout(() => {
            setLoadAttachments(true);
        }, 1);
        setFiles(e.target.files);
        await uploadFiles(e.target.files)
    }
    const uploadFiles = async (filesSelected: any) => {
        setUploadButtonLoading(true)
        let tempFilesStorage = Array.from(filesSelected).map((item: any) => { return { original_name: item.name, type: item.type, size: item.size } });

        const response = await addLogsAttachmentService({ attachments: tempFilesStorage }, accessToken);
        if (response?.success) {
            await postAllImages(response?.data, tempFilesStorage, filesSelected);
        } else {
            setFiles([]);
            setUploadFailedMessage(response?.message);
            setUploadFailed(true);
            setAlertMessage('File(s) upload failed!');
            setUploadFailed(true);
        }
        setUploadButtonLoading(false);
    }

    const postAllImages = async (response: any, tempFilesStorage: any, filesSelected: any) => {
        let arrayForResponse: any = [];

        for (let index = 0; index < response?.length; index++) {

            let uploadResponse: any = await uploadFileToS3(response[index].target_url, filesSelected[index]);

            if (uploadResponse?.ok) {
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
                break;
            }
        }
        setFilesDetailsAfterUpload(arrayForResponse);


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

    const setActiveStepsFromResponse = (data: any) => {

        if (data) {
            if (!data?.additional_resources.length) {
                setActiveStep(3, false);
                return
            } else if (!data?.attachments.length) {
                setActiveStep(4, false);
                return
            } else {
                setActiveStep(2)
            }
        }
    }

    const [activeStepsArray, setActiveStepsArray] = useState([true, true, true, false]);

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

    return (
        <div className={styles.form}>
            {router.query.log_id && singleLogDetails ?
                <div>
                    <Header setFormDetails={setFormDetails} singleLogDetails={singleLogDetails} errorMessages={errorMessages} />
                    <div className={styles.secondaryFormField}>
                        <ProgressSteps activeStepBasedOnData={activeStepBasedOnData} activeStepsArray={activeStepsArray} />
                        <Form
                            loadAttachments={loadAttachments}
                            deleteSelectedFile={deleteSelectedFile}
                            setActiveStepBasedOnData={setActiveStep}
                            setWorkType={setWorkType}
                            captureDates={captureDates}
                            setResources={setResources}
                            captureCategoriesArray={captureCategoriesArray}
                            setAdditionalResources={setAdditionalResources}
                            singleLogDetails={singleLogDetails}
                            onChangeFile={onChangeFile}
                            files={files}
                            uploadButtonLoading={uploadButtonLoading}
                            uploadFailed={uploadFailed}
                            errorMessages={errorMessages}
                            uploadFailedMessage={uploadFailedMessage}
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
