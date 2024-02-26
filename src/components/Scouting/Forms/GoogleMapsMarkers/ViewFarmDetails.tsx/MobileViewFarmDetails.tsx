import { Button, Drawer, IconButton } from "@mui/material";
import styles from "./viewFarm.module.css";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import timePipe from "@/pipes/timePipe";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { prepareURLEncodedParams } from "../../../../../../lib/requestUtils/urlEncoder";
import getAllCropsService from "../../../../../../lib/services/CropServices/getAllCropsService";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { CropTypeResponse } from "@/types/cropTypes";
import { useRouter } from "next/router";
import LoadingComponent from "@/components/Core/LoadingComponent";
import Image from "next/image";
const MobileViewFarmDetails = ({ setOpenFarmDetails,
    farmDetails,
    FarmlocationDetails,
    setSelectedPolygon,
    setMap,
    getFarmOptions,
    selectedPolygonOpen,
    setSelectedPolygonOpen }: any) => {

    const router = useRouter();
    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );
    const [cropsData, setCropsData] = useState<Array<CropTypeResponse>>([]);
    const [loading, setLoading] = useState(false)
    const [statsData, setStatsData] = useState<any>([]);



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



    //get the stats count of farm
    const getStatsCount = async () => {
        setLoading(true);
        try {
            let urls = [
                `${process.env.NEXT_PUBLIC_API_URL}/farms/${farmDetails?._id}/crops-count`,
                `${process.env.NEXT_PUBLIC_API_URL}/farms/${farmDetails?._id}/images-count`,
            ];
            let tempResult: any = [];

            const responses = await Promise.allSettled(
                urls.map(async (url) => {
                    const response = await fetch(url, {
                        method: "GET",
                        headers: new Headers({
                            authorization: accessToken,
                        }),
                    });
                    return response.json();
                })
            );

            responses.forEach((result, num) => {
                if (result.status === "fulfilled") {
                    tempResult.push(result.value);
                }
                if (result.status === "rejected") {
                }
            });
            setStatsData(tempResult);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (router.isReady && accessToken) {
            getCropsByFarmId(farmDetails?._id)
            getStatsCount()
        }
    }, [accessToken, farmDetails?._id])

    return (
        <Drawer open={selectedPolygonOpen ? true : false} anchor="bottom" sx={{
            '& .MuiPaper-root ': {
                borderRadius: "20px 20px 0 0",
                height: "50%"
            }
        }}>
            <div className={styles.slidebarfarmdetails} style={{
                height: "50% !important"
            }}>
                <header className={styles.header}>
                    <IconButton
                        sx={{ padding: "0.2rem" }}
                        onClick={() => {
                            getFarmOptions({
                                search_string: router.query.search_string as string,
                                location: router.query.location_id as string,
                                userId: router.query.user_id as string,
                                page: router.query.page as string,
                                limit: 20,
                                sortBy: router.query.sort_by as string,
                                sortType: router.query.sort_type as string,
                                locationName: router.query.location_name

                            });
                            setOpenFarmDetails(false)
                            setSelectedPolygon(null)
                            setSelectedPolygonOpen(false)

                        }}

                    >
                        <ArrowBackIosIcon sx={{ fontSize: "1.2rem" }} />
                    </IconButton>

                </header>
                <div className={styles.detailscontainer}>
                    <div className={styles.locationDetailsContainer}>

                        <div className={styles.mapandname}>
                            <h2 className={styles.farmname}>{farmDetails?.title}</h2>

                            <div className={styles.overViewBtns}>
                                <div
                                    className={styles.farmOverView}
                                    style={{ background: "#D94841" }}
                                >
                                    <Image src="/mobileIcons/farms/Crop.svg" alt="" width={24} height={24} />
                                    <div className={styles.overViewText}>
                                        <h6>{statsData[0]?.data}</h6>
                                        <span>Crops</span>
                                    </div>
                                </div>
                                <div
                                    className={styles.farmOverView}
                                    style={{ background: "#05A155" }}
                                >
                                    <Image
                                        src="/mobileIcons/farms/image-fill.svg"
                                        alt=""
                                        width={24}
                                        height={24}
                                    />
                                    <div className={styles.overViewText}>
                                        <h6>{statsData[1]?.data}</h6>
                                        <span>Images</span>
                                    </div>
                                </div>
                            </div>

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
                            <Image className={styles.locationicon} alt="" src="/location-farm.svg" width={17} height={17} />
                            <p className={styles.location}>{
                                `Latitude :${farmDetails?.geometry?.coordinates?.[0][0] ? farmDetails?.geometry?.coordinates?.[0][0] : "---"}° N, Longitude: ${farmDetails?.geometry?.coordinates?.[0][1] ? farmDetails?.geometry?.coordinates?.[0][1] : "---"}° ,${farmDetails?.location_id?.title ? farmDetails?.location_id?.title : "----"}`}
                            </p>
                        </div>
                        <div className={styles.acresdetails}>
                            <Image className={styles.locationicon} alt="" src="/acres.svg" width={17} height={17} />
                            <p className={styles.acres}>{farmDetails?.area} acres</p>
                        </div>
                        <div className={styles.createddetails}>
                            <Image className={styles.locationicon} alt="" src="/viewTaskIcons/calender-icon.svg" width={17} height={17} />
                            <p className={styles.acres}>{timePipe(farmDetails?.createdAt, "DD,MMM YYYY")}</p>
                        </div>
                    </div>

                    <div className={styles.cropsdetails}>
                        <Image className={styles.locationicon} alt="" src="/cropsIcons.svg" width={17} height={17} />
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
                            router.push(`/farms/${farmDetails?._id}/crops?search_string=${farmDetails?.title}`);
                        }}>
                        <div className={styles.viewscoutingbutton}>
                            <div className={styles.actionname}>
                                <p className={styles.viewScouting}>View Crops</p>
                                <ArrowForwardIcon />
                            </div>
                        </div>
                    </div>
                </div>

                <LoadingComponent loading={loading} />
            </div>
        </Drawer>
    )
}
export default MobileViewFarmDetails;