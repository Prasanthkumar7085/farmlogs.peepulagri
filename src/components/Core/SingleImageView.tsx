import EditTagsForSingleAttachment from "@/components/Core/EditTagsForSingleAttachment";
import { IconButton, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import ReactPanZoom from "react-image-pan-zoom-rotate";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import DrawerComponentForScout from "../Scouting/Comments/DrawerBoxForScout";
import styles from "../Scouting/Crops/Scouts/singleImage.module.css";
import LoadingComponent from "./LoadingComponent";

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
  const router = useRouter();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [TagsDrawerEditOpen, setTagsDrawerEditOpen] = useState<any>(false);
  const cropTitle = useSelector((state: any) => state?.farms?.cropName);
  const farmTitle = useSelector((state: any) => state?.farms?.farmName);
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
      let body = {
        farm_image_ids: [data._id],
        tags: tags,
      };
      let options = {
        method: "POST",
        headers: new Headers({
          "content-type": "application/json",
          authorization: accessToken,
        }),
        body: JSON.stringify(body),
      };

      let response: any = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/farm-images/tag`,
        options
      );
      let responseData = await response.json();
      if (response?.status >= 200 && response?.status <= 200) {
        toast.success(responseData?.message);
        setTagsDrawerEditOpen(false);
        await getSingleImageDetails();
      } else {
        toast.error(responseData?.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdateAttachmentLoading(false);
    }
  };

  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<any>();
  //get the get image details api
  const getSingleImageDetails = async () => {
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
      console.log(responseData, "asdfw");

      if (responseData.success) {
        setData(responseData?.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  //call the api
  useEffect(() => {
    if (router.isReady && accessToken) {
      getSingleImageDetails();
    }
  }, [router.isReady, accessToken]);

  return (
    <div>
      <div className={styles.overlay}>
        {/* <div style={{ position: "fixed", width: "100%", zIndex: "1", maxWidth: "500px" }}> */}

        <div className={styles.singleImageViewHeader}>
          <img
            alt=""
            src="/iconsiconarrowleft.svg"
            onClick={() => router.back()}
            width={"25px"}
          />
          <Typography>
            {(data?.farm_id?.title
              ? data?.farm_id?.title[0]?.toUpperCase() +
              data?.farm_id?.title?.slice(1)
              : "") +
              "/" +
              (data?.crop_id?.title
                ? data?.crop_id?.title[0]?.toUpperCase() +
                data?.crop_id?.title?.slice(1)
                : "")}
          </Typography>
          <div className={styles.headericon} id="header-icon"></div>


        </div>
        {/* </div> */}

        {/* <div
          style={{
            height: "calc(100vh - 61px)",
            width: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {loading ? (
            ""
          ) : (
            <ReactPanZoom alt={`${data?.key}`} image={data?.url} />
          )}
        </div> */}
        <div style={{
          height: "calc(100vh - 115px)",
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}>
          {data?.url ?
            <img src={data?.url} alt={`${data?.key}`} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : ""}
        </div>
      </div>
      <div className={styles.imgDetailButtons}>
        <div className={styles.ButtonGrp}>
          <IconButton
            sx={{ borderRadius: "25px 0 0 25px" }}
            className={styles.singleBtn}
            onClick={() => {
              captureImageDilogOptions("tag");
            }}
          >
            <Image
              src={"/mobileIcons/scouting/tag-light.svg"}
              width={25}
              height={25}
              alt="pp"
            />
          </IconButton>
          <IconButton
            sx={{ borderRadius: "0 25px 25px 0" }}
            className={styles.singleBtn}
            onClick={() => {
              captureImageDilogOptions("comments");
            }}
          >
            <Image
              src={"/mobileIcons/scouting/chat-circle-light.svg"}
              width={25}
              height={25}
              alt="pp"
            />
          </IconButton>
        </div>
      </div>

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
      />

      <LoadingComponent loading={loading} />
      <Toaster richColors closeButton position="top-right" />
    </div>
  );
};

export default SingleImageView;
