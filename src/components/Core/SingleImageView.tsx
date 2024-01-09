import EditTagsForSingleAttachment from "@/components/Core/EditTagsForSingleAttachment";
import { IconButton, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import ReactPanZoom from "react-image-pan-zoom-rotate";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import DrawerComponentForScout from "../Scouting/Comments/DrawerBoxForScout";
import styles from "../Scouting/Crops/Scouts/singleImage.module.css";
import LoadingComponent from "./LoadingComponent";
import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import { useCookies } from "react-cookie";
import SingleImageComponent from "../Scouting/Crops/Scouts/SingleImageComponent";
interface componentProps {
  detailedImage: any;
  scoutDetails: any;
  getImageData: any;
}
const SingleImageView: FC<componentProps> = ({
  detailedImage,
  scoutDetails,
  getImageData,
}) => {
  const router = useRouter();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const dispatch = useDispatch()
  const [TagsDrawerEditOpen, setTagsDrawerEditOpen] = useState<any>(false);
  const cropTitle = useSelector((state: any) => state?.farms?.cropName);
  const farmTitle = useSelector((state: any) => state?.farms?.farmName);
  const [openCommentsBox, setOpenCommentsBox] = useState<any>(false);
  const [showMoreSuggestions, setShowMoreSuggestions] = useState<any>(false);
  const [updateAttachmentLoading, setUpdateAttachmentLoading] = useState(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const [, , removeCookie] = useCookies(["userType_v2"]);
  const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);
  const tagsDrawerClose = (value: any) => {
    if (value == false) {
      setTagsDrawerEditOpen(false);
    }
  };
  const drawerClose = (value: any) => {
    if (value == false) {
      setOpenCommentsBox(false);
      // setSelectedItems([]);
    }
  };
  const captureImageDilogOptions = (value: string) => {
    if (value == "tag") {
      setTagsDrawerEditOpen(true);
    } else if (value == "comments") {
      setOpenCommentsBox(true);
    }
  };
  const openViewMore = () => {
    setShowMoreSuggestions(true);
  };
  const captureTagsDetailsEdit = async (tags: any, description: any) => {
    try {
      let body = {
        farm_image_ids: [data._id],
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
        setTagsDrawerEditOpen(false);
      } else {
        toast.error(responseData?.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdateAttachmentLoading(false);
    }
  };
  const logout = async () => {
    try {
      removeCookie("userType_v2");
      loggedIn_v2("loggedIn_v2");
      router.push("/");
      await dispatch(removeUserDetails());
      await dispatch(deleteAllMessages());
    } catch (err: any) {
      console.error(err);
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
          getInstaScrollImageDetails(data[data?.length - 1]?._id)
          scrollToLastItem(); // Restore scroll position after new data is loaded
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, loading]
  );
  //get the get image details api
  const getInstaScrollImageDetails = async (lastImage_id: any) => {
    setLoading(true);
    let options = {
      method: "GET",
      headers: new Headers({
        authorization: accessToken,
      }),
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/crops/${router.query.crop_id}/images/${lastImage_id}/pre/20`,
        options
      );
      const responseData = await response.json();
      if (responseData.success) {
        if (responseData?.has_more) {
          if (data?.length) {
            setHasMore(responseData?.has_more);
            let temp = [...data, ...responseData?.data]
            console.log(temp, "oo")
            const uniqueObjects = Array.from(
              temp.reduce((acc, obj) => acc.set(obj._id, obj), new Map()).values()
            );
            console.log(uniqueObjects, "un")
            setData(uniqueObjects);
          }
          else {
            setHasMore(responseData?.has_more);
            let temp = [...responseData?.data]
            const uniqueObjects = Array.from(
              temp.reduce((acc, obj) => acc.set(obj._id, obj), new Map()).values()
            );
            setData(temp);
          }

        }

        else {
          setHasMore(false);
          setData(responseData?.data);
        }
      } else if (responseData?.statusCode == 403) {
        await logout();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  //call the api
  useEffect(() => {
    if (router.isReady && accessToken) {
      getInstaScrollImageDetails(router.query.image_id);
    }
  }, [router.isReady, accessToken, router.query.image_id]);

  const afterAddingTags = async (value: any) => {
    if (value) {
      await getInstaScrollImageDetails(router.query.image_id);
      scrollToLastItem()
    }
  }
  return (
    <div>
      <div>
        {/* <div style={{ position: "fixed", width: "100%", zIndex: "1", maxWidth: "500px" }}> */}
        <div className={styles.singleImageViewHeader}>
          <picture>
            <img
              alt=""
              src="/iconsiconarrowleft.svg"
              onClick={() => router.back()}
              width={"25px"}
            />
          </picture>
          <Typography>
            {(data[0]?.farm_id?.title
              ? data[0]?.farm_id?.title?.length > 10
                ? data[0]?.farm_id?.title.slice(0, 1).toUpperCase() +
                data[0]?.farm_id?.title?.slice(1, 14) +
                "..."
                : data[0]?.farm_id?.title[0].toUpperCase() +
                data[0]?.farm_id?.title?.slice(1)
              : "") +
              "/" +
              (data[0]?.crop_id?.title
                ? data[0]?.crop_id?.title?.length > 10
                  ? data[0]?.crop_id?.title.slice(0, 1).toUpperCase() +
                  data[0]?.crop_id?.title?.slice(1, 14) +
                  "..."
                  : data[0]?.crop_id?.title[0].toUpperCase() +
                  data[0]?.crop_id?.title?.slice(1)
                : "")}
          </Typography>
          <div className={styles.headericon} id="header-icon"></div>
        </div>
        {/* </div> */}
      </div>
      <div
        style={{
          overflowY: "auto",
          maxHeight: "calc(100vh - 136px)",
          scrollSnapType: "y mandatory",
          paddingBottom: "1rem"
        }}
      >
        {data?.length
          ? data.map((image: any, index: any) => {
            if (data?.length === index + 1 && hasMore == true) {
              return (
                <div
                  key={index}
                  style={{
                    scrollSnapAlign: "start",
                  }}
                  ref={lastBookElementRef}
                >
                  <SingleImageComponent
                    detailedImage={image}
                    scoutDetails={data}
                    afterAddingTags={afterAddingTags}
                    lastItemRef={lastItemRef} />

                </div>
              );
            } else {
              return (
                <div
                  key={index}
                  style={{
                    scrollSnapAlign: "start",
                  }}
                  ref={index === data.length - 9 ? lastItemRef : null}
                >

                  <SingleImageComponent
                    detailedImage={image}
                    scoutDetails={data}
                    afterAddingTags={afterAddingTags}
                    lastItemRef={lastItemRef}
                  />
                </div>
              );
            }
          })
          : ""}
      </div>
      <DrawerComponentForScout
        openCommentsBox={openCommentsBox}
        drawerClose={drawerClose}
        scoutDetails={scoutDetails}
        attachement={data}
      />
      <EditTagsForSingleAttachment
        tagsDrawerClose={tagsDrawerClose}
        captureTagsDetailsEdit={captureTagsDetailsEdit}
        item={data}
        setTagsDrawerEditOpen={setTagsDrawerEditOpen}
        TagsDrawerEditOpen={TagsDrawerEditOpen}
      />
      <LoadingComponent loading={loading} />
      <Toaster richColors closeButton position="top-right" />
    </div>
  );
};
export default SingleImageView;