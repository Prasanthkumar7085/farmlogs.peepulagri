import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import getImagesByPaginationService from "../../../../../lib/services/ScoutServices/getImagesByPaginationService";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { useSelector } from "react-redux";
import SingleImageComponent from "./SingleImageComponent";
import timePipe from "@/pipes/timePipe";
import { Divider, Typography } from "@mui/material";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import styles from "./singleImage.module.css";
interface ApiProps {
  page: number;
}
const ScoutView = () => {
  const router = useRouter();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [scoutDetails, setScoutDetails] = useState({});

  const getImages = async ({ page = 1 }: Partial<ApiProps>) => {
    setLoading(true);
    try {
      let response = await getImagesByPaginationService({
        page: 1,
        id: router.query?.scout_id as string,
        accessToken: accessToken,
      });

      if (response.status >= 200 && response.status <= 300) {
        const { attachments, ...rest } = response?.data;
        setImages(attachments);
        setScoutDetails(rest);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (router.isReady) {
      getImages({ page: 1 });
    }
  }, [router.isReady]);
  return (
    <div>
      <div>
        {images.length
          ? images.map((item: any, index: number) => {
              return (
                <div key={index}>
                  <div
                    style={{
                      position: "sticky",
                      top: "120px",
                      paddingTop: "20px",
                      background: "#f5f7fa",
                      zIndex: 2,
                    }}
                  >
                    <Typography className={styles.postDate}>
                      <InsertInvitationIcon />
                      <span>{timePipe(item.time, "DD-MM-YYYY")}</span>
                    </Typography>
                  </div>
                  <SingleImageComponent
                    detailedImage={item}
                    scoutDetails={scoutDetails}
                    getImageData={getImages}
                  />
                </div>
              );
            })
          : !loading
          ? "No Data"
          : ""}
      </div>

      <LoadingComponent loading={loading} />
    </div>
  );
};

export default ScoutView;
