import { Avatar, Button, Chip, IconButton, Skeleton, Tooltip, Typography } from "@mui/material";
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
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import ReactPanZoom from "react-image-pan-zoom-rotate";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
const GoogleImageView = ({ rightBarOpen, setRightBarOpen, imageDetails, setImageDetails, data, getAllExistedScouts, hasMore, setOnlyImages }: any) => {
    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );

    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false)
    const [has_more, setHasMore] = useState<any>()
    const [selectedImage, setSelectedItemDetails] = useState<any>()
    const [imageIndex, setImageIndex] = useState<any>(0)
    const [, , removeCookie] = useCookies(["userType_v2"]);
    const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);
    const [loading1, setLoading1] = useState<boolean>(false)
    const [changeImage, setChangeImage] = useState<any>(false)
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });


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
                const selectedImageIndex = data.findIndex((item: any, index: number) => item._id == responseData?.data?._id)
                setImageIndex(selectedImageIndex);
                setSelectedItemDetails(responseData?.data)

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
        if (data?.length && changeImage) {
            // router.replace({ pathname: "/scouts", query: { ...router.query, view: true, image_id: data[imageIndex]?._id } });
            dispatch(QueryParamsForScouting({ ...router.query, view: true, image_id: data[imageIndex]?._id }))
            setSelectedItemDetails(data[imageIndex])
            setImageDetails(data[imageIndex])
        }
    }, [imageIndex])

    useEffect(() => {
        if ((imageDetails?._id == router.query.image_id as string) && accessToken && selectedImage?._id && router.isReady) {
            getTheSingleImageDetails()

        }
    }, [imageDetails?._id, accessToken, router.isReady])

    useEffect(() => {
        if (router.isReady && router.query.image_id && accessToken) {
            setSelectedItemDetails(null)
            getTheSingleImageDetails()
        }
    }, [router.isReady, router.query.image_id, accessToken])





    const toggleFullScreen = () => {
        const elem: any = document.getElementById('image-container');

        if (!document.fullscreenElement &&
            !document.fullscreenElement && !document.fullscreenElement) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }
            setIsFullScreen(true);
            setDragStart({ x: 0, y: 0 })
            setDragOffset({ x: 0, y: 0 });
            setIsDragging(false)
            setZoomLevel(1)
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }

            setIsFullScreen(false);
            setDragStart({ x: 0, y: 0 })
            setDragOffset({ x: 0, y: 0 });
            setIsDragging(false)
            setZoomLevel(1)

        }
    };



    const handleZoomIn = () => {
        setZoomLevel(zoomLevel + 0.1);
    };

    const handleZoomOut = () => {
        setZoomLevel(zoomLevel - 0.1);
    };


    const handleMouseWheel = (event: any) => {
        event.preventDefault();
        const newZoomLevel = zoomLevel + (event.deltaY * -0.01);
        setZoomLevel(Math.min(Math.max(0.5, newZoomLevel), 3)); // Limit zoom between 0.5x and 3x
    };


    const handleMouseDown = (event: any) => {
        setIsDragging(true);
        setDragStart({ x: event.clientX, y: event.clientY });
    };

    const handleMouseMove = (event: any) => {
        if (isDragging) {
            const offsetX = event.clientX - dragStart.x;
            const offsetY = event.clientY - dragStart.y;
            setDragOffset({ x: dragOffset.x + offsetX, y: dragOffset.y + offsetY });
            setDragStart({ x: event.clientX, y: event.clientY });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        const fullscreenChangeHandler = () => {
            setIsFullScreen(!!document.fullscreenElement || !!document.fullscreenElement || !!document.fullscreenElement || !!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', fullscreenChangeHandler);
        document.addEventListener('webkitfullscreenchange', fullscreenChangeHandler);
        document.addEventListener('mozfullscreenchange', fullscreenChangeHandler);
        document.addEventListener('MSFullscreenChange', fullscreenChangeHandler);

        return () => {
            document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
            document.removeEventListener('webkitfullscreenchange', fullscreenChangeHandler);
            document.removeEventListener('mozfullscreenchange', fullscreenChangeHandler);
            document.removeEventListener('MSFullscreenChange', fullscreenChangeHandler);
        };
    }, []);


    return (
        <div style={{ padding: "1rem", }}  >
            <div className={styles.viewImgInfoHeader} >
                <div className={styles.imageUploadingDetails} >
                    {loading || !selectedImage?._id ? <Skeleton variant="circular" width={20} height={20} /> :

                        <Avatar sx={{ color: "#fff", background: "#d94841", width: "20px", height: "20px", fontSize: "9px" }}>{selectedImage?.uploaded_by?.name.slice(0, 1).toUpperCase()}</Avatar>}

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        {loading || !selectedImage?._id ? <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={120} /> :
                            <div className={styles.uploadedByName}>{selectedImage?.uploaded_by?.name}</div>}
                        {loading || !selectedImage?._id ? <Skeleton variant="text" sx={{ fontSize: '1rem', }} width={130} /> :
                            <div>
                                <Typography variant="caption" className={styles.imageUploadedTime} >
                                    <Image src="/mobileIcons/image-uploading-clock-icon.svg" alt="icon" width={13} height={13} />
                                    <span>
                                        {timePipe(selectedImage?.uploaded_at, "DD MMM YYYY hh:mm A")}
                                    </span>
                                </Typography>
                            </div>}
                    </div>
                </div>
                {loading || !selectedImage?._id ? <Skeleton variant="text" sx={{ fontSize: '1rem', }} width={150} /> :
                    <Typography variant="subtitle1" className={styles.imagesTitle}>
                        <Tooltip title={selectedImage?.farm_id?.title}>
                            {selectedImage?.farm_id?.title.length > 10
                                ? selectedImage?.farm_id?.title.slice(0, 1).toUpperCase() +
                                selectedImage?.farm_id?.title.slice(1, 7) +
                                "..."
                                : selectedImage?.farm_id?.title.slice(0, 1).toUpperCase() +
                                selectedImage?.farm_id?.title.slice(1)}</Tooltip> / <Tooltip title={selectedImage?.crop_id?.title}>{selectedImage?.crop_id?.title.length > 10
                                    ? selectedImage?.crop_id?.title.slice(0, 1).toUpperCase() +
                                    selectedImage?.crop_id?.title.slice(1, 7) +
                                    "..."
                                    : selectedImage?.crop_id?.title.slice(0, 1).toUpperCase() +
                                    selectedImage?.crop_id?.title.slice(1)}</Tooltip>

                    </Typography>}
                <div>
                    <IconButton
                        disabled={loading || (imageIndex == 0 && router.query.page as string == "1") ? true : false}
                        onClick={async () => {
                            if (imageIndex == 0) {
                                setOnlyImages([])
                                await getAllExistedScouts({
                                    page: +(router.query.page as string) - 1,
                                    limit: router.query.limit as string,
                                    farmId: router.query.farm_id as string,
                                    userId: router.query.created_by as string,
                                    cropId: router.query.crop_id as string,
                                    fromDate: router.query.from_date as string,
                                    toDate: router.query.to_date as string,
                                    location: router.query.location_id as string,
                                    image_view: true,
                                    pageChange: true,
                                    pageDirection: "prev"

                                });
                            }
                            setChangeImage(true)
                            setImageIndex((prev: any) => prev - 1);
                        }}>
                        <KeyboardArrowLeftIcon sx={{ fontSize: "2rem" }} />
                    </IconButton>
                    <IconButton
                        disabled={loading || (hasMore == false && imageIndex == data?.length - 1) ? true : false}
                        onClick={async () => {
                            if (imageIndex == data?.length - 1) {
                                setOnlyImages([])
                                await getAllExistedScouts({
                                    page: +(router.query.page as string) + 1,
                                    limit: router.query.limit as string,
                                    farmId: router.query.farm_id as string,
                                    userId: router.query.created_by as string,
                                    cropId: router.query.crop_id as string,
                                    fromDate: router.query.from_date as string,
                                    toDate: router.query.to_date as string,
                                    location: router.query.location_id as string,
                                    image_view: true,
                                    pageChange: true,
                                    pageDirection: "next"

                                });

                            } else {
                                setChangeImage(true)
                                setImageIndex((prev: any) => prev + 1);
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

            {isFullScreen ?

                <div className={styles.singleScoutImg} id="image-container" style={{
                    position: "relative", cursor: isDragging ? "grabbing" : "grab",
                    userSelect: "none"

                }}
                    onWheel={handleMouseWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >

                    {loading || !selectedImage?._id ? <Skeleton variant="rounded" width={470} height={350} animation="wave" /> :
                        <img
                            src={selectedImage?.url}
                            width={100}
                            height={100}
                            style={{
                                transform: `scale(${zoomLevel}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                                transition: 'transform 0.5s ease-in-out'
                            }}
                            alt="Loading..."
                        />
                    }
                    <IconButton
                        onClick={toggleFullScreen} sx={{ position: "absolute", top: isFullScreen ? "90%" : "90%", right: isFullScreen ? "2%" : "2%" }}>
                        {isFullScreen ? <FullscreenExitIcon fontSize="large" /> :
                            <FullscreenIcon fontSize="large" />}
                    </IconButton>
                    <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                        <Tooltip title={"Zoom In"}>
                            <IconButton onClick={handleZoomIn}><ZoomInIcon fontSize="large" /></IconButton>
                        </Tooltip>
                        <Tooltip title={"Zoom Out"}>
                            <IconButton onClick={handleZoomOut}><ZoomOutIcon fontSize="large" /></IconButton>
                        </Tooltip>
                    </div>
                </div> :

                <div className={styles.singleScoutImg} id="image-container" style={{ position: "relative" }}>

                    {loading || !selectedImage?._id ? <Skeleton variant="rounded" width={470} height={350} animation="wave" /> :
                        <img
                            src={selectedImage?.url}
                            width={100}
                            height={100}
                            alt="Loading..."
                        />
                    }
                    <IconButton
                        onClick={toggleFullScreen} sx={{ position: "absolute", top: isFullScreen ? "90%" : "90%", right: isFullScreen ? "2%" : "2%" }}>
                        {isFullScreen ? <FullscreenExitIcon fontSize="large" /> :
                            <FullscreenIcon fontSize="large" />}
                    </IconButton>
                </div>
            }

            <div className={styles.tagsBlock}>
                <p className={styles.tagHeading}>
                    <Image src="/mobileIcons/singleImage-tag-icon.svg" alt="" width={15} height={15} />
                    <span>
                        Tags
                    </span>
                </p>

                {selectedImage?.tags?.length ? (
                    <div
                        style={{
                            alignItems: "flex-start",
                            padding: "16px 0px 0px 0px",
                            justifyContent: "flex-start",
                            margin: "0 auto",
                            display: "flex",
                            flexWrap: "wrap",
                            width: "100%",
                            flexDirection: "row",
                        }}
                    >
                        {selectedImage?.tags?.map((item: string, index: number) => {
                            return (

                                <Chip
                                    key={index}
                                    label={item}
                                    className={styles.tagsName}
                                    variant="outlined"
                                />
                            );
                        })
                        }
                    </div>
                ) : (
                    <div style={{ textAlign: "center" }}>
                        <Image
                            src={"/NoTags.svg"}
                            width={30}
                            height={30}
                            alt="tags"
                        />
                        <p>No tags</p>

                    </div>
                )}
            </div>
        </div>
    )
}
export default GoogleImageView;