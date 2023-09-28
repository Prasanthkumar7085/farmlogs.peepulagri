import SelectComponenentForLogs from "@/components/Core/SelectComponrntForLogs";

import { useEffect, useState } from "react";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsService";
import { useDispatch, useSelector } from "react-redux";
import SelectComponenentForFarms from "@/components/Core/selectDropDownForFarms";
import { useRouter } from "next/router";
import { Button, FormControl, FormHelperText, IconButton, InputLabel, Typography } from "@mui/material";
import styles from "./crop-card.module.css";
import Header1 from "../Header/HeaderComponent";
import CropCard from "./CropCard";
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import NewFolderDiloag from "@/components/Core/AddCropalert/AddNewFolder";
import LoadingComponent from "@/components/Core/LoadingComponent";
import AlertComponent from "@/components/Core/AlertComponent";
import SelectAutoCompleteForFarms from "@/components/Core/selectDropDownForFarms";
import ImageComponent from "@/components/Core/ImageComponent";
import { removeTheFilesFromStore } from "@/Redux/Modules/Farms";
const AllCropsComponent = () => {

    const dispatch = useDispatch()
    const [defaultValue, setDefaultValue] = useState<any>('');
    const [formId, setFormId] = useState<any>()
    const [formOptions, setFarmOptions] = useState<any>();
    const [selectedCrop, setSelectedCrop] = useState<any>()
    const [cropOptions, setCropOptions] = useState<any>()
    const [dilogOpen, setDilogOpen] = useState<any>()
    const [loading, setLoading] = useState<any>()
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(false);
    const [loadingForAdd, setLoadingForAdd] = useState<any>()

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);
    const router = useRouter();
    const getFormDetails = async (id: any) => {
        setLoading(true)
        let response = await getAllFarmsService(accessToken);

        try {
            if (response?.success == true && response?.data?.length) {
                setFarmOptions(response?.data);
                if (id) {
                    console.log(id)
                    let selectedObject = response?.data?.length && response?.data?.find((item: any) => item._id == id);
                    console.log(selectedObject)
                    setDefaultValue(selectedObject?.title)
                    captureFarmName(selectedObject);
                } else {
                    setDefaultValue(response?.data[0].title);
                    captureFarmName(response?.data[0]);
                }
            } else {
                setFarmOptions([]);
                setLoading(false)
            }
        } catch (err) {
            console.error(err);
        }

    }

    //get all crops name
    const getCropsDetails = async (id: string) => {
        setLoading(true)

        try {
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farm/${id}/crops/list`, { method: "GET" });
            let responseData: any = await response.json();

            if (responseData.success == true) {
                setCropOptions(responseData?.data);
            } else {
                setCropOptions([]);
            }
        } catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    }


    const [errorMessages, setErrorMessages] = useState([]);
    //create crop api call
    const createCrop = async (value: any) => {
        setLoadingForAdd(true)
        let options = {
            method: "POST",
            body: JSON.stringify({
                "title": value
            }),
            headers: new Headers({
                'content-type': 'application/json',
                'authorization': accessToken
            })
        }
        try {
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farm/${formId}/crops`, options)
            let responseData = await response.json()
            if (responseData.success) {
                await getCropsDetails(formId)
                setDilogOpen(false)
                setAlertMessage(responseData.message)
                setAlertType(true)
            } else if (responseData?.status == 422) {
                setErrorMessages(responseData?.errors);
            }
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setLoadingForAdd(false)

        }
    }

    //useEffect 
    useEffect(() => {
        if (router.isReady && router.query.farm_id && accessToken) {
            getFormDetails(router.query.farm_id)
            dispatch(removeTheFilesFromStore([]));

        }
    }, [accessToken, router.isReady]);

    const captureFarmName = (selectedObject: any) => {
        if (selectedObject && Object.keys(selectedObject).length) {
            setFormId(selectedObject?._id);
            getCropsDetails(selectedObject?._id)
            router.push(`/farms/${selectedObject?._id}/crops`)

        }
    }

    //create new folder (dilog)
    const captureResponseDilog = (value: any) => {
        if (value == false) {
            setDilogOpen(false)
            setErrorMessages([]);
        }
        else {
            setErrorMessages([]);
            createCrop(value)
        }
    }

    return (
        <div className={styles.myCropsPage}>
            <FormControl
                sx={{ width: "100%" }}
                variant="outlined"
            >
                <InputLabel color="primary" />
                <SelectAutoCompleteForFarms options={formOptions} label={"title"} onSelectValueFromDropDown={captureFarmName} placeholder={"Select Farm"} defaultValue={defaultValue} />
                <FormHelperText />
            </FormControl>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                {/* <IconButton>
                    <SortIcon /><Typography variant="caption">Sort By</Typography>
                </IconButton> */}
                <IconButton onClick={() => setDilogOpen(true)}>
                    <AddIcon /><Typography variant="caption">New Folder</Typography>
                </IconButton>
            </div>
            {cropOptions?.length ?
                <div id={styles.allCropCardBlock}>
                    {cropOptions?.map((item: any, index: any) => (
                        <CropCard itemDetails={item} key={index} getCropsDetails={getCropsDetails} />

                    ))}
                </div>
                : (!loading ?
                    <div id={styles.noData} style={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "3rem" }}>
                        {/* <ImageComponent src='/no-crops-data.svg' height={200} width={200} alt={'no-crops'} /> */}
                        <Typography variant="h4">No Crops</Typography>
                    </div>
                    : "")}

            {cropOptions?.length && !loading?<div className="addFormPositionIcon" >
                <img src="/add-plus-icon.svg" alt="" onClick={() => router.push(`/farms/${formId}/crops/add-item`)} />
            </div> : ""}
            
            {dilogOpen ? <NewFolderDiloag
                open={dilogOpen}
                captureResponseDilog={captureResponseDilog}
                loading={loadingForAdd}
                errorMessages={errorMessages}
            /> : ""}
            <AlertComponent alertMessage={alertMessage} alertType={alertType} setAlertMessage={setAlertMessage} mobile={true} />
            <LoadingComponent loading={loading} />
        </div>
    )
}
export default AllCropsComponent;