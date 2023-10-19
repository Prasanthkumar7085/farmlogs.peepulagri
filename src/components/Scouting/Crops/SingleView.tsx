import { Breadcrumbs, Card, Chip, IconButton, Link, Typography, Button, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { Gallery } from "react-grid-gallery";
import styles from "./crop-card.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import timePipe from "@/pipes/timePipe";
import LoadingComponent from "@/components/Core/LoadingComponent";
import VideoDialog from "@/components/Core/VideoDiloag";
import ViewSingleImagePreview from "@/components/ViewSingleImagePreview";
import VideoDialogForScout from "@/components/VideoDiloagForSingleScout";
import getSingleScoutService from "../../../../lib/services/ScoutServices/getSingleScoutService";
import { removeTheFilesFromStore } from "@/Redux/Modules/Farms";
import { removeTheAttachementsFilesFromStore } from "@/Redux/Modules/Conversations";
import Image from "next/image";
import moment from "moment";
import CommentIcon from '@mui/icons-material/Comment';
import DrawerComponentForScout from "../Comments/DrawerBoxForScout";
import VisibilityIcon from '@mui/icons-material/Visibility';
import InfiniteScroll from "react-infinite-scroll-component"
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import TagsDrawer from "@/components/Core/TagsDrawer";
import SellIcon from '@mui/icons-material/Sell';



const SingleViewScoutComponent = () => {

    const router = useRouter();
    const dispatch = useDispatch()

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);
    const farmTitle = useSelector((state: any) => state?.farms?.cropName);

    const [data, setData] = useState<any>([])
    const [selectedFile, setSelectedFile] = useState<any>([])
    const [index, setIndex] = useState<any>()
    const [scoutData, setScoutData] = useState();
    const [sildeShowImages, setSlideShowImages] = useState<any>()
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState<any>(false)
    const [scoutId, setScoutId] = useState<any>()
    const [readMore, setReadMore] = useState<any>()
    const [descriptionID, setDescriptionID] = useState<any>()
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [SummaryDrawerOpen, setSummaryDrawerOpen] = useState<boolean>(false)
    const [tagsDrawerOpen, setTagsDrawerOpen] = useState<boolean>(false)
    const [openDialog, setOpenDialog] = useState(false);
    const [indexOfSeletedOne, setIndexOfseletedOne] = useState<any>();
    const [selectedItems, setSelectedItems] = useState<any>([]);
    const [tagsCheckBoxOpen, setTagsCheckBoxOpen] = useState<any>()

    let tempImages: any = [...selectedItems];

    useEffect(() => {
        if (router.query.farm_id && router.isReady && router.query?.crop_id && accessToken) {
            getPresingedURls()
            dispatch(removeTheFilesFromStore([]));
            dispatch(removeTheAttachementsFilesFromStore([]))

        }
    }, [accessToken, router.isReady,])

    // useEffect(() => {
    //     getPresingedURls()
    // }, [pageNumber]);

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
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farm/${router.query.farm_id}/scouts/${pageNumber}/10?crop_id=${router.query?.crop_id}`, options)
            let responseData = await response.json()

            if (responseData.success) {
                setSelectedFile(responseData.data)
                if (responseData?.has_more || responseData?.has_more == false) {
                    setHasMore(responseData?.has_more);
                }
                let temp: any;
                temp = [...data, ...responseData?.data];
                setData(temp);
            }
        }
        catch (err) {
            console.error(err)
        } finally {
            setLoading(false);
        }
    };



    const getModifiedImage = (item: any) => {

        let obj = item?.attachments?.map((imageObj: any, index: number) => {

            if (imageObj.type.includes("video")) {
                return {
                    src: "/videoimg.png",
                    original: imageObj.url,
                    url: imageObj.url,
                    height: 80,
                    width: 60,
                    type: imageObj.type,
                    id: imageObj._id,
                    scout_id: item._id,
                    alt: "u",
                    tags: imageObj.tags
                }
            }
            else if (imageObj.type.includes("application")) {
                return {
                    src: "/pdf-icon.png",
                    original: imageObj.url,
                    url: imageObj.url,
                    height: 80,
                    width: 60,
                    type: imageObj.type,
                    id: imageObj._id,
                    scout_id: item._id,
                    alt: "u",
                    tags: imageObj.tags

                }
            }
            else
                return {
                    src: imageObj.url,
                    url: imageObj.url,
                    height: 80,
                    type: imageObj.type,
                    id: imageObj._id,
                    scout_id: item._id,
                    width: 60,
                    alt: "u",
                    tags: imageObj.tags

                }
        });
        return obj;
    }

    const getSingleScout = async (scoutId: any) => {
        const response = await getSingleScoutService(scoutId, accessToken);

        if (response?.success) {
            if (response?.data?.attachments?.length) {
                setSlideShowImages(response?.data?.attachments)
                setScoutData(response?.data);
            }
        }
        setLoading(false);
    }



    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setIndex(-1);
    };

    const handleClick = (index: number, item: any) => {

        handleOpenDialog();
        setIndexOfseletedOne(index);
    };

    //for comments drawer open/close
    const drawerClose = (value: any) => {
        if (value == false) {
            setDrawerOpen(false)
        }
    }

    //for summary drawer open/close
    const summaryDrawerClose = (value: any) => {
        if (value == false) {
            setSummaryDrawerOpen(false)
        }
    }

    //for tags drawer open/close
    const tagsDrawerClose = (value: any) => {
        if (value == false) {
            setTagsDrawerOpen(false)
        }
    }

    //capture the tags details
    const captureTagsDetails = (tags: any, findingsvalue: any) => {
        if (tags) {
            console.log(tags, findingsvalue)
        }
    }

    const handleChange = (itemId: any) => {
        const itemIndex = tempImages.indexOf(itemId);
        if (itemIndex === -1) {
            tempImages.splice(1, 0, itemId)
        }
        else {
            tempImages.splice(itemIndex, 1);
        }
        setSelectedItems(tempImages)

    };

    return (
        <div className={styles.scoutingView}>

            <div role="presentation">
                <Breadcrumbs aria-label="breadcrumb" className={styles.breadcrumbs} >
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
            < InfiniteScroll
                className={styles.infiniteScrollComponent}
                dataLength={data.length}
                next={() => setPageNumber(prev => prev + 1)}
                hasMore={hasMore}
                loader={<div className={styles.pageLoader}>{loading ? "Loading..." : ""}</div>}
                endMessage={<a href="#" className={styles.endOfLogs}>{hasMore ? "" : data.length > 11 ? 'Scroll to Top' : ""}</a>}
            >
                {data?.length ? data.map((item: any, index: any) => {
                    return (
                        <Card key={index} className={styles.galleryCard} >
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography className={styles.postDate}>

                                    <InsertInvitationIcon />
                                    <span>{timePipe(item.updatedAt, "DD-MM-YYYY")}</span>
                                </Typography>

                                <Typography className={styles.postDate}>
                                    {tagsCheckBoxOpen ?
                                        <IconButton onClick={() => setTagsCheckBoxOpen(false)}>
                                            <Image
                                                src={"/scouting-img-clear.svg"}
                                                width={20}
                                                height={20}
                                                alt="tag"
                                            />
                                        </IconButton> :
                                        <IconButton onClick={() => setTagsCheckBoxOpen(true)}>
                                            <Image
                                                src={"/scouting-img-add.svg"}
                                                width={20}
                                                height={20}
                                                alt="tag"
                                            />
                                        </IconButton>}

                                    <Image
                                        src={"/Summary.svg"}
                                        width={20}
                                        height={20}
                                        alt="tag"
                                    />
                                    <span onClick={() => setSummaryDrawerOpen(true)}>Summary</span>
                                </Typography>
                            </div>

                            <Card sx={{
                                width: "100%", minHeight: "100px",
                            }}>

                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: '50% 50%', /* Two columns with a width of 60px each */
                                    gap: '10px', /* Adjust the gap between the columns if necessary */
                                    margin: "0.5rem",
                                    objectFit: "cover"
                                }}>
                                    {getModifiedImage(item)?.length !== 0 ? getModifiedImage(item).map((image: any, index: any) => (

                                        <div style={{ position: "relative", height: "100px", }} key={index}>
                                            <img src={image.src} alt={image.alt} width={'100%'} height={"100%"} onClick={() => handleClick(index, image)} style={{ cursor: "pointer", borderRadius: "5px" }} />

                                            <div style={{ position: "absolute", top: 0, left: 0 }}>
                                                {tagsCheckBoxOpen && image?.tags?.length == 0 ?
                                                    <Checkbox

                                                        sx={{
                                                            color: "#7f7f7f",
                                                            '& .MuiSvgIcon-root': {
                                                                color: "#7f7f7f"
                                                            }
                                                        }}
                                                        size="small"
                                                        checked={(tempImages.find((ite: any) => ite == image.id)) ? true : false}
                                                        onChange={() => handleChange(image.id)}
                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                        color="secondary"
                                                        title={image.id}
                                                    /> : tagsCheckBoxOpen == true ? <Image src={"/scout-img-select.svg"} width={10} height={10} alt="tags" /> : ""}
                                            </div>
                                        </div>

                                    )) : <div style={{ width: "100%", marginLeft: "100%" }}>No Attachements</div>}
                                </div>
                            </Card>

                        </Card>
                    )
                })
                    :
                    (!loading ?
                        <div id={styles.noData} style={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "4rem" }}>
                            <Image src="/emty-folder-image.svg" alt="empty folder" width={250} height={150} />
                            <Typography variant="h4">No Scoutings for this crop</Typography>
                        </div>
                        : "")}
            </InfiniteScroll>

            <LoadingComponent loading={loading} />
            <VideoDialogForScout open={openDialog} onClose={handleCloseDialog} mediaArray={sildeShowImages} index={index} data={scoutData} />

            {/* {SummaryDrawerOpen ? <SummaryTextDilog summaryDrawerClose={summaryDrawerClose} /> : ""} */}
            {drawerOpen == true ?
                <DrawerComponentForScout drawerClose={drawerClose} scoutId={scoutId} anchor={"bottom"} />
                : ""}
            {tagsDrawerOpen ?
                <TagsDrawer tagsDrawerClose={tagsDrawerClose} captureTagsDetails={captureTagsDetails} /> : ""}

            <div className="addFormPositionIcon">
                {tagsCheckBoxOpen == false ?
                    <img src="/add-plus-icon.svg" alt="" onClick={() => {
                        router.push(`/farms/${router?.query.farm_id}/crops/add-item?crop_id=${router.query.crop_id}`)
                    }} /> :
                    <img src="/scout-add-floating-icon.svg" alt="tags icon" onClick={() => {
                        setTagsDrawerOpen(true)
                    }} />}
            </div>
        </div>

    )
}
export default SingleViewScoutComponent;