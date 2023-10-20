import { removeTheAttachementsFilesFromStore } from "@/Redux/Modules/Conversations";
import { removeTheFilesFromStore } from "@/Redux/Modules/Farms";
import LoadingComponent from "@/components/Core/LoadingComponent";
import SummaryTextDilog from "@/components/Core/SummaryTextDilog";
import TagsDrawer from "@/components/Core/TagsDrawer";
import VideoDialogForScout from "@/components/VideoDiloagForSingleScout";
import timePipe from "@/pipes/timePipe";
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import { Breadcrumbs, Card, Checkbox, IconButton, Link, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import getSingleScoutService from "../../../../lib/services/ScoutServices/getSingleScoutService";
import DrawerComponentForScout from "../Comments/DrawerBoxForScout";
import styles from "./crop-card.module.css";



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
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [SummaryDrawerOpen, setSummaryDrawerOpen] = useState<boolean>(false)
    const [tagsDrawerOpen, setTagsDrawerOpen] = useState<boolean>(false)
    const [openDialog, setOpenDialog] = useState(false);
    const [indexOfSeletedOne, setIndexOfseletedOne] = useState<any>();
    const [selectedItems, setSelectedItems] = useState<any>([]);
    const [tagsCheckBoxOpen, setTagsCheckBoxOpen] = useState<any>(false)
    const [scoutAttachmentDetails, setScoutAttachementsDetails] = useState<any>()
    const [summaryContent, setSummaryContent] = useState<any>()
    const [scoutFindings, setScoutFindings] = useState<any>()

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
                if (responseData?.has_more || responseData?.has_more == false) {
                    setHasMore(responseData?.has_more);
                }
                let temp: any;
                // temp = [...data, ...responseData?.data];
                setData(responseData?.data);
            }
        }
        catch (err) {
            console.error(err)
        } finally {
            setLoading(false);
        }
    };





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



    const handleOpenDialog = (item: any) => {
        setOpenDialog(true);
        setSelectedItems([])
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedItems([])
    };

    const handleClick = (index: number, item: any) => {
        handleOpenDialog(item);
        setIndexOfseletedOne(index);
        setSlideShowImages(item)
        setIndex(index)
        setSelectedItems([item[index]])
        setScoutAttachementsDetails(item)
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
    //capture the summary content
    const captureSummary = async (value: any) => {
        console.log(value)
        if (value) {
            setSummaryContent(value)
            await updateDescriptionService([], value)

        }

    }

    //capture thecurosel options
    const captureImageDilogOptions = (value: any) => {
        console.log(value)
        if (value == "tag") {
            setTagsDrawerOpen(true)
        }
    }
    //capture the tags details
    const captureTagsDetails = async (tags: any, findingsvalue: any) => {
        setScoutFindings(findingsvalue)
        if (tags.length) {
            await tempImages.forEach((obj: any) => {
                obj.tags = tags
            })
            const newArray = await tempImages.map((obj: any) => ({
                ...obj,
                description: findingsvalue
            }))
            setSelectedItems(newArray)
            await updateDescriptionService(newArray, selectedFile.summary)
        }

    }
    //checkbox handlechange event
    const handleChange = (itemId: any) => {
        const itemIndex = tempImages.findIndex((ite: any) => ite._id === itemId._id);

        if (itemIndex === -1) {
            setSelectedItems([...tempImages, itemId]);
        } else {
            const updatedItems = tempImages.filter((item: any) => item._id !== itemId._id);
            setSelectedItems(updatedItems);
        }
    };

    //capture the slideimages index
    const captureSlideImagesIndex = (value: any) => {
        if (value) {
            setIndex(value)
            setSelectedItems([sildeShowImages[index]])

        }
    }

    //update the details of the scouting
    const updateDescriptionService = async (imagesArray: any, summaryValue: any) => {
        setLoading(true)
        let updatedArray = scoutAttachmentDetails?.map((obj: any) => {
            let matchingObj = imagesArray?.find((item: any) => item._id === obj._id);
            return matchingObj ? matchingObj : obj;
        });

        try {
            let options = {
                method: "PATCH",
                headers: new Headers({
                    'content-type': 'application/json',
                    'authorization': accessToken
                }),
                body: JSON.stringify({
                    "farm_id": router.query.farm_id,
                    "crop_id": router.query.crop_id,
                    "attachments": tempImages?.length ? updatedArray : scoutAttachmentDetails,
                    "summary": summaryValue
                })
            }
            let response: any = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouts/${scoutId}`, options);
            const responseData = await response.json();
            if (responseData?.success == true) {
                toast.success("Scout updated successfully");
                setTagsDrawerOpen(false)
                getPresingedURls()
                setSelectedFile([])
                setSelectedItems([])
                setTagsCheckBoxOpen(false)
                setSummaryDrawerOpen(false)
                setSelectedItems([])
                setScoutAttachementsDetails([])
                setSummaryContent("")

            }

        } catch (err: any) {
            console.error(err);

        }
        finally {
            setLoading(false)
        }
    }

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
            {/* < InfiniteScroll
                className={styles.infiniteScrollComponent}
                dataLength={data.length}
                next={() => setPageNumber(prev => prev + 1)}
                hasMore={hasMore}
                loader={<div className={styles.pageLoader}>{loading ? "Loading..." : ""}</div>}
                endMessage={<a href="#" className={styles.endOfLogs}>{hasMore ? "" : data.length > 11 ? 'Scroll to Top' : ""}</a>}
            > */}
            {data?.length ? data.map((item: any, index: any) => {
                return (
                    <Card key={index} className={styles.galleryCard} >
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography className={styles.postDate}>

                                <InsertInvitationIcon />
                                <span>{timePipe(item.createdAt, "DD-MM-YYYY")}</span>
                            </Typography>

                            <Typography className={styles.postDate}>
                                {tagsCheckBoxOpen && scoutId == item._id ?
                                    <IconButton onClick={() => setTagsCheckBoxOpen(false)}>
                                        <Image
                                            src={"/scouting-img-clear.svg"}
                                            width={20}
                                            height={20}
                                            alt="tag"
                                        />
                                    </IconButton> :
                                    <IconButton onClick={() => {
                                        setTagsCheckBoxOpen(true)
                                        setScoutId(item._id)
                                        setScoutAttachementsDetails(item.attachments)
                                        setSlideShowImages(item.attachments)
                                    }}>
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
                                <span onClick={() => {
                                    setSummaryDrawerOpen(true)
                                    setScoutId(item._id)
                                    setSelectedFile(item)
                                    setScoutAttachementsDetails(item.attachments)
                                }}>Summary</span>
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
                                {item?.attachments?.length !== 0 ? item.attachments.map((image: any, index: any) => (

                                    <div style={{ position: "relative", height: "100px", }} key={index}>
                                        <img src={image.url} alt={`images${index}`} width={'100%'} height={"100%"} onClick={() => {
                                            handleClick(index, item.attachments)
                                            setScoutId(item._id)
                                        }} style={{ cursor: "pointer", borderRadius: "5px" }} />

                                        <div style={{ position: "absolute", top: 0, left: 0 }}>
                                            {tagsCheckBoxOpen && image?.tags?.length == 0 && scoutId == item._id ?
                                                <Checkbox

                                                    sx={{
                                                        color: "#7f7f7f",
                                                        '& .MuiSvgIcon-root': {
                                                            color: "#7f7f7f"
                                                        }
                                                    }}
                                                    size="small"
                                                    checked={tempImages.some((ite: any) => ite._id === image._id)}
                                                    onChange={() => handleChange(image)}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                    color="secondary"
                                                    title={image.id}
                                                /> : tagsCheckBoxOpen == true && scoutId == item._id ? <Image src={"/scout-img-select.svg"} width={10} height={10} alt="tags" /> : ""}
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
            {/* </InfiniteScroll> */}

            <LoadingComponent loading={loading} />
            <VideoDialogForScout
                open={openDialog}
                onClose={handleCloseDialog}
                mediaArray={sildeShowImages}
                index={index}
                data={scoutData}
                captureSlideImagesIndex={captureSlideImagesIndex}
                captureImageDilogOptions={captureImageDilogOptions} />

            {SummaryDrawerOpen ? <SummaryTextDilog summaryDrawerClose={summaryDrawerClose} captureSummary={captureSummary} item={selectedFile} /> : ""}
            {drawerOpen == true ?
                <DrawerComponentForScout drawerClose={drawerClose} scoutId={scoutId} anchor={"bottom"} />
                : ""}
            {tagsDrawerOpen ?
                <TagsDrawer tagsDrawerClose={tagsDrawerClose} captureTagsDetails={captureTagsDetails} item={sildeShowImages[index]} /> : ""}

            <div className="addFormPositionIcon">
                {tagsCheckBoxOpen == false && selectedItems?.length == 0 ?
                    <img src="/add-plus-icon.svg" alt="" onClick={() => {
                        router.push(`/farms/${router?.query.farm_id}/crops/add-item?crop_id=${router.query.crop_id}`)
                    }} /> :
                    selectedItems?.length ?
                        <img src="/scout-add-floating-icon.svg" alt="tags icon" onClick={() => {
                            setTagsDrawerOpen(true)
                        }} /> : ""}
            </div>
            <Toaster richColors position="top-right" closeButton />

        </div>

    )
}
export default SingleViewScoutComponent;