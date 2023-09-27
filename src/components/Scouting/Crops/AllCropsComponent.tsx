import SelectComponenentForLogs from "@/components/Core/SelectComponrntForLogs";
import Header1 from "../Header/HeaderComponent";
import CropCard from "./CropCard";
import { useEffect, useState } from "react";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsService";
import { useSelector } from "react-redux";
import SelectComponenentForFarms from "@/components/Core/selectDropDownForFarms";
import { useRouter } from "next/router";

const AllCropsComponent = () => {

    const [defaultValue, setDefaultValue] = useState<any>('');
    const [formId, setFormId] = useState<any>()
    const [formOptions, setFarmOptions] = useState<any>()
    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);
    const router = useRouter();
    const getFormDetails = async (id: string) => {
        let response = await getAllFarmsService(accessToken);

        try {
            if (response?.success && response.data.length) {
                setFarmOptions(response?.data);
                // if (id) {
                //     let selectedObject = response?.data?.length && response?.data.find((item: any) => item._id == id);

                //     setDefaultValue(selectedObject.title)
                //     captureFarmName(selectedObject);
                // } else {
                //     setDefaultValue(response?.data[0].title);
                //     captureFarmName(response?.data[0]);
                // }
            } else {
                setFarmOptions([]);
            }
        } catch (err) {
            console.error(err);

        }
    }

    //useEffect 
    useEffect(() => {
        getFormDetails("")
    }, [accessToken])

    const captureFarmName = (selectedObject: any) => {


        if (selectedObject && Object.keys(selectedObject).length) {
            setFormId(selectedObject?._id);
        }
    }

    return (
        <div>
            <Header1 name={"My Crops"} />
            <div style={{ padding: "1rem" }}>
                <SelectComponenentForFarms setDefaultValue={setDefaultValue} defaultValue={defaultValue} options={formOptions} captureFarmName={captureFarmName} />
            </div>
            <CropCard />
            <div className="addFormPositionIcon" >
                <img src="/add-form-icon.svg" alt="" onClick={() => router.push("/farms/add")} />
            </div>
        </div>
    )
}
export default AllCropsComponent;