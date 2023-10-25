import ScoutsNavBarWeb from "./ScoutsHeader";
import styles from "../farms/FarmsNavBar.module.css"
import ScoutingCardWeb from "./ScoutingCard";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import getAllScoutsService from "../../../../lib/services/ScoutServices/getAllScoutsService";
import { useSelector } from "react-redux";
import LoadingComponent from "@/components/Core/LoadingComponent";
import Image from "next/image";
import ScoutingDailyImages from "../ListScoutsComponents/ScoutingDailyImages";
import {
  ScoutAttachmentDetails,
  SingleScoutResponse,
} from "@/types/scoutTypes";
import SingleScoutViewDetails from "./ViewScouting";
import { SummaryIcon } from "@/components/Core/SvgIcons/summaryIcon";
import { Typography } from "@mui/material";
import timePipe from "@/pipes/timePipe";
import DaySummaryComponent from "../ListScoutsComponents/DaySummaryComponent";
const AllScoutsWebPage = () => {
  const router = useRouter();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewAttachmentId, setViewAttachmentId] = useState("");
  const [previewImageDialogOpen, setPreviewImageDialogOpen] = useState(false);
  const [onlyImages, setOnlyImages] = useState([]);
  const [openDaySummary, setOpenDaySummary] = useState(false);
  const [seletectedItemDetails, setSelectedItemDetails] =
    useState<SingleScoutResponse>();

  const unWindImages = (data: Array<SingleScoutResponse>) => {
    let array: any = [];
    data.length &&
      data.filter((item: SingleScoutResponse) => {
        let scoutId = item._id;
        let updatedAttachments: any =
          item.attachments?.length &&
          item.attachments.map((attachemntItem: ScoutAttachmentDetails) => {
            return { ...attachemntItem, scout_id: scoutId };
          });
        array = [...array, ...updatedAttachments];
      });
    let details = [];
    if (array.length) {
      details = array.map((item: any, index: number) => {
        if (item.type.includes("video")) {
          return {
            ...item,
            src: "/videoimg.png",
            height: 80,
            width: 60,
            type: item.type,
            caption: `${index + 1} image`,
            original: item?.url,
          };
        } else if (item.type.includes("application")) {
          return {
            ...item,
            src: "/pdf-icon.png",
            height: 80,
            width: 60,
            type: item.type,
            caption: `${index + 1} image`,
            original: item.url,
          };
        } else {
          return {
            ...item,
            src: item.url,
            height: 80,
            width: 60,
            type: item.type,
          };
        }
      });
    }
    return details;
  };

  const getAllScouts = async () => {
    setLoading(true);
    const response = await getAllScoutsService(
      router.query.farm_id as string,
      router.query.crop_id as string,
      accessToken
    );
    if (response?.success) {
      setData(response?.data);
      let onlyImagesData = unWindImages(response?.data);
      setOnlyImages(onlyImagesData);
    }
    setLoading(false);
  };

  const onClickAttachment = (attachmentId: string) => {
    setViewAttachmentId(attachmentId);
    setPreviewImageDialogOpen(true);
  };

  useEffect(() => {
    if (router.isReady && accessToken) {
      getAllScouts();
    }
  }, [router.isReady, accessToken]);

  return (
    <div
      className={styles.AllFarmsPageWeb}
      style={{ paddingTop: "1rem !important" }}
    >
      <ScoutsNavBarWeb />
      <div className={styles.allFarms}>
        {data.length ? (
          <div className={styles.allScoutingCards}>
            {data.map((item: any, index: number) => {
              return (
                <div className={styles.eachDayScouting} key={index}>
                  <div
                    className={styles.scoutDay}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography>
                      {timePipe(item?.createdAt, "ddd, MMM dd, YYYY")}
                    </Typography>
                    <div
                      className={styles.summaryBtn}
                      onClick={() => {
                        setOpenDaySummary(true);
                        setSelectedItemDetails(item);
                      }}
                    >
                      <SummaryIcon /> Summary
                    </div>
                  </div>
                  <ScoutingDailyImages
                    item={item}
                    key={index}
                    onClickAttachment={onClickAttachment}
                  />{" "}
                </div>
              );
            })}
          </div>
        ) : !loading ? (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/emty-folder-image.svg"
              alt="empty folder"
              width={350}
              height={300}
            />
            <p style={{ margin: "0" }}>No Scoutings for this crop</p>
          </div>
        ) : (
          ""
        )}
      </div>
      <SingleScoutViewDetails
        viewAttachmentId={viewAttachmentId}
        onlyImages={onlyImages}
        previewImageDialogOpen={previewImageDialogOpen}
        setPreviewImageDialogOpen={setPreviewImageDialogOpen}
      />
      <DaySummaryComponent
        openDaySummary={openDaySummary}
        setOpenDaySummary={setOpenDaySummary}
        seletectedItemDetails={seletectedItemDetails}
      />
      <LoadingComponent loading={loading} />
    </div>
  );
};

export default AllScoutsWebPage;