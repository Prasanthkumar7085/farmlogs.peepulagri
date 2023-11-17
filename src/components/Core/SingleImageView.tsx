import ImageComponent from "@/components/Core/ImageComponent";
import ShowMoreInViewAttachmentDetails from "@/components/Core/ShowMoreInViewAttachmentDetails";
import TagsDrawerEdit from "@/components/Core/TagsDrawerEdit";
import { Button, Chip, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import styles from "../Scouting/Crops/Scouts/singleImage.module.css";
import EditTagsForSingleAttachment from "@/components/Core/EditTagsForSingleAttachment";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/router";
import DrawerComponentForScout from "../Scouting/Comments/DrawerBoxForScout";
import timePipe from "@/pipes/timePipe";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";

interface componentProps {
    detailedImage: any;
    scoutDetails: any;
    getImageData: any;
}
const SingleImageView: FC<componentProps> = ({
    detailedImage,
    scoutDetails,
    getImageData,
}) => {

    const router = useRouter()
    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );

    const [TagsDrawerEditOpen, setTagsDrawerEditOpen] = useState<any>(false);

    const [openCommentsBox, setOpenCommentsBox] = useState<any>(false);
    const [showMoreSuggestions, setShowMoreSuggestions] = useState<any>(false);
    const [updateAttachmentLoading, setUpdateAttachmentLoading] = useState(false);

    const tagsDrawerClose = (value: any) => {
        if (value == false) {
            setTagsDrawerEditOpen(false);
        }
    };
    const drawerClose = (value: any) => {
        if (value == false) {
            setOpenCommentsBox(false);
            // setSelectedItems([]);
        }
    };

    const captureImageDilogOptions = (value: string) => {
        if (value == "tag") {
            setTagsDrawerEditOpen(true);
        } else if (value == "comments") {
            setOpenCommentsBox(true);
        }
    };

    const openViewMore = () => {
        setShowMoreSuggestions(true);
    };

    const captureTagsDetailsEdit = async (tags: any, description: any) => {
        try {
            let body =
            {
                farm_image_ids: [detailedImage._id],
                tags: tags
            }
            let options = {
                method: "POST",
                headers: new Headers({
                    "content-type": "application/json",
                    authorization: accessToken,
                }),
                body: JSON.stringify(body)
            }

            let response: any = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farms/farm-images/tag`, options)
            let responseData = await response.json()
            if (response?.status >= 200 && response?.status <= 200) {
                toast.success(responseData?.message);
                setTagsDrawerEditOpen(false);
                await getImageData({ page: 1 });
            } else {
                toast.error(responseData?.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdateAttachmentLoading(false);
        }
    };

    const [data, setData] = useState<any>()
    const [loading, setLoading] = useState<any>()
    //get the get image details api
    const getSingleImageDetails = async () => {
        setLoading(true)
        let options = {
            method: "GET",
            headers: new Headers({
                authorization: accessToken,
            }),
        }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farms/farm-image/view/${router.query.image_id}`, options)
            const responseData = await response.json()
            if (responseData.success) {
                setData(responseData?.data)
            }
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setLoading(false)

        }
    }

    //call the api
    useEffect(() => {
        if (router.isReady) {
            getSingleImageDetails()
        }

    }, [router.isReady, accessToken])

    return (
        <div>
            <div className={styles.overlay}>


                <div style={{ display: "flex", marginTop: "90px" }}>
                    <Typography className={styles.postDate}>
                        <InsertInvitationIcon />
                        <span>{timePipe(data?.created_at, "DD-MM-YYYY")}</span>
                    </Typography>
                </div>

                <img src={data?.url} height={"auto"} width={"100%"} />
                {data?.suggestions ? (
                    <div className={styles.remondationsdiv}>
                        <div className={styles.recomendations}>
                            <Button
                                className={styles.button}
                                variant="outlined"
                                onClick={openViewMore}
                            >
                                <div className={styles.btnContent}>
                                    <ImageComponent
                                        src={"/scouting/recommendations-icon.svg"}
                                        height={16}
                                        width={16}
                                    />
                                    Recomendations
                                </div>
                            </Button>
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </div>
            <div>
                {" "}
                <IconButton
                    onClick={() => {
                        captureImageDilogOptions("tag");
                    }}
                >
                    <Image
                        src={"/add-tag-icon-black.svg"}
                        width={20}
                        height={20}
                        alt="pp"
                    />
                </IconButton>
                <IconButton
                    onClick={() => {
                        captureImageDilogOptions("comments");
                    }}
                >
                    <Image
                        src={"/comment-black-icon.svg"}
                        width={20}
                        height={20}
                        alt="pp"
                    />
                </IconButton>
            </div>
            <div>
                {data?.description
                    ? data?.description?.length > 97
                        ? data?.description?.slice(0, 100) + "..."
                        : data?.description
                    : ""}
            </div>
            <div>
                {data?.tags?.slice(0, 3).map((item: string) => {
                    return <Chip label={item} key={item} />;
                })}
                {data?.tags?.length > 3 ? <span>{"... "}</span> : ""}
            </div>
            {data?.tags?.length > 3 ||
                data?.description?.length > 97 ? (
                <span style={{ fontWeight: "bold" }} onClick={openViewMore}>
                    Show More
                </span>
            ) : (
                ""
            )}
            <DrawerComponentForScout
                openCommentsBox={openCommentsBox}
                drawerClose={drawerClose}
                scoutDetails={scoutDetails}
                attachement={data}
            />

            <EditTagsForSingleAttachment
                tagsDrawerClose={tagsDrawerClose}
                captureTagsDetailsEdit={captureTagsDetailsEdit}
                item={data}
                TagsDrawerEditOpen={TagsDrawerEditOpen}
            // loading={loading}
            />
            <ShowMoreInViewAttachmentDetails
                showMoreSuggestions={showMoreSuggestions}
                setShowMoreSuggestions={setShowMoreSuggestions}
                item={data ? data : ""}
            />
            <Toaster closeButton richColors />
        </div>
    );
};

export default SingleImageView;
