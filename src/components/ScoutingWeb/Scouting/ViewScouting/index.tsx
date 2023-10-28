import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import timePipe from "@/pipes/timePipe";
import { OnlyImagesType } from "@/types/scoutTypes";
import SellIcon from "@mui/icons-material/Sell";
import { Chip, Dialog, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import getSingleScoutService from "../../../../../lib/services/ScoutServices/getSingleScoutService";
import ScoutingDetails from "./ScoutingDetails";
import styles from "./ScoutingDetails.module.css";

interface pageProps {
  onlyImages: Array<OnlyImagesType>;
  previewImageDialogOpen: boolean;
  setPreviewImageDialogOpen: Dispatch<SetStateAction<boolean>>;
  viewAttachmentId: string;
}
const SingleScoutViewDetails: FC<pageProps> = ({
  onlyImages,
  previewImageDialogOpen,
  setPreviewImageDialogOpen,
  viewAttachmentId,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

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
    if (onlyImages?.length && viewAttachmentId) {
      for (let i = 0; i < onlyImages?.length; i++) {
        if (onlyImages[i]._id == viewAttachmentId) {
          setScoutId(onlyImages[i].scout_id);
          setCurrentIndex(i);
        }
      }
    }
  }, [viewAttachmentId]);

  //open curosel
  const openCarousel = (value: any, index: number) => {
    setCuroselOpen(true);
    setCurrentIndex(index);
  };

  const changeImage = (index: number) => {
    setCurrentIndex(index);
    if (onlyImages[index].scout_id !== scoutId) {
      setScoutId(onlyImages[index].scout_id);
    }
  };

  const getSingleScoutDetails = async (id: string) => {
    setLoading(true);
    try {
      const response = await getSingleScoutService(id, accessToken);
      if (response?.success) {
        setData(response?.data);
        changeDescription();
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
      const responseUserType = await fetch("/api/remove-cookie");
      if (responseUserType) {
        const responseLogin = await fetch("/api/remove-cookie");
        if (responseLogin.status) {
          router.push("/");
        } else throw responseLogin;
      }
      await dispatch(removeUserDetails());
      await dispatch(deleteAllMessages());
    } catch (err: any) {
      console.error(err);
    }
  };
  const changeDescription = () => {
    if (onlyImages?.length) {
      const lines = onlyImages[currentIndex]?.description?.split("\n");
      setContent(lines);
    }
  };
  useEffect(() => {
    if (scoutId) {
      getSingleScoutDetails(scoutId);
    }
  }, [scoutId]);
  useEffect(() => {
    changeDescription();
  }, [currentIndex]);

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
        getSingleScoutDetails(scoutId);
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
    <Dialog
      open={previewImageDialogOpen}
      fullScreen
      onClose={() => setPreviewImageDialogOpen(false)}
      sx={{
        "& .MuiPaper-root": {
          background: "#00000063",
        },
      }}
    >
      <Grid container>
        <Grid xs={8} className={styles.RightImageContainer}>
          <div style={{ position: "relative", padding: "1rem" }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 9,
                width: "100%",
                height: "100%",
                zIndex: 5,
              }}
            >
              <div
                onWheel={(e: any) => {
                  if (e.deltaY > 0 && e.deltaY % 20 == 0) {
                    setCurrentIndex((prev) => prev + 1);
                  } else {
                    if (e.deltaY % 20 == 0) {
                      setCurrentIndex((prev) => prev - 1);
                    }
                  }
                }}
              >
                <Carousel
                  selectedItem={currentIndex}
                  onChange={(index) => changeImage(index)}
                  swipeable={true}
                  autoFocus
                  showThumbs={false}
                  className={styles.galleryView}
                >
                  {onlyImages.map((item: any, index: any) => (
                    <div
                      key={index}
                      style={{
                        width: "85%",
                        margin: "0 auto",
                        height: "90vh",
                      }}
                    >
                      {item.type?.includes("video") ? (
                        <video
                          controls
                          width="100%"
                          height={"100%"}
                          autoPlay
                          key={index}
                        >
                          <source src={item.original} type={item.type} />
                          Your browser does not support the video tag.
                        </video>
                      ) : item.type?.includes("application") ? (
                        <iframe
                          src={item.original}
                          width="100%"
                          height="100%"
                          title={`iframe-${index}`}
                        />
                      ) : (
                        <>
                          <img
                            className="zoom-image"
                            src={item.src}
                            alt={`Image ${index + 1}`}
                            style={{
                              height: "100%",
                              width: "100%",
                              objectFit: "contain",
                            }}
                          />
                        </>
                      )}
                    </div>
                  ))}
                </Carousel>
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
                  <Typography variant="caption">
                    {timePipe(
                      onlyImages[currentIndex]?.time,
                      "DD-MM-YYYY hh.mm a"
                    )}
                  </Typography>
                </div>
                {onlyImages[currentIndex]?.tags?.length ? (
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
                    <Chip
                      className={styles.tagsLabel}
                      icon={<SellIcon sx={{ fontSize: 15 }} />}
                      label="Tags"
                      variant="outlined"
                    />

                    {onlyImages?.length &&
                    onlyImages[currentIndex]?.tags?.length
                      ? onlyImages[currentIndex]?.tags?.map(
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
                ) : (
                  ""
                )}
              </div>
            </div>
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
                      onClick={() => openCarousel(image, index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Grid>
        <Grid xs={4} sx={{ zIndex: 100, background: "#fff" }}>
          <ScoutingDetails
            setEditRecomendationOpen={setEditRecomendationOpen}
            editRecomendationOpen={editRecomendationOpen}
            loading={loading}
            data={data}
            content={content}
            imageData={onlyImages[currentIndex]}
            setPreviewImageDialogOpen={setPreviewImageDialogOpen}
            afterUpdateRecommandations={afterUpdateRecommandations}
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};
export default SingleScoutViewDetails;
