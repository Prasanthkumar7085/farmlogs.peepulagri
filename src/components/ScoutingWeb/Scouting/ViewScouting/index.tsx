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
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'; import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { toast } from "sonner";
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
  const [prevHasMore, setPrevHasMore] = useState<any>(false)
  const [prevData, setPrevData] = useState<any>()
  const [reachedStatus, setReachedStatus] = useState<any>(false)

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
    let url;
    if (router.query.farm_id || router.query.crop_id) {
      url = `${process.env.NEXT_PUBLIC_API_URL}/crops/${router.query.crop_id}/images/${lastImage_id}/pre/2`
    }
    else {
      url = `${process.env.NEXT_PUBLIC_API_URL}/farm-images/${lastImage_id}/pre/2`
    }
    try {

      const response = await fetch(
        url,
        options
      );
      const responseData = await response.json();
      if (responseData.success) {
        console.log(responseData?.data, "data")
        if (responseData?.data?.length == 1 && responseData?.has_more == false) {
          toast.error("You have reached to end")
          return
        }
        // knowAboutPrevImageDetails(responseData?.data[0]?._id)

        if (responseData?.has_more) {
          if (data?.length) {
            setHasMore(responseData?.has_more);
            setData([...responseData?.data]);
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


  const getInstaScrollImagePrevDetails = async (lastImage_id: any) => {
    setLoading(true);
    let options = {
      method: "GET",
      headers: new Headers({
        authorization: accessToken,
      }),
    };

    let url;
    if (router.query.farm_id || router.query.crop_id) {
      url = `${process.env.NEXT_PUBLIC_API_URL}/crops/${router.query.crop_id}/images/${lastImage_id}/next/2`
    }
    else {
      url = `${process.env.NEXT_PUBLIC_API_URL}/farm-images/${lastImage_id}/next/2`
    }

    try {
      const response = await fetch(
        url,
        options
      );
      const responseData = await response.json();
      if (responseData.success) {
        if (responseData?.data?.length == 1 && responseData?.has_more == false) {
          toast.error("You have reached to end")
          return
        }
        if (responseData?.has_more) {
          if (prevData?.length) {
            setPrevHasMore(responseData?.has_more);
            setPrevData([...responseData?.data]);
            setData([])
          }
          else {
            setPrevHasMore(responseData?.has_more);
            let temp = [...responseData?.data]
            const uniqueObjects = Array.from(
              temp.reduce((acc, obj) => acc.set(obj._id, obj), new Map()).values()
            );
            setPrevData(temp);
            setData([])

          }

        }

        else {
          setPrevHasMore(false);
          setPrevData(responseData?.data);
          setData([])

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


  useEffect(() => {
    if (router.isReady && accessToken) {
      getInstaScrollImageDetails(router.query.image_id);

      // knowAboutPrevImageDetails(router.query.image_id)
    }
  }, [router.isReady, accessToken]);




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
                position: "relative"
              }}
            >

              <>
                <ReactPanZoom alt={data[0]?.key ? `Image ${data[0]?.key}` : ""} image={data[0]?.url} />
                <div className={styles.imgPrevNextBtnGrp}  >
                  <Button
                    className={prevHasMore ? styles.disableBtn : styles.prevBtn}
                    onClick={() => {
                      setCurrentIndex((pre: any) => pre - 1)
                      getInstaScrollImagePrevDetails(data[0]?._id)
                      if (router.query.farm_id || router.query.crop_id) {
                        router.push({
                          pathname: `/scouts/farm/${router.query.farm_id}/crops/${router.query.crop_id}/${data[0]?._id}/`,
                          query: {},
                        });
                      }
                      else {
                        router.push({
                          pathname: `/scouts/${data[0]?._id}/`,
                          query: {},
                        });
                      }


                    }}
                    disabled={loading ? true : false}
                  >
                    <KeyboardArrowLeftIcon sx={{ fontSize: "2rem", color: "red" }} />
                  </Button>
                  <Button
                    className={hasMore ? styles.prevBtn : styles.prevBtn}
                    onClick={() => {
                      setCurrentIndex((pre: any) => pre + 1)
                      getInstaScrollImageDetails(data[1]?._id)
                      if (router.query.farm_id || router.query.crop_id) {
                        router.push({
                          pathname: `/scouts/farm/${router.query.farm_id}/crops/${router.query.crop_id}/${data[1]?._id}/`,
                          query: {},
                        });
                      }
                      else {
                        router.push({
                          pathname: `/scouts/${data[1]?._id}/`,
                          query: {},
                        });
                      }

                      setPrevData([])


                    }}
                    disabled={loading ? true : false}

                  >

                    <KeyboardArrowRightIcon sx={{ fontSize: "2rem", color: "red" }} />
                  </Button>
                </div>

              </>
            </div> :
            <div
              className={styles.ImageContainBlock}
              style={{
                width: "85%",
                margin: "0 auto",
                height: "90vh",
                position: "relative"
              }}
            >

              <>
                <ReactPanZoom alt={prevData?.length ? prevData[0]?.key : "" ? `Image ${prevData?.length ? prevData[0]?.key : ""}` : "Image"} image={prevData?.length ? prevData[1]?.url : ''} />
                <div className={styles.imgPrevNextBtnGrp}  >
                  <Button
                    className={prevHasMore ? styles.nextBtn : styles.prevBtn}
                    onClick={() => {
                      setCurrentIndex((pre: any) => pre - 1)
                      getInstaScrollImagePrevDetails(prevData?.length ? prevData[1]?._id : "")
                      if (router.query.farm_id || router.query.crop_id) {
                        router.push({
                          pathname: `/scouts/farm/${router.query.farm_id}/crops/${router.query.crop_id}/${prevData?.length ? prevData[1]?._id : ""}/`,
                          query: {},
                        });
                      }
                      else {
                        router.push({
                          pathname: `/scouts/${prevData?.length ? prevData[1]?._id : ""}/`,
                          query: {},
                        });
                      }

                      setData([])



                    }}
                    disabled={loading ? true : false}

                  >
                    <KeyboardArrowLeftIcon sx={{ fontSize: "2rem", color: "red" }} />
                  </Button>
                  <Button
                    className={hasMore ? styles.nextBtn : styles.nextBtn}
                    onClick={() => {
                      setCurrentIndex((pre: any) => pre + 1)
                      getInstaScrollImageDetails(prevData?.length ? prevData[0]?._id : "")
                      if (router.query.farm_id || router.query.crop_id) {
                        router.push({
                          pathname: `/scouts/farm/${router.query.farm_id}/crops/${router.query.crop_id}/${prevData?.length ? prevData[0]?._id : ""}/`,
                          query: {},
                        });
                      }
                      else {
                        router.push({
                          pathname: `/scouts/${prevData?.length ? prevData[0]?._id : ""}/`,
                          query: {},
                        });
                      }

                      setPrevData([])


                    }}
                    disabled={loading ? true : false}

                  >

                    <KeyboardArrowRightIcon sx={{ fontSize: "2rem", color: "red" }} />
                  </Button>
                </div>

              </>
            </div>}





        </div>
      </div>
      {data?.length && router.isReady ?
        <div className={styles.galleryItemDetails}>
          <ScoutingDetails
            loading={loading}
            data={data[0]}
            currentIndex={currentIndex}

          />
        </div> :
        <div className={styles.galleryItemDetails}>
          <ScoutingDetails
            loading={loading}
            data={prevData?.length ? prevData[1] : ""}
            currentIndex={currentIndex}

          />
        </div>}


    </div>
  );
};
export default SingleScoutViewDetails;
