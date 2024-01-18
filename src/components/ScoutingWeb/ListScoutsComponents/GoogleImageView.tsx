import { Avatar, Button, IconButton, Typography } from "@mui/material";
import styles from "./googleImageview.module.css";
import Image from "next/image";
import timePipe from "@/pipes/timePipe";
import { useRouter } from "next/router";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import { useCookies } from "react-cookie";
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import GoogleViewSkeleton from "@/components/Core/Skeletons/GoogleImageViewSkeleton";
const GoogleImageView = ({ rightBarOpen, setRightBarOpen, imageDetails }: any) => {

    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );

    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<any>()
    const [has_more, setHasMore] = useState<any>()
    const [selectedImage, setSelectedItemDetails] = useState<any>()
    const [imageIndex, setImageIndex] = useState<any>(0)
    const [, , removeCookie] = useCookies(["userType_v2"]);
    const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);

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

    //event for the get related images
    const getInstaScrollImageDetails = async (lastImage_id: any) => {
        setSelectedItemDetails(null)
        setLoading(true);
        let options = {
            method: "GET",
            headers: new Headers({
                authorization: accessToken,
            }),
        };
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/crops/${imageDetails.crop_id?._id}/images/${lastImage_id}/pre/9`,
                options
            );
            const responseData = await response.json();
            if (responseData.success) {
                if (responseData?.has_more) {
                    if (data?.length) {
                        setHasMore(responseData?.has_more);
                        let temp = [...data, ...responseData?.data]

                        const uniqueObjects = Array.from(
                            temp.reduce((acc, obj) => acc.set(obj._id, obj), new Map()).values()
                        );

                        setData(uniqueObjects);
                    }
                    else {
                        setHasMore(responseData?.has_more);
                        let temp = [...responseData?.data]
                        const uniqueObjects = Array.from(
                            temp.reduce((acc, obj) => acc.set(obj._id, obj), new Map()).values()
                        );
                        setData(temp);
                    }

                }

                else {
                    setHasMore(false);
                    setData(responseData?.data);
                }
            } else if (responseData?.statusCode == 403) {
                await logout();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (imageDetails?._id) {
            getInstaScrollImageDetails(imageDetails?._id)
        }
    }, [imageDetails?._id])

    return (
        <div >

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

                <div className={styles.imageUploadingDetails}>
                    <Avatar sx={{ color: "#fff", background: "#d94841", width: "33px", height: "33px", fontSize: "10px" }}>{"R"}</Avatar>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <div className={styles.uploadedByName}>{"RAJU"}</div>
                        <div>
                            <Typography variant="caption" className={styles.imageUploadedTime} >
                                {/* <Image src="/mobileIcons/image-uploading-clock-icon.svg" alt="icon" width={15} height={15} /> */}
                                {timePipe(selectedImage?.uploaded_at ? selectedImage?.uploaded_at : imageDetails?.uploaded_at, "DD MMM YY hh:mm A")}</Typography>
                        </div>
                    </div>
                </div>

                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{selectedImage?._id ? selectedImage?.farm_id?.title : imageDetails?.farm_id?.title}/{selectedImage?._id ? selectedImage?.crop_id?.slug : imageDetails?.crop_id?.slug}</Typography>
                <div>
                    <IconButton
                        disabled={imageIndex == 0 ? true : false}
                        onClick={() => {
                            setImageIndex((prev: any) => prev - 1)
                            setSelectedItemDetails(data[imageIndex])
                        }}>
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    <IconButton
                        disabled={imageIndex == data?.length ? true : false}

                        onClick={() => {

                            setImageIndex((prev: any) => prev + 1)
                            setSelectedItemDetails(data[imageIndex])

                        }}>
                        <KeyboardArrowRightIcon />
                    </IconButton>
                    <IconButton onClick={() => setRightBarOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </div>

            </div>
            <hr></hr>

            <div className={styles.singleScoutImg}>
                <img
                    src={selectedImage?.url ? selectedImage?.url : imageDetails?.url}
                    width={100}
                    height={100}
                    alt="image"
                />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", }}>
                <Button variant="outlined"
                    sx={{ borderRadius: "20px", backgroundColor: "gray", color: "black" }}
                    onClick={() => {
                        if (router.query.farm_id || router.query.crop_id || router.query.location_id) {
                            router.push(
                                `/scouts/farm/${router.query.crop_id}/crops/${router.query.crop_id}/${imageDetails?._id}?location_id=${router.query.location_id}`
                            );
                        }
                        else {
                            router.push(
                                `/scouts/${imageDetails?._id}`
                            );
                        }
                    }}><RemoveRedEyeIcon />View Image</Button>
            </div>

            <hr></hr>
            {loading ? <GoogleViewSkeleton /> :
                <div className={styles.allScoutImgContainer}>
                    {data?.length
                        ? data?.map(
                            (imageItem: any, index: number) => {


                                return (
                                    <div
                                        className={styles.singleScoutImgIngalley}
                                        key={index}
                                        onClick={() => {
                                            setImageIndex(index)
                                            setSelectedItemDetails(imageItem)
                                        }}
                                    >
                                        <img
                                            src={
                                                imageItem?.url
                                            }
                                            height={100}
                                            width={100}
                                            alt={imageItem.key}
                                        />
                                    </div>
                                );
                            }
                        )
                        : ""}
                </div>}

            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <Button variant="outlined"
                    disabled={has_more ? false : true}
                    sx={{ borderRadius: "20px", border: "1px solid green", color: "black" }}
                    onClick={() => {
                        getInstaScrollImageDetails(data[data?.length - 1]?._id)
                    }}
                >{has_more ? "Load More!" : "No More Images"}</Button>
            </div>

        </div>
    )
}
export default GoogleImageView;