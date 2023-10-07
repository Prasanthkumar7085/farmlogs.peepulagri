import { Breadcrumbs, Card, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Gallery } from "react-grid-gallery";
import styles from "./crop-card.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import timePipe from "@/pipes/timePipe";
import LoadingComponent from "@/components/Core/LoadingComponent";
import "yet-another-react-lightbox/styles.css";
import VideoDialog from "@/components/Core/VideoDiloag";
import ViewSingleImagePreview from "@/components/ViewSingleImagePreview";
import VideoDialogForScout from "@/components/VideoDiloagForSingleScout";
import getSingleScoutService from "../../../../lib/services/ScoutServices/getSingleScoutService";
import { removeTheFilesFromStore } from "@/Redux/Modules/Farms";
import { removeTheAttachementsFilesFromStore } from "@/Redux/Modules/Conversations";

const SingleViewScoutComponent = () => {

    const router = useRouter();
    const dispatch = useDispatch()

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);
    const farmTitle = useSelector((state: any) => state?.farms?.cropName);

    const [data, setData] = useState<any>()
    const [selectedFile, setSelectedFile] = useState<any>([])
    const [index, setIndex] = useState<any>()
    const [image, setImage] = useState();
    const [sildeShowImages, setSlideShowImages] = useState<any>()
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (router.query.farm_id && router.isReady && router.query?.crop_id && accessToken) {
            getPresingedURls()
            dispatch(removeTheFilesFromStore([]));
            dispatch(removeTheAttachementsFilesFromStore([]))

        }
    }, [accessToken, router.isReady,])

    const getPresingedURls = async () => {
        setLoading(true);
        let options = {
            method: "GET",

            headers: new Headers({
                'content-type': 'application/json',
                'authorization': accessToken
            })
        }
        try {
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farm/${router.query.farm_id}/scouts/1/100?crop_id=${router.query?.crop_id}`, options)
            let responseData = await response.json()

            if (responseData.success) {
                setData(responseData.data);
                setSelectedFile(responseData.data)
            }
        }
        catch (err) {
            console.error(err)
        } finally {
            setLoading(false);
        }
    };


    const getModifiedImage = (item: any) => {

        let obj = item?.attachments?.slice(0, 3)?.map((imageObj: any, index: number) => {

            if (imageObj.type.includes("video")) {
                return {
                    src: "/videoimg.png",
                    original: imageObj.url,
                    url: imageObj.url,
                    height: 80,
                    width: 60,
                    type: imageObj.type,
                    id: imageObj._id,
                    scout_id: item._id,
                    alt: "u",
                    tags: (item.attachments?.length > 3 && index == 2) ? [{
                        value: <div id="layer" style={{ width: "100%", backgroundColor: "#0000008f !important" }}
                            onClick={() => router.push(`/farms/${router.query.farm_id}/crops/${router.query.crop_id}/scouting/${item._id}`)}>
                            +{item.attachments?.length - 2}</div>, title: "view_more"
                    }] : []
                }
            }
            else
                return {
                    src: imageObj.url,
                    url: imageObj.url,
                    height: 80,
                    type: imageObj.type,
                    id: imageObj._id,
                    scout_id: item._id,
                    width: 60,
                    alt: "u",
                    tags: (item.attachments?.length > 3 && index == 2) ? [{
                        value: <div id="layer" style={{ width: "100%", backgroundColor: "#0000008f !important" }}
                            onClick={() => router.push(`/farms/${router.query.farm_id}/crops/${router.query.crop_id}/scouting/${item._id}`)}>
                            +{item.attachments?.length - 2}</div>, title: "view_more"
                    }] : []
                }
        });
        return obj;
    }

    const getSingleScout = async (scoutId: any) => {
        const response = await getSingleScoutService(scoutId, accessToken);

        if (response?.success) {
            if (response?.data?.attachments?.length) {
                setSlideShowImages(response?.data?.attachments)
            }
        }
        setLoading(false);
    }


    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setIndex(-1);
    };




    const handleClick = (index: number, item: any) => {
        handleOpenDialog();
        setIndex(index);
        setImage(item);
        getSingleScout(item.scout_id)
    };


    return (
        <div className={styles.scoutingView}>

            <div role="presentation">
                <Breadcrumbs aria-label="breadcrumb" >
                    <Link underline="hover" color="inherit" href="/farms">
                        Dashboard
                    </Link>
                    <Link
                        underline="hover"
                        color="inherit"
                        href={`/farms/${router.query.farm_id}/crops`}
                    >
                        My Crops
                    </Link>
                    <Typography color="text.primary">{farmTitle}</Typography>
                </Breadcrumbs>
            </div>
            {data?.length ? data.map((item: any, index: any) => {
                return (
                    <Card key={index} className={styles.galleryCard} >
                        <Typography>{timePipe(item.createdAt, "DD-MM-YYYY hh.mm a")}</Typography>
                        {item?.attachments?.length ?
                            <>
                                <Gallery images={getModifiedImage(item)} onClick={handleClick} enableImageSelection={false}
                                />

                            </>
                            :
                            // getModifiedImage(item)
                            <div style={{ color: "#c1c1c1", padding: "10px 0px 10px 10px", display: "flex", justifyContent: "center" }}>
                                {"No Attachments"}
                            </div>}

                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                            <Typography variant="caption" sx={{ cursor: "pointer", color: "blue", fontSize: "12px" }} onClick={() => router.push(`/farms/${router.query.farm_id}/crops/${router.query.crop_id}/scouting/${item._id}`)}
                            >View Scout</Typography>
                        </div>
                    </Card>
                )
            }) :
                (!loading ?
                    <div id={styles.noData} style={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "3rem" }}>
                        <Typography variant="h4">No Scouts</Typography>
                    </div>
                    : "")}
            <LoadingComponent loading={loading} />
            <VideoDialogForScout open={openDialog} onClose={handleCloseDialog} mediaArray={sildeShowImages} index={index} />


            <div className="addFormPositionIcon">
                <img src="/add-plus-icon.svg" alt="" onClick={() => router.push(`/farms/${router?.query.farm_id}/crops/add-item?crop_id=${router.query.crop_id}`)} />
            </div>
        </div>

    )
}
export default SingleViewScoutComponent;