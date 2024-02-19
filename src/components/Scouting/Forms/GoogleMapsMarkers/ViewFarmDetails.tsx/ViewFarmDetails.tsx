import { Button, IconButton } from "@mui/material";
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
import deleteFarmService from "../../../../../../lib/services/FarmsService/deleteFarmService";
import { useCookies } from "react-cookie";
import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import { toast } from "sonner";
import AlertDelete from "@/components/Core/DeleteAlert/alert-delete";
import DeleteIcon from '@mui/icons-material/Delete';
const ViewFarmDetails = ({ setOpenFarmDetails,
    farmDetails,
    FarmlocationDetails,
    setSelectedPolygon,
    setMap,
    getFarmOptions }: any) => {

    const router = useRouter();
    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );
    const [cropsData, setCropsData] = useState<Array<CropTypeResponse>>([]);
    const [loading, setLoading] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [, , removeCookie] = useCookies(["userType_v2"]);
    const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);

    const dispatch = useDispatch();

    const logout = async () => {
        try {
            removeCookie("userType_v2");
            loggedIn_v2("loggedIn_v2");
            router.push("/");
            await dispatch(removeUserDetails());
            await dispatch(deleteAllMessages());
        } catch (err: any) {
            console.error(err);
        }
    };


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


    //delete farm
    const deleteFarm = async () => {
        try {
            setLoading(true)
            const response = await deleteFarmService(farmDetails?._id, accessToken);

            if (response.success) {
                setDeleteDialogOpen(false);
                setOpenFarmDetails(false)
                toast.success(response.message)
                getFarmOptions({
                    search_string: router.query.search_string as string,
                    location: router.query.location_id as string,
                    userId: router.query.user_id as string,
                    page: 1,
                    limit: 20,
                    sortBy: router.query.sort_by as string,
                    sortType: router.query.sort_type as string,
                });

            } else if (response?.statusCode == 403) {
                await logout();
            } else {
                toast.error("Something went wrong")
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
                        setSelectedPolygon(null)


                    }}
                    sx={{ borderRadius: "0px 0px 0px 0px" }}
                >
                    <ArrowBackIosIcon />
                </IconButton>
                <IconButton
                    className={styles.moreoptionsbutton}
                    sx={{ borderRadius: "0px 0px 0px 0px", width: 24, height: 24 }}
                    onClick={() => {
                        setDeleteDialogOpen(true)
                    }}
                >
                    <DeleteIcon />
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
                        `Latitude :${farmDetails?.geometry?.coordinates?.[0][0] ? farmDetails?.geometry?.coordinates?.[0][0] : "---"}° N, Longitude: ${farmDetails?.geometry?.coordinates?.[0][1] ? farmDetails?.geometry?.coordinates?.[0][1] : "---"}° ,${farmDetails?.location_id?.title ? farmDetails?.location_id?.title : "----"}`}
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
            <AlertDelete
                deleteFarm={deleteFarm}
                setDialogOpen={setDeleteDialogOpen}
                open={deleteDialogOpen}
                loading={loading}
                deleteTitleProp={"Farm"}
            />
            <LoadingComponent loading={loading} />
        </div>
    )
}
export default ViewFarmDetails;