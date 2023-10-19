import { Card, Dialog, Grid, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import CloseIcon from "@mui/icons-material/Close";
import LoadingComponent from "@/components/Core/LoadingComponent";
import styles from "../Scouting/ViewScouting/ScoutingDetails.module.css";
import getSingleScoutService from "../../../../lib/services/ScoutServices/getSingleScoutService";
import ScoutingDetails from "../Scouting/ViewScouting/ScoutingDetails";
const SingleScoutView = () => {
  const router = useRouter();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finalImages, setFinalImages] = useState([]);
  const [curoselOpen, setCuroselOpen] = useState<any>(false);
  const [selectedImage, setSelectedImage] = useState<any>();
  const [content, setContent] = useState<any>();

  const getSingleScout = async () => {
    setLoading(true);
    try {
      const response = await getSingleScoutService(
        router.query.scout_id as string,
        accessToken
      );
      if (response?.success) {
        setData(response?.data);
        const lines = response?.data?.findings?.split("\n");
        setContent(lines);
        getModifiedImages({ attachmentdetails: response.data.attachments });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getModifiedImages = ({ attachmentdetails }: any) => {
    let details = [];
    if (attachmentdetails.length) {
      details = attachmentdetails.map((item: any, index: number) => {
        if (item.type.includes("video")) {
          return {
            src: "/videoimg.png",
            height: 80,
            width: 60,
            type: item.type,
            caption: `${index + 1} image`,
            original: item?.url,
          };
        } else if (item.type.includes("application")) {
          return {
            src: "/pdf-icon.png",
            height: 80,
            width: 60,
            type: item.type,
            caption: `${index + 1} image`,
            original: item.url,
          };
        } else {
          return {
            src: item.url,
            height: 80,
            width: 60,
            type: item.type,
          };
        }
      });
    }
    setFinalImages(details);
  };

  //open curosel
  const openCarousel = (value: any, index: number) => {
    setCuroselOpen(true);
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (router.isReady) {
      getSingleScout();
    }
  }, [accessToken, router.isReady]);

  return (
    <div>
      <Grid container>
        <Grid xs={8} className={styles.RightImageContainer}>
          <div style={{ position: "relative", padding: "1rem" }}>
            {curoselOpen && (
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
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    flexDirection: "column",
                    justifyContent: "center",
                    background: "#06060687",
                  }}
                >
                  <IconButton
                    onClick={() => setCuroselOpen(false)}
                    sx={{ cursor: "pointer" }}
                  >
                    <CloseIcon
                      sx={{ color: "#fff", height: "32px", width: "32px" }}
                    />
                  </IconButton>
                  <Carousel
                    selectedItem={currentIndex}
                    onChange={(index) => setCurrentIndex(index)}
                    swipeable={true}
                  >
                    {finalImages.map((item: any, index: any) => (
                      <div
                        key={index}
                        style={{
                          width: "85%",
                          margin: "0 auto",
                          height: "80vh",
                          marginTop: "2rem",
                        }}
                      >
                        {item.type?.includes("video") ? (
                          <video controls width="100%" autoPlay key={index}>
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
                </div>
              </div>
            )}
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
                        // border: '1px solid #a2a5a9',
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
        <Grid xs={4}>
          <Card sx={{ zIndex: 100 }}>
            <ScoutingDetails data={data} content={content} />
          </Card>
        </Grid>
      </Grid>
      <LoadingComponent loading={loading} />
    </div>
  );
};
export default SingleScoutView;
