import { Breadcrumbs, Card, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Gallery } from "react-grid-gallery";
import "react-image-gallery/styles/css/image-gallery.css"
import Header1 from "../Header/HeaderComponent";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import timePipe from "@/pipes/timePipe";
const SingleViewScoutComponent = () => {
    const [urls, setUrls] = useState<any>()
    const router = useRouter()
    const [data, setData] = useState<any>()
    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);


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
            if (responseData.success == true) {
                console.log(responseData)
                setData(responseData.data)
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    const images = [
        {
            src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
            width: 150,
            height: 70,
            caption: "After Rain (Jeshu John - designerspics.com)",
        },
        {
            src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
            width: 150,
            height: 70,
            tags: [
                { value: "Ocean", title: "Ocean" },
                { value: "People", title: "People" },
            ],
            alt: "Boats (Jeshu John - designerspics.com)",
        },

        {
            src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
            width: 150,
            height: 70,
        },
        {
            src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",

            tags: [
                { value: "Ocean", title: "Ocean" },
                { value: "People", title: "People" },
            ],
            width: 150,
            height: 70,
            alt: "Boats (Jeshu John - designerspics.com)",
        },



    ];
    return (
        <div >
            <Header1 name={"Scouting"} />
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
                    <Typography color="text.primary">name</Typography>
                </Breadcrumbs>
            </div>
            {data && data.map((item: any, index: any) => (
                <Card key={index} style={{ marginTop: "20px" }}>
                    <Typography>{timePipe(item.createdAt, "DD-MM-YYYY hh.mm a")}</Typography>
                    <Gallery images={images} rowHeight={150} maxRows={2} />
                </Card>
            ))}

        </div>

    )
}
export default SingleViewScoutComponent;