import { Breadcrumbs, Card, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Gallery } from "react-grid-gallery";
import "react-image-gallery/styles/css/image-gallery.css"
import Header1 from "../Header/HeaderComponent";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import timePipe from "@/pipes/timePipe";
import { ScoutAttachmentDetails } from "@/types/scoutTypes";
import Image from "next/image";
const SingleViewScoutComponent = () => {
    const [urls, setUrls] = useState<any>()
    const router = useRouter()
    const [data, setData] = useState<any>()
    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);
    const farmTitle = useSelector((state: any) => state?.farms?.cropName);
    console.log(farmTitle);
    

    useEffect(() => {
        if (router.query.farm_id && router.isReady) {
            getPresingedURls()
        }
    }, [accessToken, router.isReady])

    const getPresingedURls = async () => {
        let options = {
            method: "GET",

            headers: new Headers({
                'content-type': 'application/json',
                'authorization': accessToken
            })
        }
        try {
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farm/${router.query.farm_id}/scouts/1/10`, options)
            let responseData = await response.json()
            
            if (responseData.success) {
                setData(responseData.data);
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    // const images = [
    //     {
    //         src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
    //         width: 150,
    //         height: 70,
    //         caption: "After Rain (Jeshu John - designerspics.com)",
    //     },
    //     {
    //         src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
    //         width: 150,
    //         height: 70,
    //         tags: [
    //             { value: "Ocean", title: "Ocean" },
    //             { value: "People", title: "People" },
    //         ],
    //         alt: "Boats (Jeshu John - designerspics.com)",
    //     },

    //     {
    //         src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
    //         width: 150,
    //         height: 70,
    //     },
    //     {
    //         src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",

    //         tags: [
    //             { value: "Ocean", title: "Ocean" },
    //             { value: "People", title: "People" },
    //         ],
    //         width: 150,
    //         height: 70,
    //         alt: "Boats (Jeshu John - designerspics.com)",
    //     },



    // ];

    const getModifiedImage = (item:any) => {
        let obj = item?.attachments?.slice(0, 4)?.map((imageObj: any, index: number) => {
            if (index+1 == 4)
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
        <div style={{ padding: "1rem" }}>

            <div role="presentation">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/farms">
                        dashboard
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
            {data && data.map((item: any, index: any) => {
                return (
                <Card key={index} style={{ marginTop: "20px" }} onClick={()=>router.push(`/farms/${router.query.farm_id}/crops/${router.query.crop_id}/scouting/${item._id}`)}>
                        <Typography>{timePipe(item.createdAt, "DD-MM-YYYY hh.mm a")}</Typography>
                        {item?.attachments?.length ?
                            <Gallery images={getModifiedImage(item)} rowHeight={140} maxRows={2} /> : 
                            <div style={{color:"#c1c1c1", padding:"10px 0px 10px 10px",  display:"flex",justifyContent:"center"}}>
                                {"No Attachments"}
                            </div>}
                </Card>
            )})}

        </div>

    )
}
export default SingleViewScoutComponent;