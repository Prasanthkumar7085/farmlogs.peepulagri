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
const GoogleImageView = ({ rightBarOpen, setRightBarOpen, imageDetails, setImageDetails, data }: any) => {

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
            let routerData = { ...router.query, view: true, image_id: data[imageIndex]?._id }
            dispatch(QueryParamsForScouting(routerData))
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
                        disabled={loading || imageIndex == 0 ? true : false}
                        onClick={() => {
                            setChangeImage(true)

                            setImageIndex((prev: any) => prev - 1);
                        }}>
                        <KeyboardArrowLeftIcon sx={{ fontSize: "2rem" }} />
                    </IconButton>
                    <IconButton
                        disabled={loading || imageIndex == data?.length - 1 ? true : false}
                        onClick={() => {
                            setChangeImage(true)
                            setImageIndex((prev: any) => prev + 1);
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
                {loading || !selectedImage?._id ? <Skeleton variant="rounded" width={470} height={350} animation="wave" /> :
                    <img
                        src={selectedImage?.url}
                        width={100}
                        height={100}
                        alt="Loading..."
                    />}
            </div>

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
                    <div style={{ textAlign: "center" }}>No tags</div>
                )}
            </div>
        </div>
    )
}
export default GoogleImageView;