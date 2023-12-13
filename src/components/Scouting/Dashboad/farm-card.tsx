import timePipe from "@/pipes/timePipe";
import { FarmDataType } from "@/types/farmCardTypes";
import { useRouter } from "next/router";
import { useCallback, useRef } from "react";
import styles from "./farm-card.module.css";

interface pagePropsType {
  farmsData: Array<FarmDataType>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  getAllFarms: any;
  hasMore: boolean;
  loading: boolean;
}
const FarmCard = ({
  farmsData,
  page,
  setPage,
  getAllFarms,
  hasMore,
  loading,
}: pagePropsType) => {
  const router = useRouter();
  let searchFromRouter = router.query?.search_string;
  let locationFromRouter = router.query?.location_id;

  let colorsArray = [
    "#C71585",
    "#7B68EE",
    "#FF8C00",
    "#008080",
    "#2E8B57",
    "#4682B4",
    "#000080",
    "#3D3D5B",
    "#CC0044",
    "#BA55D3",
    "#663399",
    "#8B0000",
    "#FF4500",
    "#DA0E0E",
    "#00CED1",
    "#4169E1",
    "#A52A2A",
    "#2D1E2F",
    "#714E47",
    "#C65B7C",
    "#A04662",
    "#FE654F",
    "#5F6A89",
    "#067BBD",
  ];
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
  // useEffect(() => {
  //   // Scroll to the last item when new data is loaded
  //   scrollToLastItem();
  // }, [farmsData]);

  //api call after the last element was in the dom (visible)
  const observer: any = useRef();

  const lastBookElementRef = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && farmsData.length > 0) {
          setPage((prev) => prev + 1);
          getAllFarms({
            page: page + 1,
            search_string: searchFromRouter as string,
            location: locationFromRouter as string,
            addData: true,
          });
          scrollToLastItem(); // Restore scroll position after new data is loaded
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className={styles.allForms}>
      <div className={styles.allFormsBlock}>
        {farmsData.length
          ? farmsData.map((item: FarmDataType, index: number) => {
              if (farmsData.length === index + 1 && hasMore == true) {
                return (
                  <div
                    className={styles.farmcard}
                    id="farm-card"
                    key={index}
                    ref={lastBookElementRef}
                  >
                    <div className={styles.farm} id="farm">
                      <div
                        className={styles.count}
                        onClick={() => router.push(`farms/${item._id}`)}
                      >
                        <img
                          src="/mobileIcons/farms/info.svg"
                          width={25}
                          alt="image"
                        />
                        {/* <span>{item?.crops_count}</span> */}
                      </div>
                      <div
                        className={styles.farmdetails}
                        id="farm-detalis"
                        onClick={() =>
                          router.push(
                            `farms/${item._id}/crops?search_string=${item.title}`
                          )
                        }
                      >
                        <div
                          className={styles.duration}
                          style={{ marginBottom: "0.5rem" }}
                          id="duration"
                        >
                          <div className={styles.dates}>
                            {timePipe(item.createdAt, "DD, MMM YYYY")}
                          </div>
                        </div>
                        <div
                          className={styles.farm1}
                          style={{ color: "#D94841" }}
                        >
                          {item.title.length > 16
                            ? item.title.slice(0, 1).toUpperCase() +
                              item.title.slice(1, 12) +
                              "..."
                            : item.title[0].toUpperCase() + item.title.slice(1)}
                        </div>

                        {/* <div className={styles.location}>
                  {!loading && location && location == 'All' ?<div className={styles.locationArea}>
                        {item?.location.length > 13 ? item?.location.slice(0, 10) + '...' : item?.location}
                    </div>:""}
                  </div> */}
                      </div>
                      <div
                        className={styles.farmareablock}
                        id="farm-area-block"
                      >
                        <div
                          className={styles.farmarea}
                          id="farm-area"
                          onClick={() => router.push(`farms/${item._id}/crops`)}
                        >
                          <div className={styles.area}>
                            <div className={styles.acres}>
                              {item?.area
                                ? Math.floor(item?.area * 100) / 100
                                : ""}{" "}
                              Acres
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    className={styles.farmcard}
                    id="farm-card"
                    key={index}
                    ref={index === farmsData.length - 20 ? lastItemRef : null}
                  >
                    <div className={styles.farm} id="farm">
                      <div
                        className={styles.count}
                        onClick={() => router.push(`farms/${item._id}`)}
                      >
                        <img
                          src="/mobileIcons/farms/info.svg"
                          width={25}
                          alt="image"
                        />
                        {/* <span>{item?.crops_count}</span> */}
                      </div>
                      <div
                        className={styles.farmdetails}
                        id="farm-detalis"
                        onClick={() =>
                          router.push(
                            `farms/${item._id}/crops?search_string=${item.title}`
                          )
                        }
                      >
                        <div
                          className={styles.duration}
                          style={{ marginBottom: "0.5rem" }}
                          id="duration"
                        >
                          <div className={styles.dates}>
                            {timePipe(item.createdAt, "DD, MMM YYYY")}
                          </div>
                        </div>
                        <div
                          className={styles.farm1}
                          style={{ color: "#D94841" }}
                        >
                          {item.title.length > 16
                            ? item.title.slice(0, 1).toUpperCase() +
                              item.title.slice(1, 12) +
                              "..."
                            : item.title[0].toUpperCase() + item.title.slice(1)}
                        </div>

                        {/* <div className={styles.location}>
                  {!loading && location && location == 'All' ?<div className={styles.locationArea}>
                        {item?.location.length > 13 ? item?.location.slice(0, 10) + '...' : item?.location}
                    </div>:""}
                  </div> */}
                      </div>
                      <div
                        className={styles.farmareablock}
                        id="farm-area-block"
                      >
                        <div
                          className={styles.farmarea}
                          id="farm-area"
                          onClick={() => router.push(`farms/${item._id}/crops`)}
                        >
                          <div className={styles.area}>
                            <div className={styles.acres}>
                              {item?.area
                                ? Math.floor(item?.area * 100) / 100
                                : ""}{" "}
                              Acres
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })
          : ""}
      </div>
      {/* {hasMore ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            className={styles.farmsViewMoreBtn}
            variant="outlined"
            onClick={(e) => {
              e.preventDefault();
              setPage((prev) => prev + 1);

              getAllFarms({
                page: page + 1,
                search_string: searchFromRouter as string,
                location: locationFromRouter as string,
                addData: true,
              });
            }}
          >
            View More <KeyboardArrowDownIcon sx={{ fontSize: "1.5rem" }} />
          </Button>
        </div>
      ) : (
        ""
      )} */}
    </div>
  );
};

export default FarmCard;