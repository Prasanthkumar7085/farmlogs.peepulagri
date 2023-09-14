import { setSingleFarm } from "@/Redux/Modules/Farms";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from './FarmDetailsCard.module.css'

import { useSelector, useDispatch } from "react-redux";

const FarmDetailsCard = () => {

    const router = useRouter();
    const dispatch = useDispatch();

    const farmDetails = useSelector((state: any) => state.farms?.singleFarm)


    useEffect(() => {
        if (router.query?.farm_id && router.isReady) {
            dispatch(setSingleFarm(router?.query?.farm_id))
        }

    }, [router.query?.farm_id, router.isReady])



    return (
        <div className={styles.FarmDetailsCard}> 
            {farmDetails?.title}
        </div>
    )
}


export default FarmDetailsCard;``