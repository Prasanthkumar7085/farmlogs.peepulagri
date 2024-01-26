import { Avatar, Button, IconButton, Skeleton, Typography } from "@mui/material";
import styles from "./googleImageview.module.css";
import Image from "next/image";
import timePipe from "@/pipes/timePipe";
import { useRouter } from "next/router";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { use, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { QueryParamsForScouting, removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import { useCookies } from "react-cookie";
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import GoogleViewSkeleton from "@/components/Core/Skeletons/GoogleImageViewSkeleton";
import SouthIcon from '@mui/icons-material/South';
const GoogleImageView = ({ rightBarOpen, setRightBarOpen, imageDetails, setImageDetails }: any) => {

    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );

    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<any>([])
    const [has_more, setHasMore] = useState<any>()
    const [selectedImage, setSelectedItemDetails] = useState<any>()
    const [imageIndex, setImageIndex] = useState<any>(0)
    const [, , removeCookie] = useCookies(["userType_v2"]);
    const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);
    const [loading1, setLoading1] = useState<boolean>(false)

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

    useEffect(() => {
        if (data?.length) {
            setSelectedItemDetails(data[imageIndex])
        }
    }, [imageIndex])


    const ItemRef = useRef<HTMLDivElement>(null);
    const scrollToItem = () => {
        if (ItemRef.current) {
            ItemRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest",
            });
        }
    };



    //get the single image details
    const getTheSingleImageDetails = async () => {
        setLoading(true);
        let options = {
            method: "GET",
            headers: new Headers({
                authorization: accessToken,
            }),
        };
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/farm-images/${router.query.image_id}`,
                options
            );
            const responseData = await response.json();
            if (responseData.success) {
                setSelectedItemDetails(responseData?.data)
                await getAllImagesDetails(router.query.view_limit, responseData?.data)

            }

        }
        catch (err) {
            console.error(err)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (router.isReady && router.query.image_id && !selectedImage?._id && !imageDetails?._id) {
            getTheSingleImageDetails()
        }
    }, [router.isReady, router.query.image_id, accessToken, selectedImage?._id, imageDetails?._id])

    //event for the get related images
    const getInstaScrollImageDetails = async (lastImage_id: any) => {
        setLoading1(true);
        let options = {
            method: "GET",
            headers: new Headers({
                authorization: accessToken,
            }),
        };
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/crops/${selectedImage?.crop_id?._id || imageDetails.crop_id?._id}/images/${1}/${data?.length + 12}`,
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
                        router.replace({ pathname: "/scouts", query: { ...router.query, view: true, image_id: selectedImage?._id, view_limit: uniqueObjects?.length } });

                        let routerData = { ...router.query, view: true, image_id: selectedImage?._id, view_limit: uniqueObjects?.length }

                        dispatch(QueryParamsForScouting(routerData))
                    }
                    else {
                        setHasMore(responseData?.has_more);
                        let temp = [...responseData?.data]
                        const uniqueObjects = Array.from(
                            temp.reduce((acc, obj) => acc.set(obj._id, obj), new Map()).values()
                        );
                        setData(temp);
                        router.replace({ pathname: "/scouts", query: { ...router.query, view: true, image_id: selectedImage?._id, view_limit: temp?.length } });

                        let routerData = { ...router.query, view: true, image_id: selectedImage?._id, view_limit: temp?.length }

                        dispatch(QueryParamsForScouting(routerData))
                    }

                }

                else {
                    setHasMore(false);
                    let temp = [...data, ...responseData?.data]
                    const uniqueObjects = Array.from(
                        temp.reduce((acc, obj) => acc.set(obj._id, obj), new Map()).values()
                    );

                    setData(uniqueObjects);
                    router.replace({ pathname: "/scouts", query: { ...router.query, view: true, image_id: selectedImage?._id, view_limit: uniqueObjects?.length } });

                    let routerData = { ...router.query, view: true, image_id: selectedImage?._id, view_limit: uniqueObjects?.length }

                    dispatch(QueryParamsForScouting(routerData))
                }
            } else if (responseData?.statusCode == 403) {
                await logout();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading1(false);
        }
    };

    const getAllImagesDetails = async (limit: any, image: any) => {
        if (!image?._id) {
            setLoading(true)
        }
        let options = {
            method: "GET",
            headers: new Headers({
                authorization: accessToken,
            }),
        };
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/crops/${image?.crop_id?._id || imageDetails.crop_id?._id}/images/${1}/${limit ? limit : 12}`,
                options
            );
            const responseData = await response.json();
            if (responseData.success) {

                setHasMore(responseData?.has_more);
                let temp = [...responseData?.data]
                scrollToItem()

                const uniqueObjects = Array.from(
                    temp.reduce((acc, obj) => acc.set(obj._id, obj), new Map()).values()
                );
                setData(uniqueObjects)

                if (limit) {
                    const selectedImageIndex = uniqueObjects.findIndex((item: any, index) => item._id == image?._id)
                    setImageIndex(selectedImageIndex);
                }
                else if (imageDetails?._id) {
                    const selectedImageIndex = uniqueObjects.findIndex((item: any, index) => item._id == imageDetails?._id)
                    setImageIndex(selectedImageIndex);
                }
                else {
                    const selectedImageIndex = uniqueObjects.findIndex((item: any, index) => item._id == router.query.image_id)
                    setImageIndex(selectedImageIndex);
                }


            }


        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {

        if (imageDetails?._id) {
            setSelectedItemDetails(null)
            getAllImagesDetails("", "")
        }
    }, [imageDetails?._id])

    return (
        <div style={{ padding: "1rem" }} ref={ItemRef} >
            <div className={styles.viewImgInfoHeader} >
                <div className={styles.imageUploadingDetails} >
                    {loading ? <Skeleton variant="circular" width={20} height={20} /> :

                        <Avatar sx={{ color: "#fff", background: "#d94841", width: "20px", height: "20px", fontSize: "9px" }}>{selectedImage?._id ? selectedImage?.uploaded_by?.name.slice(0, 1).toUpperCase() : imageDetails?.uploaded_by?.name.slice(0, 1).toUpperCase()}</Avatar>}

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        {loading ? <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={150} /> :
                            <div className={styles.uploadedByName}>{selectedImage?._id ? selectedImage?.uploaded_by?.name : imageDetails?.uploaded_by?.name}</div>}
                        {loading ? <Skeleton variant="text" sx={{ fontSize: '1rem', }} width={180} /> :
                            <div>
                                <Typography variant="caption" className={styles.imageUploadedTime} >
                                    <Image src="/mobileIcons/image-uploading-clock-icon.svg" alt="icon" width={13} height={13} />
                                    <span>
                                        {timePipe(selectedImage?.uploaded_at ? selectedImage?.uploaded_at : imageDetails?.uploaded_at, "DD MMM YYYY hh:mm A")}
                                    </span>
                                </Typography>
                            </div>}
                    </div>
                </div>
                {loading ? <Skeleton variant="text" sx={{ fontSize: '2rem', }} width={180} /> :
                    <Typography variant="subtitle1" className={styles.imagesTitle}>{selectedImage?._id ? selectedImage?.farm_id?.title : imageDetails?.farm_id?.title} / {selectedImage?._id ? selectedImage?.crop_id?.title : imageDetails?.crop_id?.title}</Typography>}
                <div>
                    <IconButton
                        disabled={loading || imageIndex == 0 ? true : false}
                        onClick={() => {
                            setImageDetails(null)

                            let routerData = { ...router.query, view: true, image_id: data[imageIndex]?._id }

                            dispatch(QueryParamsForScouting(routerData))

                            setImageIndex((prev: any) => Math.max(prev - 1, 0));
                            setSelectedItemDetails(data[imageIndex]);
                            // router.replace({ pathname: "/scouts", query: { ...router.query, view: true, image_id: data[imageIndex]?._id } });


                        }}>
                        <KeyboardArrowLeftIcon sx={{ fontSize: "2rem" }} />
                    </IconButton>
                    <IconButton
                        disabled={loading || imageIndex == data?.length - 1 ? true : false}

                        onClick={() => {

                            if (selectedImage?._id) {
                                setImageDetails(null)

                                // router.replace({ pathname: "/scouts", query: { ...router.query, view: true, image_id: selectedImage?._id } });

                                setImageIndex((prev: any) => Math.min(prev + 1, data.length - 1));
                                setSelectedItemDetails(selectedImage);
                            }
                            else {
                                setImageDetails(null)

                                // router.replace({ pathname: "/scouts", query: { ...router.query, view: true, image_id: data[0]?._id } });

                                setImageIndex(0)
                                setSelectedItemDetails(data[0])
                            }


                        }}>
                        <KeyboardArrowRightIcon sx={{ fontSize: "2rem" }} />
                    </IconButton>
                    <IconButton onClick={() => {
                        setRightBarOpen(false)
                        let routerData = { ...router.query };
                        delete routerData?.image_id;
                        delete routerData?.view;
                        delete routerData?.view_limit;
                        dispatch(QueryParamsForScouting(routerData))
                        router.push({ query: routerData });
                        setImageDetails(null);
                    }}
                    // sx={{ position: "absolute", right: 9, top: "12%" }}
                    >
                        <CloseIcon sx={{ color: "#333" }} />
                    </IconButton>
                </div>

            </div>

            <div className={styles.singleScoutImg}>
                {loading ? <Skeleton variant="rounded" width={700} height={350} animation="wave" /> :
                    <img
                        src={selectedImage?.url ? selectedImage?.url : imageDetails?.url}
                        width={100}
                        height={100}
                        alt="Loading..."
                    />}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", borderBottom: "1px solid #E9EDF1", padding: "0.75rem 1rem", marginBlockEnd: "1rem" }}>
                <Button variant="contained"
                    className={styles.viewScoutingBtn}
                    onClick={() => {
                        if (router.query.farm_id || router.query.crop_id || router.query.location_id || selectedImage?._id || imageDetails?._id) {
                            let routerData = { ...router.query, view: true, image_id: selectedImage?._id ? selectedImage?._id : imageDetails?._id }
                            dispatch(QueryParamsForScouting(routerData))
                            router.push(
                                `/scouts/${selectedImage?._id ? selectedImage?._id : imageDetails?._id}`
                            );
                        }
                        else {
                            let routerData = { ...router.query, view: true, image_id: selectedImage?._id ? selectedImage?._id : imageDetails?._id }
                            dispatch(QueryParamsForScouting(routerData))
                            router.push(
                                `/scouts/${selectedImage?._id ? selectedImage?._id : imageDetails?._id}`
                            );
                        }
                    }}>
                    <Image src="/scouting/view-more-icon.svg" alt="" width={17} height={17} />
                    View Image</Button>
            </div>

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
                                            setImageDetails(null)

                                            getAllImagesDetails(data?.length, imageItem)
                                            router.replace({ pathname: "/scouts", query: { ...router.query, view: true, image_id: imageItem?._id, view_limit: data?.length } });

                                            let routerData = { ...router.query, view: true, image_id: imageItem?._id, view_limit: data?.length }

                                            dispatch(QueryParamsForScouting(routerData))

                                        }}
                                        style={{ border: imageItem?._id == (selectedImage?._id || imageDetails?._id) ? "2px solid #b1b3b9" : "" }}
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
            {loading1 ? <GoogleViewSkeleton /> : ""}
            {has_more ?
                <div style={{ display: "flex", justifyContent: "center", margin: "20px" }}>
                    <Button className={styles.loadingBtn} variant="outlined"
                        disabled={has_more ? false : true}

                        onClick={() => {
                            if (selectedImage?._id) {
                                setSelectedItemDetails(selectedImage)
                                getInstaScrollImageDetails("")

                            } else {
                                setSelectedItemDetails(data[imageIndex])
                                getInstaScrollImageDetails("")


                            }
                        }}
                    >Load More
                        <Image src="/scouting/view-more-down-arrow-icon.svg" alt="" width={13} height={13} />
                    </Button>
                </div>
                : ""}

        </div>
    )
}
export default GoogleImageView;