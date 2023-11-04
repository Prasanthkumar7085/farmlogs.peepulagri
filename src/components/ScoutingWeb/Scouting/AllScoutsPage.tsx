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
import SuggestionsIcon from "@/components/Core/SvgIcons/SuggitionsIcon";
const AllScoutsWebPage = () => {
  const router = useRouter();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [data, setData] = useState<any>([]);
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

      const groupedData: any = {};
      // Iterate through yourData and group objects by createdAt date
      response?.data.forEach((item: any) => {
        const createdAt = timePipe(item.createdAt, "DD-MM-YYYY")
        if (!groupedData[createdAt]) {
          groupedData[createdAt] = [item];
        } else {
          groupedData[createdAt].push(item);
        }
      });
      // Convert the groupedData object into an array
      const groupedArray = Object.values(groupedData);
      setData(groupedArray)

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
      {data?.length ? data.map((item: any, index: any) => {


        return (
          <div key={index}>
            <Typography style={{ fontWeight: "bold", position: "sticky", top: "0px" }}>
              {timePipe(item[0].createdAt, "ddd, MMM D, YYYY")}
            </Typography>
            {item.map((row: any, rowIndex: any) => {
              let cropObj = row.farm_id.crops.find(
                (ite: any) => ite._id == row.crop_id
              );
              let cropName = cropObj?.title;



              return (
                <div className={styles.eachDayScouting} key={rowIndex}>


                  <div
                    className={styles.scoutDay}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "30px",
                      }}
                    >

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "20px",
                          position: "sticky",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {row.created_by.full_name}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img
                            className={styles.farmsIcon}
                            alt="Farm Shape"
                            src="/farmshape2.svg"
                          />
                          {row.farm_id.title}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img src="/cropName-icon.svg" alt="" />
                          {cropName}
                        </div>
                      </div>
                    </div>
                    {row?.suggestions ?
                      <div
                        className={styles.summaryBtn}
                        style={{
                          color: "#F2A84C",
                        }}
                        onClick={() => {
                          setOpenDaySummary(true);
                          setSelectedItemDetails(row);
                        }}
                      >
                        <SuggestionsIcon /> Recommandations
                      </div>
                      :
                      <div
                        className={styles.summaryBtn}
                        onClick={() => {
                          setOpenDaySummary(true);
                          setSelectedItemDetails(row);
                        }}
                      >
                        <SummaryIcon /> <span style={{ color: row?.summary ? "#05A155" : "red" }}
                        >Summary</span>
                      </div>}

                  </div>
                  <ScoutingDailyImages
                    item={row}
                    key={rowIndex}
                    onClickAttachment={onClickAttachment}
                  />
                </div>
              )
            })}
          </div>
        )
      }) : ""}
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
    </div >
  );
};

export default AllScoutsWebPage;