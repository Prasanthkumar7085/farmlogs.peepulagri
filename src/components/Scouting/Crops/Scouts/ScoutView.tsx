import timePipe from "@/pipes/timePipe";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import NorthIcon from "@mui/icons-material/North";
import { CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import getImagesByPaginationService from "../../../../../lib/services/ScoutServices/getImagesByPaginationService";
import SingleImageComponent from "./SingleImageComponent";
import styles from "./singleImage.module.css";
import LoadingComponent from "@/components/Core/LoadingComponent";

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

  const getImages = async (page: any) => {
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
        farmId: router.query?.farm_id as string,
        cropId: router.query.crop_id as string,
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

  //scroll to the last element of the previous calls
  const lastItemRef = useRef<HTMLDivElement>(null);
  const scrollToLastItem = () => {
    if (lastItemRef.current) {
      lastItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };


  //api call after the last element was in the dom (visible)
  const observer: any = useRef()
  const lastBookElementRef = useCallback((node: any) => {

    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPageNumber => prevPageNumber + 1)
        getImages(page + 1)
        scrollToLastItem() // Restore scroll position after new data is loaded
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])


  useEffect(() => {
    if (router.isReady) {
      getImages(1);
    }
  }, [accessToken, router.isReady]);


  return (
    <div className={styles.scoutingsView}>
      {isVisible ? (
        <a href="#">
          <div className={styles.scrollToTopLink}>
            <NorthIcon />
          </div>
        </a>
      ) : (
        ""
      )}

      {images.map((item: any, index: number) => {
        if (images.length === index + 1) {
          return (
            <div key={index} ref={lastBookElementRef} id={styles.snapScroll}>
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
                  <span>{timePipe(item.uploaded_at, "DD-MM-YYYY")}</span>
                </Typography>
              </div>
              <SingleImageComponent
                detailedImage={item}
                scoutDetails={scoutDetails}
              />
            </div>
          )
        }
        else {
          return (
            <div key={index} id={styles.snapScroll}>
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
                  <span>{timePipe(item.uploaded_at, "DD-MM-YYYY")}</span>
                </Typography>
              </div>
              <SingleImageComponent
                detailedImage={item}
                scoutDetails={scoutDetails}
              />
            </div>)
        }
      })
      }
      <LoadingComponent loading={loading} />

    </div>

  );
};

export default ScoutView;
