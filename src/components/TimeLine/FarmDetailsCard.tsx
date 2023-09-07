import { setSingleFarm } from "@/Redux/Modules/Farms";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";

const FarmDetailsCard = () => {

    const router = useRouter();
    const dispatch = useDispatch();

    const farmDetails = useSelector((state: any) => state.farms?.singleFarm)
    const [farmName, setFarmName] = useState();


    useEffect(() => {

        if (router.query?.farm_id && router.isReady) {
            dispatch(setSingleFarm(router?.query?.farm_id))
        }

    }, [router.query?.farm_id, router.isReady])

    useEffect(() => {
        setFarmName(farmDetails?.title);
    }, [farmDetails]);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "sticky", top: '0px' }}>

            <div style={{ border: "2px solid #d94841", width: "100px", alignItems: "center", justifyContent: "center", display: "flex", padding: "10px", borderRadius: '10px', }}>
                {farmName}
            </div>
        </div>
    )
}


export default FarmDetailsCard;