import { Breadcrumbs, Card, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Gallery } from "react-grid-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import styles from "./crop-card.module.css";
import Header1 from "../Header/HeaderComponent";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import timePipe from "@/pipes/timePipe";
import { ScoutAttachmentDetails } from "@/types/scoutTypes";
import Image from "next/image";
import LoadingComponent from "@/components/Core/LoadingComponent";
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
            console.log(err)
        } finally {
            setLoading(false);
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
                }
            else
                return {
                    src: imageObj.url,
                    height: 80,
                    width: 60,
                }
        });

        console.log(obj);

        return obj
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
                    <Card key={index} className={styles.galleryCard} onClick={() => router.push(`/farms/${router.query.farm_id}/crops/${router.query.crop_id}/scouting/${item._id}`)}>
                        <Typography>{timePipe(item.createdAt, "DD-MM-YYYY hh.mm a")}</Typography>
                        {item?.attachments?.length ?
                            <Gallery images={getModifiedImage(item)} rowHeight={140} maxRows={2} /> :
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
    <LoadingComponent loading={loading}/>
        </div>

    )
}
export default SingleViewScoutComponent;