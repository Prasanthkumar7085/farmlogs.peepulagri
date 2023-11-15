import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import getImagesByPaginationService from "../../../../../lib/services/ScoutServices/getImagesByPaginationService";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { useSelector } from "react-redux";
import SingleImageComponent from "./SingleImageComponent";
import timePipe from "@/pipes/timePipe";
import { CircularProgress, Divider, Typography } from "@mui/material";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import styles from "./singleImage.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import NorthIcon from "@mui/icons-material/North";
import useScrollSnap from "react-use-scroll-snap";

interface ApiProps {
  date: string;
}
const ScoutView = () => {
  const router = useRouter();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<any>([]);
  const [scoutDetails, setScoutDetails] = useState({});
  const [hasMore, setHasMore] = useState(true);

  const groupBy = (data: any[]) => {
    let sortedData = [...data];
    sortedData.sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return sortedData;
  };

  const getImages = async ({
    date = new Date().toISOString(),
  }: Partial<ApiProps>) => {
    setLoading(true);
    try {
      //dummy Api
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_DUMMY}/farms/12212/crops/123/farm-images/next/50/${date}`
      );

      let responseData = await response.json();
      if (responseData.status >= 200 && responseData.status <= 300) {
        const { data, ...rest } = responseData?.data;
        let modifiedData = groupBy([...images, ...data]);
        setImages(modifiedData);

        // setHasMore(rest.has_more);
      }

      // let response = await getImagesByPaginationService({
      //   date: 1,
      //   id: router.query?.scout_id as string,
      //   accessToken: accessToken,
      // });

      // if (response.status >= 200 && response.status <= 300) {
      //   const { attachments, ...rest } = response?.data;
      //   setImages(attachments);
      //   setScoutDetails(rest);
      // }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show the button when the user scrolls down 20 pixels or more
      if (window.scrollY > 20) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Attach the event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (router.isReady) {
      getImages({});
    }
  }, [router.isReady]);

  return (
    <div style={{ marginTop: "4rem" }}>
      {isVisible ? (
        <a href="#">
          <div className={styles.scrollToTopLink}>
            <NorthIcon />
          </div>
        </a>
      ) : (
        ""
      )}
      {/* <InfiniteScroll
        className={styles.infiniteScrollComponent}
        dataLength={images.length}
        next={() => {
          setPage((prev) => prev + 1);
          getImages({
            date: images.length
              ? images.slice(-1)[0]?.created_at
              : new Date().toISOString(),
          });
        }}
        hasMore={true}
        loader={
          <div className={styles.pageLoader}>
            {loading ? <CircularProgress /> : ""}
          </div>
        }
        endMessage={
          hasMore ? (
            ""
          ) : (
            <div className={styles.noMoreImages}>
              <p>No more Images</p>
            </div>
          )
        }
      > */}
      {images.length
        ? images.map((item: any, index: number) => {
            return (
              <div key={index} className={styles.snapScroll}>
                <div
                  style={{
                    position: "sticky",
                    top: "110px",
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
      {/* </InfiniteScroll> */}
    </div>
  );
};

export default ScoutView;



  // <div>
      // {isVisible ? (
      //   <a href="#">
      //     <div className={styles.scrollToTopLink}>
      //       <NorthIcon />
      //     </div>
      //   </a>
      // ) : (
      //   ""
      // )}
  //     <div>
        // <InfiniteScroll
        //   className={styles.infiniteScrollComponent}
        //   dataLength={images.length}
        //   next={() => {
        //     setPage((prev) => prev + 1);
        //     getImages({
        //       date: images.length
        //         ? images.slice(-1)[0]?.created_at
        //         : new Date().toISOString(),
        //     });
        //   }}
        //   hasMore={true}
        //   loader={
        //     <div className={styles.pageLoader}>
        //       {loading ? <CircularProgress /> : ""}
        //     </div>
        //   }
        //   endMessage={
        //     hasMore ? (
        //       ""
        //     ) : (
        //       <div className={styles.noMoreImages}>
        //         <p>No more Images</p>
        //       </div>
        //     )
        //   }
        // >
  //         {images.length
  //           ? images.map((item: any, index: number) => {
  //               return (
  //                 <div key={index}>
  //                   <div
                    // style={{
                    //   position: "sticky",
                    //   top: "110px",
                    //   paddingTop: "20px",
                    //   background: "#f5f7fa",
                    //   zIndex: 2,
                    // }}
  //                   >
  //                     <Typography className={styles.postDate}>
  //                       <InsertInvitationIcon />
  //                       <span>{timePipe(item.created_at, "DD-MM-YYYY")}</span>
  //                     </Typography>
  //                   </div>
  //                   <SingleImageComponent
  //                     detailedImage={item}
  //                     scoutDetails={scoutDetails}
  //                     getImageData={getImages}
  //                   />
  //                 </div>
  //               );
  //             })
  //           : !loading
  //           ? "No Data"
  //           : ""}
  //       </InfiniteScroll>
  //     </div>
  //   </div>