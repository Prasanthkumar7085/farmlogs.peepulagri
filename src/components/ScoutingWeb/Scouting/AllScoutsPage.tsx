import ScoutsNavBarWeb from "./ScoutsHeader";
import styles from "../farms/FarmsNavBar.module.css"
import ScoutingCardWeb from "./ScoutingCard";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import getAllScoutsService from "../../../../lib/services/ScoutServices/getAllScoutsService";
import { useSelector } from "react-redux";
import LoadingComponent from "@/components/Core/LoadingComponent";
import Image from "next/image";
const AllScoutsWebPage = () => {

    const router = useRouter();

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAllScouts = async () => {
        setLoading(true)
        const response = await getAllScoutsService(router.query.farm_id as string, router.query.crop_id as string, accessToken);
        if (response.success) {
            console.log(response);

            setData(response?.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (router.isReady && accessToken) {
            getAllScouts();
        }
    }, [router.isReady, accessToken]);

    return (
        <div className={styles.AllFarmsPageWeb} style={{ paddingTop: "1rem !important" }}>
            <ScoutsNavBarWeb />
            <div className={styles.allFarms} >
                {data.length ?
                    <div className={styles.allScoutingCards}>
                        {data.map((item: any, index: number) => {
                            return (
                                <ScoutingCardWeb key={index} item={item} />
                            )
                        })}
                    </div>
                    : (!loading ? <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <Image src="/emty-folder-image.svg" alt="empty folder" width={350} height={300} />
                        <p style={{ margin: "0" }}>No Scoutings for this crop</p>
                    </div> : "")}
            </div>


            <LoadingComponent loading={loading} />
        </div>
    );
}

export default AllScoutsWebPage;