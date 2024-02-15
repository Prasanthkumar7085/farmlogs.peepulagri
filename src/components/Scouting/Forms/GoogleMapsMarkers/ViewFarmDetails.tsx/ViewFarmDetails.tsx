import { Button, IconButton } from "@mui/material";
import styles from "./viewFarm.module.css";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import timePipe from "@/pipes/timePipe";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { prepareURLEncodedParams } from "../../../../../../lib/requestUtils/urlEncoder";
import getAllCropsService from "../../../../../../lib/services/CropServices/getAllCropsService";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { CropTypeResponse } from "@/types/cropTypes";
import { useRouter } from "next/router";
import LoadingComponent from "@/components/Core/LoadingComponent";
const ViewFarmDetails = ({ setOpenFarmDetails, farmDetails, FarmlocationDetails }: any) => {

    const router = useRouter();
    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );
    const [cropsData, setCropsData] = useState<Array<CropTypeResponse>>([]);
    const [loading, setLoading] = useState(false)

    const getCropsByFarmId = async (
        farmId: string,
    ) => {
        setLoading(true)
        try {
            let queryParamsUrl = "";
            let queryParams: any = {
                sort_by: "createdAt",
                sort_type: "desc",
            };

            if (Object.keys(queryParams).length) {
                queryParamsUrl = prepareURLEncodedParams("", queryParams);
            }
            const response = await getAllCropsService(farmId, queryParamsUrl, accessToken);

            if (response.success) {
                setCropsData(response?.data);
            }
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        if (router.isReady && accessToken) {
            getCropsByFarmId(farmDetails?._id)
        }
    }, [accessToken, farmDetails?._id])

    return (
        <div className={styles.slidebarfarmdetails}>
            <header className={styles.header}>
                <IconButton
                    onClick={() => {
                        setOpenFarmDetails(false)
                    }}
                    sx={{ borderRadius: "0px 0px 0px 0px" }}
                >
                    <ArrowBackIosIcon />
                </IconButton>
                <IconButton
                    className={styles.moreoptionsbutton}
                    sx={{ borderRadius: "0px 0px 0px 0px", width: 24, height: 24 }}
                >
                    <MoreVertIcon />
                </IconButton>
            </header>
            <div className={styles.detailscontainer}>
                <div className={styles.mapandname}>
                    <h2 className={styles.farmname}>{farmDetails?.title}</h2>
                    {/* {cropsData.some((obj: any) => obj.hasOwnProperty('url')) ?
                        <div className={styles.collage} >
                            {cropsData?.map((item, index) => {
                                return (
                                    <img
                                        alt=""
                                        src={item.url}
                                        key={index}
                                    />
                                )
                            })}

                        </div> :
                        <div style={{ height: "100px", display: "flex", justifyContent: "center" }} >
                            <p> No Images are available</p>
                        </div>} */}
                </div>
                <div className={styles.locationdetails}>
                    <img className={styles.locationicon} alt="" src="/location-farm.svg" />
                    <p className={styles.location}>{
                        `Latitude :${FarmlocationDetails?.latlng?.lat}° N, Longitude: ${FarmlocationDetails?.latlng?.lng}° ,${FarmlocationDetails?.locationName}`}
                    </p>
                </div>
                <div className={styles.acresdetails}>
                    <img className={styles.locationicon} alt="" src="/acres.svg" />
                    <p className={styles.acres}>{farmDetails?.area} acres</p>
                </div>
                <div className={styles.createddetails}>
                    <img className={styles.locationicon} alt="" src="/viewTaskIcons/calender-icon.svg" />
                    <p className={styles.acres}>{timePipe(farmDetails?.createdAt, "DD,MMM YYYY")}</p>
                </div>
                <div className={styles.cropsdetails}>
                    <img className={styles.locationicon} alt="" src="/cropsIcons.svg" />
                    <div className={styles.cropcolumn}>
                        <div className={styles.overallcount}>
                            <h3 className={styles.crops245ac}>
                                <span>{`Crops `}</span>
                                {/* <span className={styles.ac}>(24.5ac)</span> */}
                            </h3>
                        </div>
                        {cropsData?.length ?
                            <div className={styles.detailedcountcountainer}>
                                {cropsData?.map((crop, index) => {
                                    return (
                                        <div className={styles.cropindetail} key={index}>
                                            <h3 className={styles.cropname}>{crop.title}</h3>
                                            <p className={styles.acresoccupied}>({crop.area}ac),</p>
                                        </div>
                                    )
                                })}


                            </div> :
                            <div className={styles.detailedcountcountainer}>
                                No Crops found for this Farm
                            </div>
                        }

                    </div>
                </div>
                <div className={styles.buttoncontainer}
                    onClick={() => {
                        router.push(`/scouts?include=tags&page=1&limit=50&farm_id=${farmDetails?._id}`)
                    }}>
                    <div className={styles.viewscoutingbutton}>
                        <div className={styles.actionname}>
                            <p className={styles.viewScouting}>View Scouting</p>
                            <ArrowForwardIcon />
                        </div>
                    </div>
                </div>
            </div>
            <LoadingComponent loading={loading} />
        </div>
    )
}
export default ViewFarmDetails;