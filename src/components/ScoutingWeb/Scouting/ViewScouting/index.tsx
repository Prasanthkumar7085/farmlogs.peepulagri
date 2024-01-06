import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import timePipe from "@/pipes/timePipe";
import { OnlyImagesType } from "@/types/scoutTypes";
import SellIcon from "@mui/icons-material/Sell";
import { Button, Chip, Dialog, Typography } from "@mui/material";
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
import LoadingComponent from "@/components/Core/LoadingComponent";

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
  const [, , removeCookie] = useCookies(["userType_v2"]);
  const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [data, setData] = useState<any>();
  const [content, setContent] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [editRecomendationOpen, setEditRecomendationOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<any>(0)



  // const getSingleScoutDetails = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await getSingleImageDetailsService(
  //       router.query.image_id,
  //       accessToken
  //     );
  //     if (response?.success) {
  //       setData(response?.data);
  //     } else if (response?.statusCode == 403) {
  //       await logout();
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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



  const getInstaScrollImageDetails = async (lastImage_id: any) => {
    setLoading(true);
    let options = {
      method: "GET",
      headers: new Headers({
        authorization: accessToken,
      }),
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/crops/${router.query.crop_id}/images/${lastImage_id}/pre/20`,
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
        logout()
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  //call the api
  useEffect(() => {
    if (router.isReady && accessToken) {
      getInstaScrollImageDetails(router.query.image_id);
    }
  }, [router.isReady, accessToken, router.query.image_id]);


  return (

    <div className={styles.galleryContainer}>
      <div className={styles.RightImageContainer}>
        <div style={{ position: "relative", padding: "1rem" }}>


          {data?.length ?
            <div
              className={styles.ImageContainBlock}
              style={{
                width: "85%",
                margin: "0 auto",
                height: "90vh",
              }}
            >

              <>
                <ReactPanZoom alt={data?.key ? `Image ${data?.key}` : "Image"} image={data[currentIndex]?.url} />
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", gap: "1.5rem" }}>
                  <Button
                    variant="outlined"
                    onClick={() => setCurrentIndex((pre: any) => pre - 1)}
                    disabled={currentIndex == 0 ? true : false}
                  >PREV</Button>
                  <Button
                    variant="contained"
                    onClick={() => setCurrentIndex((pre: any) => pre + 1)}
                    disabled={currentIndex == data?.length - 1 ? true : false}
                  >Next</Button>
                </div>
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
            </div> : ""}



        </div>
      </div>
      {data?.length ?
        <div className={styles.galleryItemDetails}>
          <ScoutingDetails
            loading={loading}
            data={data}
            currentIndex={currentIndex}

          />
        </div> : ''}
    </div>
  );
};
export default SingleScoutViewDetails;
