import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import timePipe from "@/pipes/timePipe";
import { OnlyImagesType } from "@/types/scoutTypes";
import SellIcon from "@mui/icons-material/Sell";
import { Chip, Dialog, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import getSingleScoutService from "../../../../../lib/services/ScoutServices/getSingleScoutService";
import ScoutingDetails from "./ScoutingDetails";
import styles from "./ScoutingDetails.module.css";
import getSingleImageDetailsService from "../../../../../lib/services/ScoutServices/getSingleScoutService";
import ReactPanZoom from "react-image-pan-zoom-rotate";

interface pageProps {
  onlyImages: Array<OnlyImagesType>;
  previewImageDialogOpen: boolean;
  setPreviewImageDialogOpen: Dispatch<SetStateAction<boolean>>;
  viewAttachmentId: string;
}
const SingleScoutViewDetails = () => {

  const dispatch = useDispatch();
  const router = useRouter();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const [, , removeCookie] = useCookies(["userType"]);
  const [, , loggedIn] = useCookies(["loggedIn"]);

  const [data, setData] = useState<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finalImages, setFinalImages] = useState([]);
  const [curoselOpen, setCuroselOpen] = useState<any>(false);
  const [selectedImage, setSelectedImage] = useState<any>();
  const [content, setContent] = useState<any>();
  const [scoutId, setScoutId] = useState("");
  const [loading, setLoading] = useState(false);
  const [editRecomendationOpen, setEditRecomendationOpen] = useState(false);

  useEffect(() => {
    if (router.isReady && router.query.image_id) {

      getSingleScoutDetails()
    }
  }, [router.isReady, accessToken]);




  const getSingleScoutDetails = async () => {
    setLoading(true);
    try {
      const response = await getSingleImageDetailsService(router.query.image_id, accessToken);
      if (response?.success) {
        setData(response?.data);
      } else if (response?.statusCode == 403) {
        await logout();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      removeCookie("userType");
      loggedIn("loggedIn");
      router.push("/");
      await dispatch(removeUserDetails());
      await dispatch(deleteAllMessages());
    } catch (err: any) {
      console.error(err);
    }
  };


  const updateDescriptionService = async (imagesArray: any, cropId: any) => {
    let updatedArray = data?.attachments?.map((obj: any) => {
      let matchingObj = imagesArray?.find((item: any) => item._id === obj._id);
      return matchingObj ? matchingObj : obj;
    });
    setLoading(true);

    try {
      let options = {
        method: "PATCH",
        headers: new Headers({
          "content-type": "application/json",
          authorization: accessToken,
        }),
        body: JSON.stringify({
          farm_id: data?.farm_id?._id,
          crop_id: cropId,
          attachments: updatedArray,
        }),
      };
      let response: any = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/scouts/${data?._id}`,
        options
      );
      const responseData = await response.json();
      if (responseData?.success == true) {
        setEditRecomendationOpen(false);
        getSingleScoutDetails();
      } else if (responseData?.statusCode == 403) {
        await logout();
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const afterUpdateRecommandations = async (value: any, cropID: any) => {
    if (value.length) {
      await updateDescriptionService(value, cropID);
    }
  };

  return (

    <div className={styles.galleryContainer}>
      <div className={styles.RightImageContainer}>
        <div style={{ position: "relative", padding: "1rem" }}>



          <div
            style={{
              width: "85%",
              margin: "0 auto",
              height: "90vh",
            }}
          >

            <>
              <ReactPanZoom alt={`Image ${data?.key}`} image={data?.url} />

              {/* <img
                className="zoom-image"
                src={data?.url}
                alt={`Image ${data?.key}`}
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "contain",
                }}
              /> */}
            </>
          </div>
          <div
            style={{
              color: "white",
              alignItems: "flex-start",
              padding: "4px 20px 4px 20px",
              justifyContent: "flex-start",
              margin: "0 auto",
              display: "flex",
              width: "85%",
              flexDirection: "row",
            }}
          >
            <Typography variant="caption" sx={{ color: "black" }}>
              {timePipe(
                data?.uploaded_at,
                "DD-MM-YYYY hh.mm a"
              )}
            </Typography>
          </div>
          {data?.tags?.length ? (
            <div
              style={{
                color: "black",
                alignItems: "flex-start",
                padding: "4px 20px 4px 20px",
                justifyContent: "flex-start",
                margin: "0 auto",
                display: "flex",
                width: "85%",
                flexDirection: "row",
              }}
            >
              <Chip
                className={styles.tagsLabel}
                icon={<SellIcon sx={{ fontSize: 15 }} />}
                label="Tags"
                variant="outlined"
              />

              {data?.tags?.length
                ? data?.tags?.map(
                  (item: string, index: number) => {
                    return (
                      <Chip
                        key={index}
                        label={item}
                        className={styles.tagsName}
                        variant="outlined"
                      />
                    );
                  }
                )
                : ""}
            </div>
          ) : ""}

          <div className={styles.AllImagesBlock}>
            {finalImages.map((image: any, index: number) => (
              <div key={index}>
                <div
                  style={{
                    width: "100%",
                    paddingTop: "100%",
                    position: "relative",
                  }}
                >
                  <img
                    src={image.src}
                    alt="Gallery Image"
                    style={{
                      position: "absolute",
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                      top: 0,
                      left: 0,
                      boxShadow: "0px 0px 2px 0px #ffffff5c",
                      zIndex: 0,
                      borderRadius: "8px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.galleryItemDetails}>
        <ScoutingDetails
          setEditRecomendationOpen={setEditRecomendationOpen}
          editRecomendationOpen={editRecomendationOpen}
          loading={loading}
          data={data}
          content={content}
          imageData={data}
          setPreviewImageDialogOpen={""}
          afterUpdateRecommandations={afterUpdateRecommandations}
        />
      </div>
    </div>
  );
};
export default SingleScoutViewDetails;
