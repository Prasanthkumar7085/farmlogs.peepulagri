import { Card, Dialog, Grid, IconButton, Typography } from "@mui/material";
import ScoutingDetails from "./ScoutingDetails";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import getSingleScoutService from "../../../../../lib/services/ScoutServices/getSingleScoutService";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import CloseIcon from "@mui/icons-material/Close";
import LoadingComponent from "@/components/Core/LoadingComponent";
import styles from "./ScoutingDetails.module.css";
import { OnlyImagesType, ScoutAttachmentDetails } from "@/types/scoutTypes";

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
        const lines = response?.data?.findings?.split("\n");
        setContent(lines);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getSingleScoutDetails(scoutId);
  }, [scoutId]);

  return (
    <Dialog
      open={previewImageDialogOpen}
      fullScreen
      onClose={() => setPreviewImageDialogOpen(false)}
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
                  onChange={(index) => changeImage(index)}
                  swipeable={true}
                >
                  {onlyImages.map((item: any, index: any) => (
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
            <ScoutingDetails
              loading={loading}
              data={data}
              content={content}
              setPreviewImageDialogOpen={setPreviewImageDialogOpen}
            />
          </Card>
        </Grid>
      </Grid>
    </Dialog>
  );
};
export default SingleScoutViewDetails;