import { Breadcrumbs, Card, IconButton, Link, Typography } from "@mui/material";
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
import Image from "next/image";
import moment from "moment";
import CommentIcon from '@mui/icons-material/Comment';
import DrawerComponentForScout from "../Comments/DrawerBoxForScout";





const SingleViewScoutComponent = () => {

    const router = useRouter();
    const dispatch = useDispatch()

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);
    const farmTitle = useSelector((state: any) => state?.farms?.cropName);

    const [data, setData] = useState<any>()
    const [selectedFile, setSelectedFile] = useState<any>([])
    const [index, setIndex] = useState<any>()
    const [scoutData, setScoutData] = useState();
    const [sildeShowImages, setSlideShowImages] = useState<any>()
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState<any>(false)
    const [scoutId, setScoutId] = useState<any>()

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
                setSelectedFile(responseData.data)
                // Create an object to store grouped data
                const groupedData: any = {};

                // Iterate through yourData and group objects by createdAt date
                responseData.data.forEach((item: any) => {
                    const createdAt = timePipe(item.createdAt, "DD-MM-YYYY")

                    if (!groupedData[createdAt]) {
                        groupedData[createdAt] = [item];
                    } else {
                        groupedData[createdAt].push(item);
                    }
                });

                // Convert the groupedData object into an array
                const groupedArray = Object.values(groupedData);
                setData(groupedArray);
                console.log(groupedArray)






            }
        }
        catch (err) {
            console.error(err)
        } finally {
            setLoading(false);
        }
    };



    const getModifiedImage = (item: any) => {

        let obj = item?.attachments?.map((imageObj: any, index: number) => {

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
                }
            }
            else if (imageObj.type.includes("application")) {
                return {
                    src: "/pdf-icon.png",
                    original: imageObj.url,
                    url: imageObj.url,
                    height: 80,
                    width: 60,
                    type: imageObj.type,
                    id: imageObj._id,
                    scout_id: item._id,
                    alt: "u"
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

                }
        });
        return obj;
    }

    const getSingleScout = async (scoutId: any) => {
        const response = await getSingleScoutService(scoutId, accessToken);

        if (response?.success) {
            if (response?.data?.attachments?.length) {
                setSlideShowImages(response?.data?.attachments)
                setScoutData(response?.data);

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
        getSingleScout(item.scout_id)
    };

    const drawerClose = (value: any) => {
        console.log(value)
        if (value == false) {
            setDrawerOpen(false)
        }
    }

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
                        <Typography>{timePipe(item[0].createdAt, "DD-MM-YYYY")}</Typography>
                        <div style={{ marginTop: "20px" }}>
                            {item.map((row: any, rowIndex: any) => {

                                return (
                                    <div key={rowIndex} style={{ marginTop: "20px" }}>
                                        <Typography>{timePipe(row.createdAt, "hh.mm a")}</Typography>
                                        <Typography variant="caption">{row.description?.length > 50 ? row.description.slice(0, 100) + "... read more" : row.description}</Typography>

                                        <Gallery images={getModifiedImage(row)} onClick={handleClick} enableImageSelection={false}
                                        />
                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                                            <IconButton onClick={() => {
                                                setDrawerOpen(true)
                                                setScoutId(row._id)
                                                router.push({
                                                    pathname: `/farms/${router.query.farm_id}/crops/${router.query.crop_id}`,
                                                    query: { "scout_id": row._id }
                                                })
                                            }}><CommentIcon /></IconButton>
                                            <Typography variant="caption" sx={{ cursor: "pointer", color: "blue", fontSize: "12px" }} onClick={() => router.push(`/farms/${router.query.farm_id}/crops/${router.query.crop_id}/scouting/${row._id}`)}
                                            >View Scout</Typography>
                                        </div>
                                    </div>
                                )
                            })}

                        </div>
                    </Card>
                )
            }) :
                (!loading ?
                    <div id={styles.noData} style={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "4rem" }}>
                        <Image src="/emty-folder-image.svg" alt="empty folder" width={250} height={150} />
                        <Typography variant="h4">No Scoutings for this crop</Typography>
                    </div>
                    : "")}
            <LoadingComponent loading={loading} />
            <VideoDialogForScout open={openDialog} onClose={handleCloseDialog} mediaArray={sildeShowImages} index={index} data={scoutData} />
            {drawerOpen == true ?
                <DrawerComponentForScout drawerClose={drawerClose} scoutId={scoutId} />
                : ""}

            <div className="addFormPositionIcon">
                <img src="/add-plus-icon.svg" alt="" onClick={() => router.push(`/farms/${router?.query.farm_id}/crops/add-item?crop_id=${router.query.crop_id}`)} />
            </div>
        </div>

    )
}
export default SingleViewScoutComponent;