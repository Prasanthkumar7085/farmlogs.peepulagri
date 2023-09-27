import SelectComponenentForLogs from "@/components/Core/SelectComponrntForLogs";
import Header1 from "../Header/HeaderComponent";
import CropCard from "./CropCard";
import { useEffect, useState } from "react";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsService";
import { useSelector } from "react-redux";
import SelectComponenentForFarms from "@/components/Core/selectDropDownForFarms";
import { useRouter } from "next/router";
import { FormControl, FormHelperText, InputLabel } from "@mui/material";
import styles from "../AddItem/add-scout.module.css";

const AllCropsComponent = () => {

    const [defaultValue, setDefaultValue] = useState<any>('');
    const [formId, setFormId] = useState<any>()
    const [formOptions, setFarmOptions] = useState<any>();
    const [selectedCrop, setSelectedCrop] = useState<any>()
    const [cropOptions, setCropOptions] = useState<any>()
    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);
    const router = useRouter();
    const getFormDetails = async (id: any) => {
        let response = await getAllFarmsService(accessToken);

        try {
            if (response?.success && response.data.length) {
                setFarmOptions(response?.data);
                if (id) {
                    let selectedObject = response?.data?.length && response?.data.find((item: any) => item._id == id);

                    setDefaultValue(selectedObject.title)
                    captureFarmName(selectedObject);
                } else {
                    setDefaultValue(response?.data[0].title);
                    captureFarmName(response?.data[0]);
                }
            } else {
                setFarmOptions([]);
            }
        } catch (err) {
            console.error(err);

        }
    }

    //get all crops name
    const getCropsDetails = async (id: string) => {

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
    }

    //useEffect 
    useEffect(() => {
        if (router.query.farm_id) {
            getFormDetails(router.query.farm_id)
        }
    }, [accessToken, router.query.farm_id])

    const captureFarmName = (selectedObject: any) => {
        if (selectedObject && Object.keys(selectedObject).length) {
            setFormId(selectedObject?._id);
            getCropsDetails(selectedObject?._id)

        }
    }

    return (
        <div>
            <Header1 name={"My Crops"} />
            <FormControl
                sx={{ width: "100%" }}
                variant="outlined"
            >
                <InputLabel color="primary" />
                <SelectComponenentForFarms setDefaultValue={setDefaultValue} defaultValue={defaultValue} options={formOptions} captureFarmName={captureFarmName} />
                <FormHelperText />
            </FormControl>
            {cropOptions && cropOptions?.map((item: any, index: any) => (
                <CropCard itemDetails={item} />

            ))}
            <div className="addFormPositionIcon" >
                <img src="/add-form-icon.svg" alt="" onClick={() => router.push(`/farms/${formId}/crops/add-item`)} />
            </div>
        </div>
    )
}
export default AllCropsComponent;