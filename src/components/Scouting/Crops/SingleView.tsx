import {
  deleteAllMessages,
  removeTheAttachementsFilesFromStore,
} from "@/Redux/Modules/Conversations";
import { removeTheFilesFromStore } from "@/Redux/Modules/Farms";
import ImageComponent from "@/components/Core/ImageComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import SummaryTextDilog from "@/components/Core/SummaryTextDilog";
import TagsDrawer from "@/components/Core/TagsDrawer";
import TagsDrawerEdit from "@/components/Core/TagsDrawerEdit";
import VideoDialogForScout from "@/components/VideoDiloagForSingleScout";
import timePipe from "@/pipes/timePipe";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {
  Breadcrumbs,
  Button,
  Card,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import getSingleScoutService from "../../../../lib/services/ScoutServices/getSingleScoutService";
import DrawerComponentForScout from "../Comments/DrawerBoxForScout";

import { removeUserDetails } from "@/Redux/Modules/Auth";
import AddIcon from "@mui/icons-material/Add";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "./crop-card.module.css";

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
      // getPresingedURls();
      dispatch(removeTheFilesFromStore([]));
      dispatch(removeTheAttachementsFilesFromStore([]));
    }
  }, [accessToken, router.isReady]);

  useEffect(() => {
    if (router.isReady && accessToken) {
      getPresingedURls();
    }
  }, [pageNumber, accessToken, router.isReady]);

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
        `${process.env.NEXT_PUBLIC_API_URL}/farm/${router.query.farm_id}/scouts/${pageNumber}/5?crop_id=${router.query?.crop_id}`,
        options
      );
      let responseData = await response.json();

      if (responseData.success) {
        if (responseData?.has_more || responseData?.has_more == false) {
          setHasMore(responseData?.has_more);
        }
        let temp: any;
        temp = [...data, ...responseData?.data];
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
      <InfiniteScroll
        className={styles.infiniteScrollComponent}
        dataLength={data.length}
        next={() => setPageNumber((prev) => prev + 1)}
        hasMore={hasMore}
        loader={
          <div className={styles.pageLoader}>{loading ? "Loading..." : ""}</div>
        }
        endMessage={
          <a href="#" className={styles.endOfLogs}>
            {hasMore ? "" : data.length > 11 ? "Scroll to Top" : ""}
          </a>
        }
      >
        {data?.length ? (
          data.map((item: any, index: any) => {
            return (
              <Card key={index} className={styles.galleryCard}>
                <div>
                  <div className={styles.dateHeader}>
                    <Typography className={styles.postDate}>
                      <InsertInvitationIcon />
                      <span>{timePipe(item.createdAt, "DD-MM-YYYY")}</span>
                    </Typography>

                    <div className={styles.actionButtonsTop}>
                      {tagsCheckBoxOpen && scoutId == item._id ? (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setTagsCheckBoxOpen(false);
                            setScoutId("");
                            setScoutAttachementsDetails([]);
                            setSlideShowImages([]);
                            setSelectedItems([]);
                          }}
                        >
                          <Image
                            src={"/scouting-img-clear.svg"}
                            width={17}
                            height={17}
                            alt="tag"
                          />
                        </IconButton>
                      ) : (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setTagsCheckBoxOpen(true);
                            setScoutId(item._id);
                            setScoutAttachementsDetails(item.attachments);
                            setSlideShowImages(item.attachments);
                            setSelectedFile("");
                          }}
                        >
                          <Image
                            src={"/scouting-img-add.svg"}
                            width={17}
                            height={17}
                            alt="tag"
                          />
                        </IconButton>
                      )}

                      <Button
                        className={styles.summaryBtn}
                        onClick={() => {
                          setSummaryDrawerOpen(true);
                          setScoutId(item._id);
                          setSelectedFile(item);
                          setScoutAttachementsDetails(item.attachments);
                        }}
                      >
                        {item?.suggestions ? (
                          <Typography
                            variant="caption"
                            className={styles.recommandation}
                            sx={{
                              color: "#05A155",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <ImageComponent
                              src={"/scouting/recommendations-icon.svg"}
                              height={20}
                              width={20}
                            />
                            <span>Recommendations</span>
                          </Typography>
                        ) : (
                          <Typography
                            variant="caption"
                            className={styles.summary}
                            sx={{
                              color: item?.summary ? "#3462CF" : "#d94841",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            {item?.summary ? (
                              <ImageComponent
                                src={"/scouting/HasSummary.svg"}
                                height={19}
                                width={19}
                              />
                            ) : (
                              <ImageComponent
                                src="/no-summary-icon.svg"
                                height={19}
                                width={19}
                              />
                            )}
                            <span>Summary</span>
                          </Typography>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className={styles.mobileScoutGridGallary}>
                    {item?.attachments?.length !== 0 ? (
                      item.attachments.map(
                        (image: any, indexAttachment: any) => (
                          <div
                            style={{ position: "relative", paddingTop: "100%" }}
                            key={indexAttachment}
                          >
                            <img
                              src={
                                image.type?.slice(0, 2) == "vi"
                                  ? "/Play-button.svg"
                                  : image.tn_url
                              }
                              alt={`images${indexAttachment}`}
                              width={"100%"}
                              height={"100%"}
                              onClick={() => {
                                handleClick(indexAttachment, item.attachments);
                                setScoutId(item._id);
                                setSingleScoutDetails(item);
                                setSelectedFile(image);
                                setSlideShowImages(item?.attachments);
                              }}
                              style={{
                                position: "absolute",
                                top: "0",
                                left: "0",
                                width: "100%",
                                height: "100%",
                                cursor: "pointer",
                                borderRadius: "5px",
                                objectFit: "cover",
                              }}
                            />

                            <div
                              style={{
                                position: "absolute",
                                top: "5px",
                                left: "5px",
                              }}
                            >
                              {tagsCheckBoxOpen && scoutId == item._id ? (
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
                            <div
                              style={{
                                position: "absolute",
                                bottom: "5px",
                                right: "5px",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                              }}
                            >
                              {tagsCheckBoxOpen == true &&
                              scoutId == item._id &&
                              image?.description ? (
                                <SearchOutlinedIcon />
                              ) : (
                                ""
                              )}
                              {tagsCheckBoxOpen == true &&
                              scoutId == item._id &&
                              image?.tags?.length ? (
                                <Image
                                  src={"/scout-img-select.svg"}
                                  width={17}
                                  height={17}
                                  alt="tags"
                                />
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <div style={{ width: "100%", marginLeft: "100%" }}>
                        No Attachements
                      </div>
                    )}
                  </div>
                </div>
              </Card>
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
            <Typography className={styles.subTitle}>No Scoutings</Typography>
          </div>
        ) : (
          ""
        )}
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
      <Toaster richColors position="top-right" closeButton />
    </div>
  );
};
export default SingleViewScoutComponent;
