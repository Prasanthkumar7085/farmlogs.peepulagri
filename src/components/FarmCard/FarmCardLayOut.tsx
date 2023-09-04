import FarmCard from "./FarmCard";
import Image from "next/image";
import { FarmDataType } from "@/types/farmCardTypes";
import { useRouter } from "next/router";
import styles from "./FarmCardLayout.module.css";
import { useEffect, useState } from "react";
import getAllFarmsService from "../../../lib/services/FarmsService/getAllFarmsService";
import { useSelector } from "react-redux";

const FarmCardsLayOut = ({ children }: any) => {

    const router = useRouter();
    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

    const [farmsData, setFarmsData] = useState<any>();

    const getFarmsData = async () => {
        let response: any = await getAllFarmsService(accessToken);
        if (response?.success) {
            setFarmsData(response);
            let { query } = router;
            let { farm_id, ...restQueries } = query
            let id = (router?.query?.farm_id && router?.query?.farm_id != 'farm_id') ? router?.query?.farm_id : response?.data[0]?._id;
            router.push({ pathname: `/farm/${id}/logs`, query: restQueries });
        }
    }

    useEffect(() => {
        if (accessToken) {
            getFarmsData();
        }
    }, [accessToken]);


    return (
        <div className={styles.innerWrapper}>
            <div className={styles.cardContainer}>
                {farmsData?.data?.length && farmsData?.data.map((item: FarmDataType) => {
                    return (
                        <div key={item._id} onClick={() => router.push(`/farm/${item._id}/logs`)} style={{ cursor: "pointer" }}>
                                <FarmCard
                                _id={item._id}
                                progress={70}
                                    acresCount={item?.area}
                                    farmName={item?.title}
                                    createAt={item?.createdAt}
                                logCount={item?.logCount}
                            />

                        </div>
                    )
                })}
            </div>
            <div className={styles.FarmDetails}>
                <Image alt="" src='/image-2@2x.png' className="mapImage" width={1000} height={150} style={{ objectFit: "cover", objectPosition: "center" }} />
                {children}
            </div>
        </div>

    )
}

export default FarmCardsLayOut;