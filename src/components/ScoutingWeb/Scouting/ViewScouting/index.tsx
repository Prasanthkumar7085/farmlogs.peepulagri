import { Card, Dialog, Grid, IconButton } from "@mui/material";
import ScoutingDetails from "./ScoutingDetails";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import getSingleScoutService from "../../../../../lib/services/ScoutServices/getSingleScoutService";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import CloseIcon from '@mui/icons-material/Close';

const SingleScoutViewDetails = () => {

    const router = useRouter();
    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);


    const [data, setData] = useState<any>();
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [finalImages, setFinalImages] = useState([]);
    const [curoselOpen, setCuroselOpen] = useState<any>(false)
    const [selectedImage, setSelectedImage] = useState<any>()




    const getSingleScout = async () => {
        setLoading(true);
        try {
            const response = await getSingleScoutService(
                router.query.scout_id as string,
                accessToken
            );
            if (response?.success) {
                setData(response?.data);
                getModifiedImages({ attachmentdetails: response.data.attachments });

            }
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setLoading(false);
        }
    };


    const getModifiedImages = ({ attachmentdetails }: any) => {
        let details = [];
        if (attachmentdetails.length) {
            details = attachmentdetails.map(
                (item: any, index: number) => {
                    if (item.type.includes("video")) {
                        return {
                            src: "/videoimg.png",
                            height: 80,
                            width: 60,
                            type: item.type,
                            caption: `${index + 1} image`,
                            original: item?.url,
                        };
                    } else if (item.type.includes("application")) {
                        return {
                            src: "/pdf-icon.png",
                            height: 80,
                            width: 60,
                            type: item.type,
                            caption: `${index + 1} image`,
                            original: item.url,
                        };
                    } else {
                        return {
                            src: item.url,
                            height: 80,
                            width: 60,
                            type: item.type,
                        };
                    }
                }
            );
        }
        setFinalImages(details);
    };

    //open curosel
    const openCarousel = (value: any, index: number) => {
        setCuroselOpen(true)
        setCurrentIndex(index)
    }

    useEffect(() => {
        if (router.isReady) {
            getSingleScout()
        }
    }, [accessToken, router.isReady])

    return (
        <div style={{ height: "100%" }}>
            <Grid container>
                <Grid xs={8}>
                    <Card sx={{ height: "100vh" }}>
                        {curoselOpen == false ?
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {finalImages.map((image: any, index: number) => (
                                    <div key={index} style={{ width: '20%', margin: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <img src={image.src} alt="Gallery Image" style={{ width: '100%', height: 'auto' }} onClick={() => openCarousel(image, index)} />
                                    </div>
                                ))}
                            </div> : ""}
                        {curoselOpen &&

                            <div>
                                <IconButton onClick={() => setCuroselOpen(false)} sx={{ top: "0", right: "6", padding: "5px", backgroundColor: "red", cursor: "pointer" }}>
                                    <CloseIcon sx={{ color: "#fff", height: "32px", width: "32px" }} />
                                </IconButton>
                                <Carousel selectedItem={currentIndex} onChange={(index) => setCurrentIndex(index)} swipeable={true}>

                                    {finalImages?.length > 0 &&
                                        finalImages.map((item: any, index: any) => (
                                            <div key={index} style={{ width: "45%", marginLeft: "30%", marginTop: "10%" }}>

                                                {item.type?.includes('video') ? (
                                                    <video controls width="100%" height="auto" autoPlay key={index}>
                                                        <source src={item.original} type={item.type} />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                ) : item.type?.includes('application') ? (
                                                    <iframe src={item.original} width="100%" height="100%" title={`iframe-${index}`} />
                                                ) : (
                                                    <>

                                                        <img
                                                            className="zoom-image"
                                                            src={item.src}
                                                            alt={`Image ${index + 1}`}
                                                        />

                                                    </>
                                                )}
                                            </div>
                                        ))}

                                </Carousel>
                            </div>

                        }
                    </Card>
                </Grid>
                <Grid xs={4} sx={{ height: 800 }}>
                    <Card sx={{ zIndex: 100 }}>
                        <ScoutingDetails data={data} />
                    </Card>
                </Grid>
            </Grid>
        </div>
    )
}
export default SingleScoutViewDetails;