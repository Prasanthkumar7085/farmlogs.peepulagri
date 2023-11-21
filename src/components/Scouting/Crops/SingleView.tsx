import { removeUserDetails } from "@/Redux/Modules/Auth";
import {
  deleteAllMessages, removeTheAttachementsFilesFromStore
} from "@/Redux/Modules/Conversations";
import ImageComponent from "@/components/Core/ImageComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import SummaryTextDilog from "@/components/Core/SummaryTextDilog";
import TagsDrawer from "@/components/Core/TagsDrawer";
import TagsDrawerEdit from "@/components/Core/TagsDrawerEdit";
import VideoDialogForScout from "@/components/VideoDiloagForSingleScout";
import timePipe from "@/pipes/timePipe";
import AddIcon from "@mui/icons-material/Add";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import {
  Breadcrumbs,
  Button,
  IconButton,
  Link,
  Tab,
  Tabs,
  Typography
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import getSingleScoutService from "../../../../lib/services/ScoutServices/getSingleScoutService";
import DrawerComponentForScout from "../Comments/DrawerBoxForScout";
import ScoutView from "./Scouts/ScoutView";
import styles from "./crop-card.module.css";

const SingleViewScoutComponent = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const cropTitle = useSelector((state: any) => state?.farms?.cropName);
  const farmTitle = useSelector((state: any) => state?.farms?.farmName);

  const [, , removeCookie] = useCookies(["userType"]);
  const [, , loggedIn] = useCookies(["loggedIn"]);

  const [data, setData] = useState<any>([]);
  const [selectedFile, setSelectedFile] = useState<any>([]);
  const [index, setIndex] = useState<any>();
  const [scoutData, setScoutData] = useState();
  const [sildeShowImages, setSlideShowImages] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState<any>(false);
  const [scoutId, setScoutId] = useState<any>();
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [SummaryDrawerOpen, setSummaryDrawerOpen] = useState<boolean>(false);
  const [tagsDrawerOpen, setTagsDrawerOpen] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [indexOfSeletedOne, setIndexOfseletedOne] = useState<any>();
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [tagsCheckBoxOpen, setTagsCheckBoxOpen] = useState<any>(false);
  const [scoutAttachmentDetails, setScoutAttachementsDetails] = useState<any>();
  const [summaryContent, setSummaryContent] = useState<any>();
  const [scoutFindings, setScoutFindings] = useState<any>();
  const [TagsDrawerEditOpen, setTagsDrawerEditOpen] = useState<any>();
  const [openCommentsBox, setOpenCommentsBox] = useState<any>();
  const [singleScoutDetails, setSingleScoutDetails] = useState<any>();
  const [longpressActive, setLongPressActive] = useState<any>(false);
  // let tempImages: any = [...selectedItems];
  const [tempImages, setTempImages] = useState(selectedItems);

  const [deletedImages, setDeletedImages] = useState<any>([]);
  const [deletedImagePages, setDeletedImagePages] = useState<any>({});
  const [value, setValue] = useState<any>("1");



  useEffect(() => {
    setTempImages(selectedItems);
  }, [selectedItems]);


  useEffect(() => {
    if (router.isReady) {
      getPresingedURls()
      dispatch(removeTheAttachementsFilesFromStore([]));
    }
  }, [pageNumber, accessToken, router.isReady]);





  //logout event when the 403 and 401 error codes
  const logout = async () => {
    try {
      removeCookie("userType");
      loggedIn("loggedIn");
      router.push("/");
      await dispatch(removeUserDetails());
      await dispatch(deleteAllMessages());
    } catch (err: any) {
      console.error(err);
    }
  };


  const getPresingedURls = async () => {
    setLoading(true);
    let options = {
      method: "GET",

      headers: new Headers({
        "content-type": "application/json",
        authorization: accessToken,
      }),
    };
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/crops/${router.query.crop_id}/images/${pageNumber}/50`,
        options
      );

      let responseData: any = await response.json();

      if (responseData.success) {
        if (responseData?.has_more || responseData?.has_more == false) {
          setHasMore(responseData?.has_more);
        }
        let temp: any;
        temp = [...data, ...responseData?.data];
        temp.sort((a: any, b: any) => {
          (timePipe(b.created_at, "DD-MM-YY") as any) -
            (timePipe(a.created_at, "DD-MM-YY") as any);
        });
        setData(temp);
      } else if (responseData?.statusCode == 403) {
        await logout();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  const handleOpenDialog = (item: any) => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItems([]);
  };

  const handleClick = (index: number, item: any) => {
    handleOpenDialog(item);
    setIndexOfseletedOne(index);
    setIndex(index);
    setSelectedItems([item[index]]);
    setScoutAttachementsDetails(item);
  };

  //for comments drawer open/close
  const drawerClose = (value: any) => {
    if (value == false) {
      setOpenCommentsBox(false);
      // setSelectedItems([]);
    }
  };

  //for summary drawer open/close
  const summaryDrawerClose = (value: any) => {
    if (value == false) {
      setSummaryDrawerOpen(false);
      setSelectedFile([]);
    }
  };

  //for tags drawer open/close
  const tagsDrawerClose = (value: any) => {
    if (value == false) {
      setTagsDrawerOpen(false);
      setTagsDrawerEditOpen(false);
    }
  };
  //capture the summary content
  const captureSummary = async (value: any) => {
    if (value) {
      setSummaryContent(value);
      await updateDescriptionService([], value);
    }
  };

  //capture thecurosel options
  const captureImageDilogOptions = (value: any) => {
    if (value == "tag") {
      setTagsDrawerEditOpen(true);
    } else if (value == "comments") {
      setOpenCommentsBox(true);
    } else {
      setScoutId(value._id);
      setScoutAttachementsDetails(value.attachments);
      setSlideShowImages(value.attachments);
    }
  };
  //capture the tags details
  const captureTagsDetails = async (tags: any, findingsvalue: any) => {
    setScoutFindings(findingsvalue);

    if (tags?.length && !findingsvalue?.length) {
      let tempArray = [...tempImages];
      await tempArray.forEach((obj: any) => {
        (obj.description = obj?.description),
          (obj.tags = obj.tags.reduce(
            (acc: any, tag: any) => {
              if (!tags.includes(tag)) {
                acc.push(tag);
              }
              return acc;
            },
            [...tags]
          ));
      });
      setTempImages(tempArray);
      setSelectedItems(tempArray);
      await updateDescriptionService(tempArray, selectedFile.summary);
    }

    if (
      tags?.length &&
      findingsvalue?.length == 0 &&
      tempImages.some((obj: any) => obj.hasOwnProperty("description")) == true
    ) {
      let tempArray = [...tempImages];
      await tempArray.forEach((obj: any) => {
        obj.tags = [...tags];
        obj.description = obj.description;
      });
      setTempImages(tempArray);
      setSelectedItems(tempArray);
      await updateDescriptionService(tempArray, selectedFile.summary);
    }
    if (!tags?.length && findingsvalue?.length) {
      let tempArray = [...tempImages];
      await tempArray.forEach((obj: any) => {
        if (obj.description) {
          obj.description = obj.description + "\n" + findingsvalue;
        } else {
          obj.description = findingsvalue;
        }
      });
      setTempImages(tempArray);
      setSelectedItems(tempArray);
      await updateDescriptionService(tempArray, selectedFile.summary);
    }
    if (tags?.length && findingsvalue?.length) {
      let tempArray = [...tempImages];

      await tempArray.forEach((obj: any) => {
        if (obj.description) {
          (obj.description = obj.description + "\n" + findingsvalue),
            (obj.tags = obj.tags.reduce(
              (acc: any, tag: any) => {
                if (!tags.includes(tag)) {
                  acc.push(tag);
                }
                return acc;
              },
              [...tags]
            ));
        } else {
          (obj.description = findingsvalue),
            (obj.tags = obj.tags.reduce(
              (acc: any, tag: any) => {
                if (!tags.includes(tag)) {
                  acc.push(tag);
                }
                return acc;
              },
              [...tags]
            ));
        }
      });
      setTempImages(tempArray);
      setSelectedItems(tempArray);
      await updateDescriptionService(tempArray, selectedFile.summary);
    }

    if (!tags.length && !findingsvalue?.length) {
      await updateDescriptionService([], "");
    }
  };

  const captureTagsDetailsEdit = async (tags: any, findingsvalue: any) => {
    setScoutFindings(findingsvalue);
    if (tags?.length && !findingsvalue?.length) {
      let tempArray = [...tempImages];
      await tempArray.forEach((obj: any) => {
        (obj.description = ""),
          (obj.tags = obj.tags.reduce(
            (acc: any, tag: any) => {
              if (!tags.includes(tag)) {
                acc.push(tag);
              }
              return acc;
            },
            [...tags]
          ));
      });
      setTempImages(tempArray);
      setSelectedItems(tempArray);
      await updateDescriptionService(tempArray, selectedFile.summary);
      return;
    }

    if (tags?.length && findingsvalue?.length == 0) {
      let tempArray = [...tempImages];
      await tempArray.forEach((obj: any) => {
        obj.tags = [...tags];
        obj.description = obj.description;
      });
      setTempImages(tempArray);
      setSelectedItems(tempArray);
      await updateDescriptionService(tempArray, selectedFile.summary);
      return;
    }

    if (!tags?.length && findingsvalue?.length) {
      let tempArray = [...tempImages];
      await tempArray.forEach((obj: any) => {
        obj.tags = [];
        obj.description = findingsvalue;
      });
      setTempImages(tempArray);
      setSelectedItems(tempArray);
      await updateDescriptionService(tempArray, selectedFile.summary);
      return;
    }

    if (tags?.length && findingsvalue?.length) {
      let tempArray = [...tempImages];

      await tempArray.forEach((obj: any) => {
        (obj.description = findingsvalue), (obj.tags = [...tags]);
      });
      setTempImages(tempArray);
      setSelectedItems(tempArray);
      await updateDescriptionService(tempArray, selectedFile.summary);
      return;
    }
  };

  //checkbox handlechange event
  const handleChange = (itemId: any) => {
    const itemIndex = tempImages.findIndex(
      (ite: any) => ite._id === itemId._id
    );

    if (itemIndex === -1) {
      setSelectedItems([...tempImages, itemId]);
    } else {
      const updatedItems = tempImages.filter(
        (item: any) => item._id !== itemId._id
      );
      setSelectedItems(updatedItems);
    }
  };

  //capture the slideimages index
  const captureSlideImagesIndex = (value: any) => {
    setIndex(value);
    setSelectedItems([sildeShowImages[value]]);
    setSelectedFile(sildeShowImages[value]);
  };

  //update the details of the scouting
  const updateDescriptionService = async (
    imagesArray: any,
    summaryValue: any
  ) => {
    setLoading(true);
    let updatedArray = scoutAttachmentDetails?.map((obj: any) => {
      let matchingObj = imagesArray?.find((item: any) => item._id === obj._id);
      return matchingObj ? matchingObj : obj;
    });

    try {
      let options = {
        method: "PATCH",
        headers: new Headers({
          "content-type": "application/json",
          authorization: accessToken,
        }),
        body: JSON.stringify({
          farm_id: router.query.farm_id,
          crop_id: router.query.crop_id,
          attachments: tempImages?.length
            ? updatedArray
            : scoutAttachmentDetails,
          summary: summaryValue,
        }),
      };
      let response: any = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/scouts/${scoutId}`,
        options
      );
      const responseData = await response.json();
      if (responseData?.success == true) {
        toast.success("Scout updated successfully");
        setTagsDrawerEditOpen(false);
        setTagsDrawerOpen(false);
        // setSelectedFile([]);
        setTagsCheckBoxOpen(false);
        setLongPressActive(false);
        setSummaryDrawerOpen(false);
        // setSelectedItems([]);
        // setScoutAttachementsDetails([]);
        setSummaryContent("");
        // setOpenDialog(false);
        getPresingedURls();
      } else if (responseData?.statusCode == 403) {
        await logout();
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  //for date range of images
  const containerRef: any = useRef(null);
  const [visibleImages, setVisibleImages] = useState([]);
  const [dateRange, setDateRange] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const visibleImages = data.filter((image: any) => {
          const imageRect = image.ref.getBoundingClientRect();
          return (
            imageRect.top >= containerRect.top &&
            imageRect.bottom <= containerRect.bottom
          );
        });

        // Calculate the date range for the visible images
        const startDate =
          visibleImages.length > 0
            ? timePipe(visibleImages[0].uploaded_at, "DD MMM YY")
            : "";
        const endDate =
          visibleImages.length > 0
            ? timePipe(
              visibleImages[visibleImages.length - 1].uploaded_at,
              "DD MMM YY"
            )
            : "";

        // Update the displayed date range
        setDateRange(`${startDate} - ${endDate}`);
        setVisibleImages(visibleImages);
      }
    };

    // Add scroll event listener to the container
    containerRef.current.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      containerRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [data]);

  //tabs change code
  const handleChangeMenuView = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setValue(newValue);
  };

  return (
    <div className={styles.scoutingView} style={{ backgroundColor: "#f5f7fa" }}>
      <div className={styles.mobileScoutingViewHeader}>
        <Breadcrumbs aria-label="breadcrumb" className={styles.breadcrumbs}>
          <Link
            underline="hover"
            color="inherit"
            href={`/farms/${router.query.farm_id}/crops`}
          >
            {farmTitle}
          </Link>
          <Typography color="text.primary">
            {cropTitle?.slice(0, 1)?.toUpperCase() + cropTitle?.slice(1)}
          </Typography>
        </Breadcrumbs>
        <Tabs
          className={styles.viewingTabs}
          value={value}
          onChange={handleChangeMenuView}
          aria-label="icon position tabs example"
        >
          <Tab icon={<GridViewRoundedIcon />} aria-label="Grid" value="1" />
          <Tab
            icon={<FormatListBulletedRoundedIcon />}
            aria-label="List"
            value="2"
          />
        </Tabs>
      </div>

      {value == "1" ? (
        // <InfiniteScroll
        //   className={styles.infiniteScrollComponent}
        //   dataLength={data.length}
        //   next={() => setPageNumber((prev) => prev + 1)}
        //   hasMore={hasMore}
        //   loader={
        //     <div className={styles.pageLoader}>
        //       {loading ? "Loading..." : ""}
        //     </div>
        //   }
        //   endMessage={
        //     <a href="#" className={styles.endOfLogs}>
        //       {hasMore ? "" : data.length > 11 ? "Scroll to Top" : ""}
        //     </a>
        //   }
        // >
        <div>
          <div className={styles.stickyHeader}>
            <div className={styles.dateRange}>{dateRange}</div>
            {tagsCheckBoxOpen && data?.length ? (
              <Button
                onClick={() => {
                  setTagsCheckBoxOpen(false);
                  setSelectedItems([]);
                }}
                className={styles.selectBtn}
              >
                Cancel
              </Button>
            ) : (
              <Button
                className={styles.selectBtn}
                onClick={() => setTagsCheckBoxOpen(true)}
              >
                Select
              </Button>
            )}
          </div>
          <div
            ref={containerRef}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(18%, 1fr))",
              gridGap: "1px",
              overflowY: "auto",
              maxHeight: "550px",
            }}
          >
            {data?.length ? (
              data.map((image: any, indexAttachment: any) => {
                return (
                  <div
                    style={{ position: "relative", paddingTop: "100%" }}
                    key={indexAttachment}
                  >
                    <img
                      key={indexAttachment}
                      ref={(ref) => (image.ref = ref)}
                      src={
                        image.type?.slice(0, 2) == "vi"
                          ? "/Play-button.svg"
                          : image.url
                      }
                      alt={`images${indexAttachment}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        objectFit: "cover",
                        top: "0",
                        right: "0",
                      }}
                      onClick={() => {
                        if (!longpressActive) {
                          router.push(
                            `/farms/${router.query.farm_id}/crops/${router.query.crop_id}/view/${image?._id}`
                          );
                        } else {
                          handleChange(image); // Call handleLongPress when long press is detected
                        }
                      }}
                      // style={{
                      //   position: "absolute",
                      //   top: "0",
                      //   left: "0",
                      //   width: "100%",
                      //   height: "100%",
                      //   cursor: "pointer",
                      //   borderRadius: "5px",
                      //   objectFit: "cover",
                      // }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setTagsCheckBoxOpen(true);
                        handleChange(image);
                        setScoutId(image._id); // Adjust the timeout duration as needed
                        setLongPressActive(true);
                      }} // Prevent right-click context menu
                      onTouchStart={(e) => {
                        if (e.touches.length > 1) {
                          e.preventDefault(); // Prevent multi-touch event
                        }
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                      }}
                    >
                      {tagsCheckBoxOpen ? (
                        <input
                          type="checkbox"
                          checked={tempImages.some(
                            (ite: any) => ite._id === image._id
                          )}
                          onChange={() => handleChange(image)}
                          title={image.id}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                );
              })
            ) : !loading ? (
              <div
                id={styles.noData}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "calc(100vh - 150px)",
                }}
              >
                <ImageComponent
                  src="/emty-folder-image.svg"
                  alt="empty folder"
                  width={150}
                  height={140}
                />
                <Typography>No Scoutings</Typography>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        <ScoutView />
      )}

      <LoadingComponent loading={loading} />

      <VideoDialogForScout
        open={openDialog}
        onClose={handleCloseDialog}
        mediaArray={sildeShowImages}
        index={index}
        data={scoutData}
        captureSlideImagesIndex={captureSlideImagesIndex}
        captureImageDilogOptions={captureImageDilogOptions}
      />
      <SummaryTextDilog
        summaryDrawerClose={summaryDrawerClose}
        captureSummary={captureSummary}
        item={selectedFile}
        SummaryDrawerOpen={SummaryDrawerOpen}
      />

      {drawerOpen == true ? (
        <DrawerComponentForScout
          drawerClose={drawerClose}
          scoutId={scoutId}
          anchor={"bottom"}
        />
      ) : (
        ""
      )}
      {tagsDrawerOpen ? (
        <TagsDrawer
          loading={loading}
          tagsDrawerClose={tagsDrawerClose}
          captureTagsDetails={captureTagsDetails}
          item={selectedFile}
          selectedItems={selectedItems}
        />
      ) : (
        ""
      )}

      <DrawerComponentForScout
        openCommentsBox={openCommentsBox}
        drawerClose={drawerClose}
        scoutDetails={singleScoutDetails}
        attachement={selectedFile}
      />

      <TagsDrawerEdit
        tagsDrawerClose={tagsDrawerClose}
        captureTagsDetailsEdit={captureTagsDetailsEdit}
        item={selectedFile}
        selectedItems={selectedItems}
        TagsDrawerEditOpen={TagsDrawerEditOpen}
        loading={loading}
      />

      <div className="addFormPositionIcon">
        {tagsCheckBoxOpen == false && selectedItems?.length == 0 ? (
          <IconButton
            size="large"
            className={styles.AddScoutingbtn}
            aria-label="add to shopping cart"
            onClick={() => {
              router.push(
                `/farms/${router?.query.farm_id}/crops/add-item?crop_id=${router.query.crop_id}`
              );
            }}
          >
            <AddIcon />
          </IconButton>
        ) : selectedItems?.length ? (
          <IconButton
            size="large"
            className={styles.AddTagsbtn}
            aria-label="add to shopping cart"
            onClick={() => {
              setTagsDrawerOpen(true);
            }}
          >
            <LocalOfferIcon />
          </IconButton>
        ) : (
          ""
        )}
      </div>
      {data?.length ? (
        <div className={styles.stickyHeader2}>
          <div className={styles.stickyBtnGrp}>
            <Button sx={{ color: "#454444 !important" }}>Years</Button>
            <Button sx={{ color: "#454444 !important" }}>Month</Button>
            <Button sx={{ color: "#454444 !important" }}>Days</Button>
            <Button sx={{ color: "#fff !important" }}>All Photos</Button>
          </div>
        </div>
      ) : (
        ""
      )}

      <Toaster richColors position="top-right" closeButton />
    </div>
  );
};
export default SingleViewScoutComponent;
