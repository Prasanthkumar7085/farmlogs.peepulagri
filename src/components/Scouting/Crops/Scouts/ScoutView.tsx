import LoadingComponent from "@/components/Core/LoadingComponent";
import timePipe from "@/pipes/timePipe";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import NorthIcon from "@mui/icons-material/North";
import { CircularProgress, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getImagesByPaginationService from "../../../../../lib/services/ScoutServices/getImagesByPaginationService";
import SingleImageComponent from "./SingleImageComponent";
import styles from "./singleImage.module.css";
import InfiniteScroll from "react-infinite-scroll-component";

interface ApiProps {
  page: string | number;
}
const ScoutView = () => {
  const router = useRouter();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const [page, setPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<any>([]);
  const [scoutDetails, setScoutDetails] = useState({});
  const [hasMore, setHasMore] = useState(true);

  const getImages = async ({ page = 1 }: Partial<ApiProps>) => {
    setLoading(true);
    let options = {
      method: "GET",

      headers: new Headers({
        "content-type": "application/json",
        authorization: accessToken,
      }),
    };
    try {
      let response = await getImagesByPaginationService({
        page: page,
        farmId: router.query?.farmId as string,
        cropId: router.query.cropId as string,
        accessToken: accessToken,
      });
      if (response.success) {
        setHasMore(response?.has_more);
        setImages([...images, ...response?.data]);
        // setHasMore(rest.has_more);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (router.isReady) {
      getImages({});
    }
  }, [ accessToken, router.isReady])




  // useEffect(() => {
  //   if (router.isReady) {
  //     getImages({});
  //   }
  // }, [router.isReady, accessToken]);

  return (
    <div>
      {isVisible ? (
        <a href="#">
          <div className={styles.scrollToTopLink}>
            <NorthIcon />
          </div>
        </a>
      ) : (
        ""
      )}
      <InfiniteScroll
        className={styles.infiniteScrollComponent}
        dataLength={images.length}
        next={() => {
          setPage((prev) => prev + 1);
          getImages({ page: page + 1 });
        }}
        hasMore={hasMore}
        loader
        endMessage={
          hasMore ? (
            ""
          ) : (
            <div className={styles.noMoreImages}>
              <p>No more Images</p>
            </div>
          )
        }
      >
        {images.length
          ? images.map((item: any, index: number) => {
              return (
                <div key={index} className={styles.snapScroll}>
                  <div
                    style={{
                      position: "sticky",
                      top: "0px",
                      paddingTop: "20px",
                      background: "#f5f7fa",
                      zIndex: 2,
                    }}
                  >
                    <Typography className={styles.postDate}>
                      <InsertInvitationIcon />
                      <span>{timePipe(item.created_at, "DD-MM-YYYY")}</span>
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
      </InfiniteScroll>
      {loading ? <CircularProgress /> : ""}
      {/* <LoadingComponent loading={loading}/> */}
    </div>
  );
};

export default ScoutView;

