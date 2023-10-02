import { Breadcrumbs, Card, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Gallery } from "react-grid-gallery";
import styles from "./crop-card.module.css";
import Header1 from "../Header/HeaderComponent";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import timePipe from "@/pipes/timePipe";
import { ScoutAttachmentDetails } from "@/types/scoutTypes";
import LoadingComponent from "@/components/Core/LoadingComponent";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Image } from "react-grid-gallery";
import VideoDialog from "@/components/Core/VideoDiloag";

const SingleViewScoutComponent = () => {

    const router = useRouter();
    const [data, setData] = useState<any>()
    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);
    const farmTitle = useSelector((state: any) => state?.farms?.cropName);
    const [selectedFile, setSelectedFile] = useState<any>([])
    const [index, setIndex] = useState<any>()

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (router.query.farm_id && router.isReady && router.query?.crop_id && accessToken) {
            getPresingedURls()
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
        let obj = item?.attachments?.slice(0, 4)?.map((imageObj: any, index: number) => {

            if (imageObj.type.slice(0, 4) == "vide") {
                return {
                    src: "/videoimg.png",
                    original: imageObj.url,
                    height: 80,
                    width: 60,
                    // customOverlay: <div style={{color:"white"}}>Yes</div>

                    alt: "u",
                    customOverlay: (
                        <div className="custom-overlay__caption">
                            <div>{imageObj.name}</div>
                        </div>
                    ),
                }
            }
            else
                return {
                    src: imageObj.url,
                    height: 80,
                    width: 60,
                    alt: "u"


                }
        });

        return obj
    }

    const slidesEvent = (item: any) => {
        if (item?.attachments) {
            return item.attachments.map((imageObj: any, index: number) => {
                return {
                    src: imageObj.url || '', // Ensure 'url' property is defined
                    original: imageObj.url || '', // Ensure 'url' property is defined
                    height: 900,
                    width: 1000,
                    alt: "u"
                };
            });
        }

    };

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
        setIndex(item.src == "/videoimg.png" ? item.original : item.src)
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
                                <Gallery images={getModifiedImage(item)} onClick={handleClick}
                                />

                            </>
                            :
                            // getModifiedImage(item)
                            <div style={{ color: "#c1c1c1", padding: "10px 0px 10px 10px", display: "flex", justifyContent: "center" }}>
                                {"No Attachments"}
                            </div>}

                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                            <Typography variant="caption" sx={{ cursor: "pointer" }} onClick={() => router.push(`/farms/${router.query.farm_id}/crops/${router.query.crop_id}/scouting/${item._id}`)}
                            >View more</Typography>
                        </div>
                    </Card>
                )
            }) :
                (!loading ?
                    <div id={styles.noData} style={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "3rem" }}>
                        {/* <ImageComponent src='/no-crops-data.svg' height={200} width={200} alt={'no-crops'} /> */}
                        <Typography variant="h4">No Scouts</Typography>
                    </div>
                    : "")}
            <LoadingComponent loading={loading} />
            <VideoDialog open={openDialog} onClose={handleCloseDialog} mediaArray={selectedFile} index={index} />


            <div className="addFormPositionIcon">
                <img src="/add-plus-icon.svg" alt="" onClick={() => router.push(`/farms/${router?.query.farm_id}/crops/add-item?crop_id=${router.query.crop_id}`)} />
            </div>
        </div>

    )
}
export default SingleViewScoutComponent;