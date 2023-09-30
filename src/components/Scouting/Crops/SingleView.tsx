import { Breadcrumbs, Card, Link, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Gallery } from "react-grid-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
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
import axios from "axios";
export interface CustomImage extends Image {
    original: string;
}

const SingleViewScoutComponent = () => {

    const router = useRouter();
    const [data, setData] = useState<any>()
    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);
    const farmTitle = useSelector((state: any) => state?.farms?.cropName);

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (router.query.farm_id && router.isReady && router.query?.crop_id && accessToken) {
            getPresingedURls()
        }
    }, [accessToken, router.isReady])

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
            }
        }
        catch (err) {
            console.error(err)
        } finally {
            setLoading(false);
        }
    };

    const generateThumbnailFromUrl = (videoUrl: any) => {
        if (videoUrl) {
            // Create a video element dynamically


            // Ensure metadata is loaded before capturing a frame
            const video = document.createElement('video');
            video.src = videoUrl;
            video.preload = 'auto';

            // Ensure metadata is loaded before capturing a frame
            video.addEventListener('canplay', () => {
                const canvas: any = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

                const thumbnailUrl = canvas?.toDataURL();
                console.log(thumbnailUrl)
                return thumbnailUrl
                video.remove();

            });
        }
    };



    const getModifiedImage = (item: any) => {
        let obj = item?.attachments?.slice(0, 4)?.map((imageObj: any, index: number) => {
            if (index + 1 == 4)
                return {
                    src: imageObj.url,
                    height: 80,
                    width: 60,
                    // customOverlay: <div style={{color:"white"}}>Yes</div>
                    tags: [
                        { value: "View More", title: "view_more" },

                    ],
                    alt: "u"

                }
            if (imageObj.type.slice(0, 4) == "vide") {

                return {
                    src: generateThumbnailFromUrl(imageObj.url),
                    thumbnail: generateThumbnailFromUrl(imageObj.url),

                    height: 80,
                    width: 60,
                }

            }
            else
                return {
                    src: imageObj.url,
                    height: 80,
                    width: 60,
                    isVideo: true, // Indicate that this item is a video
                    alt: "u"
                }
        });

        return obj
    }

    const slidesEvent = (item: any) => {
        const slides = item?.attachments?.map((imageObj: any, index: number) => {
            return {

                src: imageObj.url,
                height: 900,
                width: 1000,
                alt: "u"
            }
        });
        return slides
    }

    const [videoUrl, setVideoUrl] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const videoRef: any = useRef(null);
    const timestampRef: any = useRef(null);






    const [index1, setIndex] = useState(-1);

    const handleClick = (index: number, item: CustomImage) => setIndex(index);

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
            {/* onClick={() => router.push(`/farms/${router.query.farm_id}/crops/${router.query.crop_id}/scouting/${item._id}`)} */}
            {data?.length ? data.map((item: any, index: any) => {
                return (
                    <Card key={index} className={styles.galleryCard} >
                        <Typography>{timePipe(item.createdAt, "DD-MM-YYYY hh.mm a")}</Typography>
                        {item?.attachments?.length ?
                            <>
                                <Gallery images={getModifiedImage(item)} onClick={handleClick}
                                />
                                <Lightbox
                                    slides={getModifiedImage(item)}
                                    open={index1 >= 0}
                                    index={index1}
                                    close={() => setIndex(-1)}
                                />
                            </>
                            :
                            // getModifiedImage(item)
                            <div style={{ color: "#c1c1c1", padding: "10px 0px 10px 10px", display: "flex", justifyContent: "center" }}>
                                {"No Attachments"}
                            </div>}
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
        </div>

    )
}
export default SingleViewScoutComponent;