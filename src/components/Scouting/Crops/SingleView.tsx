import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useState } from "react";
import { Gallery } from "react-grid-gallery";
import "react-image-gallery/styles/css/image-gallery.css"
import Header1 from "../Header/HeaderComponent";
import { useRouter } from "next/router";
const SingleViewScoutComponent = () => {
    const [urls, setUrls] = useState<any>()
    const router = useRouter()


    const getPresingedURls = async () => {
        let options = {

        }
        try {
            let response = await fetch("url", options)
            let responseData = await response.json()
            if (responseData.success == true) {

            }
        }
        catch (err) {
            console.log(err)
        }
    }

    const images = [
        {
            src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
            width: 120,
            height: 60,
            caption: "After Rain (Jeshu John - designerspics.com)",
        },
        {
            src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
            width: 120,
            height: 60,
            tags: [
                { value: "Ocean", title: "Ocean" },
                { value: "People", title: "People" },
            ],
            alt: "Boats (Jeshu John - designerspics.com)",
        },

        {
            src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
            width: 120,
            height: 60,
        },
        {
            src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",

            tags: [
                { value: "Ocean", title: "Ocean" },
                { value: "People", title: "People" },
            ],
            width: 120,
            height: 60,
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
            <Typography>22-04-2023</Typography>
            <Gallery images={images} rowHeight={150} maxRows={2} />
        </div>

    )
}
export default SingleViewScoutComponent;