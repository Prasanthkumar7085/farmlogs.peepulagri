import { removeUserDetails } from "@/Redux/Modules/Auth";
import {
  deleteAllMessages, removeTheAttachementsFilesFromStore
} from "@/Redux/Modules/Conversations";
import AlertDelete from "@/components/Core/DeleteAlert/alert-delete";
import LoadingComponent from "@/components/Core/LoadingComponent";
import SummaryTextDilog from "@/components/Core/SummaryTextDilog";
import TagsDrawer from "@/components/Core/TagsDrawer";
import VideoDialogForScout from "@/components/VideoDiloagForSingleScout";
import timePipe from "@/pipes/timePipe";
import AddIcon from "@mui/icons-material/Add";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import {
  Breadcrumbs,
  Button,
  IconButton,
  Link,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
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
  const [deleteOpen, setDeleteOpen] = useState(false);

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
  const [deleteLoading, setDeleteLoading] = useState<any>(false);
  const [deletedImages, setDeletedImages] = useState<any>([]);
  const [deletedImagePages, setDeletedImagePages] = useState<any>({});
  const [value, setValue] = useState<any>("1");

  useEffect(() => {
    setTempImages(selectedItems);
  }, [selectedItems]);

  useEffect(() => {
    if (router.isReady) {
      getPresingedURls();
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
  const captureTagsDetails = async (tags: any, description: any) => {
    setLoading(true);
    try {
      let body = {
        farm_image_ids: [router.query.farm_id],
        tags: tags,
      };
      let options = {
        method: "POST",
        headers: new Headers({
          "content-type": "application/json",
          authorization: accessToken,
        }),
        body: JSON.stringify(body),
      };

      let response: any = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/farm-images/tag`,
        options
      );
      let responseData = await response.json();
      if (response?.status >= 200 && response?.status <= 200) {
        toast.success(responseData?.message);
        setTagsDrawerOpen(false);
        await getPresingedURls();
      } else {
        toast.error(responseData?.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

  //delete multiple images
  const deleteImages = async () => {
    setDeleteLoading(true);
    let bodyData: any = {
      farm_image_ids: selectedItems,
    };
    let options = {
      method: "DELETE",
      headers: new Headers({
        "content-type": "application/json",
        authorization: accessToken,
      }),
      body: JSON.stringify(bodyData),
    };
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/farm-images/delete-images`,
        options
      );
      let responseData = await response.json();
      if (responseData?.success) {
        toast.success("Images Deleted successfully");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setDeleteLoading(false);
    }
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
            {tagsCheckBoxOpen ? (
              <Button
                onClick={() => {
                  setTagsCheckBoxOpen(false);
                  setSelectedItems([]);
                }}
                sx={{ display: data?.length ? "" : "none" }}
                className={styles.selectBtn}
              >
                Cancel
              </Button>
            ) : (
              <Button
                className={styles.selectBtn}
                onClick={() => setTagsCheckBoxOpen(true)}
                sx={{ display: data?.length ? "" : "none" }}
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
                      alt={image?.key}
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
              <div className={styles.noData}>
                <Image
                  src="/no-crops-image.svg"
                  alt=""
                  width={120}
                  height={120}
                />
                <Typography variant="h4">No Images</Typography>
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
        ) : (
          ""
        )}
      </div>
      {data?.length ? (
        <div className={styles.stickyHeader2}>
          {selectedItems?.length ? (
            <div className={styles.stickyBtnGrp}>
              <Button
                sx={{ color: "#454444 !important" }}
                onClick={() => setDeleteOpen(true)}
              >
                Delete
              </Button>
              <Button
                sx={{ color: "#454444 !important" }}
                onClick={() => setTagsDrawerOpen(true)}
              >
                Add Tags
              </Button>
            </div>
          ) : (
            <div className={styles.stickyBtnGrp}>
              <Button sx={{ color: "#454444 !important" }}>Years</Button>
              <Button sx={{ color: "#454444 !important" }}>Month</Button>
              <Button sx={{ color: "#454444 !important" }}>Days</Button>
              <Button sx={{ color: "#fff !important" }}>All Photos</Button>
            </div>
          )}
        </div>
      ) : (
        ""
      )}

      {deleteOpen ? (
        <AlertDelete
          open={deleteOpen}
          deleteFarm={deleteImages}
          setDialogOpen={setDeleteOpen}
          loading={deleteLoading}
        />
      ) : (
        ""
      )}

      <Toaster richColors position="top-right" closeButton />
    </div>
  );
};
export default SingleViewScoutComponent;
