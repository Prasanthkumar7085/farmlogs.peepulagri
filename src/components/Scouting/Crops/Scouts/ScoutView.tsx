import timePipe from "@/pipes/timePipe";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import NorthIcon from "@mui/icons-material/North";
import { CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SingleImageComponent from "./SingleImageComponent";
import styles from "./singleImage.module.css";
import InfiniteScroll from "react-infinite-scroll-component";

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
  const [uniqueIndex, setUniqueIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);



  const getImages = async ({
    date = new Date().toISOString(),
  }: Partial<ApiProps>) => {
    setLoading(true);
    let options = {
      method: "GET",

      headers: new Headers({
        "content-type": "application/json",
        authorization: accessToken,
      }),
    };
    try {
      //dummy Api
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/farms/${router.query.farm_id}/crops/${router.query.crop_id}/farm-images/${pageNumber}/50`,
        options);

      let responseData = await response.json();
      if (responseData.success == true) {
        if (responseData?.has_more || responseData?.has_more == false) {
          setHasMore(responseData?.has_more);
        }
        let temp: any;
        temp = [...responseData?.data];
        setImages(temp);
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
    getImages({});
  }, [pageNumber])




  useEffect(() => {
    if (router.isReady) {
      getImages({});
    }
  }, [router.isReady, accessToken]);

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
      <InfiniteScroll
        className={styles.infiniteScrollComponent}
        dataLength={images.length}
        next={() => setPageNumber(prev => prev + 1)}
        hasMore={hasMore}
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
      >
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
        {loading ? <CircularProgress /> : ""}
      </InfiniteScroll>
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
