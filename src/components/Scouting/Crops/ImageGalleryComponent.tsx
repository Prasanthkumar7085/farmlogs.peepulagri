import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import AlertDelete from "@/components/Core/DeleteAlert/alert-delete";
import ImageComponent from "@/components/Core/ImageComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import NoFarmDataComponent from "@/components/Core/NoFarmDataComponent";
import SummaryTextDilog from "@/components/Core/SummaryTextDilog";
import TagsDrawer from "@/components/Core/TagsDrawer";
import VideoDialogForScout from "@/components/VideoDiloagForSingleScout";
import timePipe from "@/pipes/timePipe";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Button, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import DrawerComponentForScout from "../Comments/DrawerBoxForScout";
import ScoutView from "./Scouts/ScoutView";
import styles from "./crop-card.module.css";
import NoDataAnimatedComponent from "@/components/Core/NoDataAnimatedComponent";
const ImageGalleryComponent = () => {
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

  // Effect to add scroll event listener when the component mounts

  useEffect(() => {
    if (router.isReady) {
      getPresingedURls(pageNumber);
    }
  }, [accessToken, router.isReady]); // Re-run effect when currentPage changes

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

  //get the images urls api
  const getPresingedURls = async (page: any, pageChange = false) => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/crops/${router.query.crop_id}/images/day-wise/${page}/50`,
        options
      );

      let responseData: any = await response.json();

      if (responseData.success) {
        setHasMore(responseData?.has_more);
        if (pageChange) {

          setData((prevData: any) => {
            const newData = [...prevData, ...responseData?.data];
            // Assuming 'date' is the property to match for merging
            const mergedData: any = {};

            // Merge data based on date
            newData.forEach((item: any) => {
              const date = item.date;

              if (!mergedData[date]) {
                mergedData[date] = { ...item };
              } else {
                // Merge images for the same date
                mergedData[date].images = [
                  ...mergedData[date].images,
                  ...item.images,
                ];
              }
            });

            // Convert merged data object back to an array
            return Object.values(mergedData);
          })

        }
        else setData([...responseData?.data]);
        return responseData.data;
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
        farm_image_ids: selectedItems.map((item: any) => item._id),
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
        setSelectedItems([]);
        setTagsDrawerOpen(false);
        await getPresingedURls(1);
      } else {
        toast.error(responseData?.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const captureCommentDetails = async (comment: any) => {
    setLoading(true);
    try {
      let body = {
        farm_image_ids: selectedItems.map((item: any) => item._id),
        content: comment,
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
        `${process.env.NEXT_PUBLIC_API_URL}/farm-images/comments`,
        options
      );
      let responseData = await response.json();
      if (response?.status >= 200 && response?.status <= 200) {
        toast.success(responseData?.message);
        setSelectedItems([]);
        setTagsDrawerOpen(false);
        await getPresingedURls(1);
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
      farm_image_ids: selectedItems.map((item: any) => item._id),
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
        setTagsDrawerOpen(false);
        setTagsCheckBoxOpen(false);
        toast.success("Images Deleted successfully");
        setDeleteOpen(false);
        setSelectedItems([]);
        // setData([]);
        await getPresingedURls(1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
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
  const observer: any = useRef();

  const lastBookElementRef = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
          getPresingedURls(pageNumber + 1, true);
          scrollToLastItem(); // Restore scroll position after new data is loaded
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  //download multiple images
  const downloadFiles = async () => {
    setLoading(true);
    try {
      for (const item of selectedItems || []) {
        // const response = await fetch(item?.url);

        // if (!response.ok) {
        //   throw new Error('Network response was not ok.');
        // }

        let filename = item.crop_id.slug + item.key;

        // const blob = await response.blob();
        // const blobUrl = window.URL.createObjectURL(blob);

        const downloadLink = document.createElement("a");
        downloadLink.href = item.url;
        downloadLink.download = filename;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        toast.success("Downloaded Successfully");

        // window.URL.revokeObjectURL(blobUrl);
      }
    } catch (error) {
      console.error("Error occurred while downloading files:", error);
      // Handle the error as needed
      toast.error("Download Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.scoutingView}>
      {/* <div className={styles.mobileScoutingViewHeader}>
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
      </div> */}
      <div className={styles.header} id="header">
        <img
          className={styles.iconsiconArrowLeft}
          alt=""
          src="/iconsiconarrowleft.svg"
          onClick={() => router.back()}
        />
        <Typography className={styles.viewFarm}>

          {
            (farmTitle
              ? farmTitle?.length > 10
                ? farmTitle.slice(0, 1).toUpperCase() +
                farmTitle?.slice(1, 14) +
                "..."
                : farmTitle[0].toUpperCase() +
                farmTitle?.slice(1)
              : "") + "/" + (cropTitle
                ? cropTitle?.length > 10
                  ? cropTitle.slice(0, 1).toUpperCase() +
                  cropTitle?.slice(1, 14) +
                  "..."
                  : cropTitle[0].toUpperCase() +
                  cropTitle?.slice(1)
                : "")}

        </Typography>
        <div className={styles.headericon} id="header-icon"></div>
      </div>

      {value == "1" ? (
        <div className={styles.stickyHeader}>
          {tagsCheckBoxOpen ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <IconButton
                onClick={() => {
                  setTagsCheckBoxOpen(false);
                  setSelectedItems([]);
                }}
                sx={{ display: data?.length ? "" : "none" }}
                className={styles.selectBtn}
              >
                <img src="/mobileIcons/scouting/x-light.svg" alt="" width="20px" />
              </IconButton>
              {selectedItems?.length ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <IconButton className={styles.selectBtn} onClick={() => setDeleteOpen(true)} sx={{ paddingBlock: "0" }}>
                    <ImageComponent
                      src={"/mobileIcons/scouting/trash-simple-light.svg"}
                      width={20}
                      height={20}
                      alt=""
                    />
                  </IconButton>

                  <IconButton className={styles.selectBtn} onClick={() => setTagsDrawerOpen(true)} sx={{ paddingBlock: "0" }}>
                    <ImageComponent
                      src={"/mobileIcons/navTabs/tagIcon-selectImage.svg"}
                      width={20}
                      height={20}
                      alt="tag"
                    />
                  </IconButton>

                  {/* <IconButton onClick={() => downloadFiles()}>
                    <FileDownloadIcon />
                  </IconButton> */}
                </div>
              ) : (
                ""
              )}
            </div>
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
      ) : (
        ""
      )}

      <div style={{
        overflowY: "auto",
        maxHeight: "calc(100vh - 160px)",

      }}>
        {data?.length ?
          data.map((images: any, indexAttachment: any) => {
            if (data.length === indexAttachment + 1) {
              return (
                <div key={indexAttachment}
                  ref={lastBookElementRef}
                >
                  <Typography variant="caption" className={styles.scoutingDate}>{images.date}</Typography>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gridGap: "1px",
                      marginBottom: "5px"
                    }}
                  >
                    {images?.images?.map((image: any, index: any) => {

                      return (
                        <div
                          style={{ position: "relative", height: "100px" }}
                          key={index}

                        >
                          <img
                            className="your-image-class"
                            key={index}
                            src={
                              image.type?.slice(0, 2) == "vi"
                                ? "/Play-button.svg"
                                : image.url
                            }
                            alt={image?.uploaded_at}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              top: "0",
                              right: "0",
                            }}
                            onClick={() => {
                              if (!longpressActive || tagsCheckBoxOpen == false) {
                                router.push(
                                  `/farms/${router.query.farm_id}/crops/${router.query.crop_id}/view/${image?._id}`
                                );
                              } else {
                                handleChange(image); // Call handleLongPress when long press is detected
                              }
                            }}
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
                                style={{ width: "18px", height: "18px", border: "1px solid #000" }}
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
                      )

                    })}
                  </div>
                </div>
              )
            }
            else {
              return (
                <div key={indexAttachment}
                  ref={
                    indexAttachment === data.length - data.length ? lastItemRef : null
                  }
                >
                  <Typography variant="caption" className={styles.scoutingDate}>{images.date}</Typography>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gridGap: "1px",
                      marginBottom: "5px"

                    }}
                  >
                    {images?.images?.map((image: any, index: any) => {

                      return (
                        <div
                          style={{ position: "relative", height: "100px" }}
                          key={index}

                        >
                          <img
                            className="your-image-class"
                            key={index}
                            src={
                              image.type?.slice(0, 2) == "vi"
                                ? "/Play-button.svg"
                                : image.url
                            }
                            alt={image?.uploaded_at}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              top: "0",
                              right: "0",
                            }}
                            onClick={() => {
                              if (!longpressActive || tagsCheckBoxOpen == false) {
                                router.push(
                                  `/farms/${router.query.farm_id}/crops/${router.query.crop_id}/view/${image?._id}`
                                );
                              } else {
                                handleChange(image); // Call handleLongPress when long press is detected
                              }
                            }}
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
                                style={{ width: "18px", height: "18px", border: "1px solid #000" }}
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
                      )

                    })}
                  </div>
                </div>
              )
            }
          }) : ""}
      </div>
      {data?.length == 0 && !loading &&
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 160px)" }}>

          <NoDataAnimatedComponent noData={!data?.length} />
        </div>}
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
          captureCommentDetails={captureCommentDetails}
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
            <img
              src="/mobileIcons/scouting/Add_Scouting.svg"
              alt=""
              width={"25px"}
            />
            <span>Upload</span>
          </IconButton>
        ) : (
          ""
        )}
      </div>
      {/* {data?.length ? (
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
      )} */}

      {deleteOpen ? (
        <AlertDelete
          open={deleteOpen}
          deleteFarm={deleteImages}
          setDialogOpen={setDeleteOpen}
          loading={deleteLoading}
          deleteTitleProp={"Images"}
        />
      ) : (
        ""
      )}

      <Toaster richColors position="top-right" closeButton />
    </div>
  );
};
export default ImageGalleryComponent;
