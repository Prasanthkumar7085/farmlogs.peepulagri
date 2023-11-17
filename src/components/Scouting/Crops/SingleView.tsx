import {
  deleteAllMessages,
  removeTheAttachementsFilesFromStore,
} from "@/Redux/Modules/Conversations";
import { removeTheFilesFromStore } from "@/Redux/Modules/Farms";
import LoadingComponent from "@/components/Core/LoadingComponent";
import SummaryTextDilog from "@/components/Core/SummaryTextDilog";
import TagsDrawer from "@/components/Core/TagsDrawer";
import TagsDrawerEdit from "@/components/Core/TagsDrawerEdit";
import VideoDialogForScout from "@/components/VideoDiloagForSingleScout";
import timePipe from "@/pipes/timePipe";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import ImageComponent from "@/components/Core/ImageComponent";

import {
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Chip,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import getSingleScoutService from "../../../../lib/services/ScoutServices/getSingleScoutService";
import DrawerComponentForScout from "../Comments/DrawerBoxForScout";
import { SummaryIcon } from "@/components/Core/SvgIcons/summaryIcon";
import SuggestionsIcon from "@/components/Core/SvgIcons/SuggitionsIcon";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import AddIcon from "@mui/icons-material/Add";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import styles from "./crop-card.module.css";
import { removeUserDetails } from "@/Redux/Modules/Auth";
import InfiniteScroll from "react-infinite-scroll-component";

const SingleViewScoutComponent = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const cropTitle = useSelector((state: any) => state?.farms?.cropName);
  const farmTitle = useSelector((state: any) => state?.farms?.farmName);

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

  useEffect(() => {
    setTempImages(selectedItems);
  }, [selectedItems]);

  useEffect(() => {
    if (
      router.query.farm_id &&
      router.isReady &&
      router.query?.crop_id &&
      accessToken
    ) {
      dispatch(removeTheFilesFromStore([]));
      dispatch(removeTheAttachementsFilesFromStore([]));
    }
  }, [accessToken, router.isReady]);

  useEffect(() => {
    getPresingedURls()
  }, [pageNumber]);

  const logout = async () => {
    try {
      const responseUserType = await fetch("/api/remove-cookie");
      if (responseUserType) {
        const responseLogin = await fetch("/api/remove-cookie");
        if (responseLogin.status) {
          router.push("/");
        } else throw responseLogin;
      }
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
        `${process.env.NEXT_PUBLIC_API_URL}/farms/${router.query.farm_id}/crops/${router.query.crop_id}/farm-images/${pageNumber}/50`,
        options
      );

      let responseData: any = await response.json();

      if (responseData.success) {
        if (responseData?.has_more || responseData?.has_more == false) {
          setHasMore(responseData?.has_more);
        }
        let temp: any;
        temp = [...data, ...responseData?.data];
        temp.sort((a: any, b: any) => { (timePipe(b.created_at, "DD-MM-YY") as any) - (timePipe(a.created_at, "DD-MM-YY") as any) })
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

  const getSingleScout = async (scoutId: any) => {
    const response = await getSingleScoutService(scoutId, accessToken);

    if (response?.success) {
      if (response?.data?.attachments?.length) {
        setSlideShowImages(response?.data?.attachments);
        setScoutData(response?.data);
      }
    }
    setLoading(false);
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
  const [dateRange, setDateRange] = useState('');

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
          visibleImages.length > 0 ? timePipe(visibleImages[0].created_at, "DD MMM YY") : '';
        const endDate =
          visibleImages.length > 0
            ? timePipe(visibleImages[visibleImages.length - 1].created_at, "DD MMM YY")
            : '';

        // Update the displayed date range
        setDateRange(`${startDate} - ${endDate}`);
        setVisibleImages(visibleImages);
      }
    };

    // Add scroll event listener to the container
    containerRef.current.addEventListener('scroll', handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      containerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [data]);



  return (
    <div className={styles.scoutingView}>
      <div role="presentation">
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
      </div>


      < InfiniteScroll
        className={styles.infiniteScrollComponent}
        dataLength={data.length}
        next={() => setPageNumber(prev => prev + 1)}
        hasMore={hasMore}
        loader={<div className={styles.pageLoader}>{loading ? "Loading..." : ""}</div>}
        endMessage={<a href="#" className={styles.endOfLogs}>{hasMore ? "" : data.length > 11 ? 'Scroll to Top' : ""}</a>}
      >
        <div
          className={styles.stickyHeader}
        >
          {dateRange}
        </div>
        <div ref={containerRef}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(18%, 1fr))', gap: '2px', overflowY: 'auto',
            maxHeight: '500px'
          }}>

          {data?.length ?
            data.map((image: any, indexAttachment: any) => {
              return (

                <img
                  key={indexAttachment}
                  ref={(ref) => (image.ref = ref)}
                  src={
                    image.type?.slice(0, 2) == "vi"
                      ? "/Play-button.svg"
                      : image.url
                  }
                  alt={`images${indexAttachment}`}
                  style={{ width: '100%', height: 'auto' }}

                  onClick={() => {
                    if (longpressActive == false) {
                      router.push(
                        `/farms/${router.query.farm_id}/crops/${router.query.crop_id}/view/${image?._id}`
                      );

                      // handleClick(indexAttachment, item.attachments);
                      // setScoutId(item._id);
                      // setSingleScoutDetails(item);
                      // setSelectedFile(image);
                      // setSlideShowImages(item?.attachments);
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

              )
            }) : !loading ? (
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
                <Typography >No Scoutings</Typography>
              </div>
            ) : (
              ""
            )}
        </div>

      </InfiniteScroll>

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
      {data?.length ?
        <div
          className={styles.stickyHeader2}
        >
          <div style={{ display: "flex", justifyContent: "center", top: "20px" }}>
            <Button>Years</Button>
            <Button>Month</Button>
            <Button>Days</Button>
            <Button variant="contained">All Photos</Button>

          </div>
        </div> : ""}

      <Toaster richColors position="top-right" closeButton />
    </div>
  );
};
export default SingleViewScoutComponent;
