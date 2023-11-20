import ImageComponent from "@/components/Core/ImageComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import {
  ScoutAttachmentDetails,
  SingleScoutResponse,
} from "@/types/scoutTypes";

import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import TablePaginationComponentForScouts from "@/components/Core/TablePaginationComponentForScouts";
import timePipe from "@/pipes/timePipe";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import { Button, Tooltip, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { prepareURLEncodedParams } from "../../../../lib/requestUtils/urlEncoder";
import ListAllCropsForDropDownServices from "../../../../lib/services/CropServices/ListAllCropsForDropDownServices";
import ListAllFarmForDropDownService from "../../../../lib/services/FarmsService/ListAllFarmForDropDownService";
import getAllExistedScoutsService from "../../../../lib/services/ScoutServices/AllScoutsServices/getAllExistedScoutsService";
import getAllUsersService from "../../../../lib/services/Users/getAllUsersService";
import SingleScoutViewDetails from "../Scouting/ViewScouting";
import styles from "../farms/FarmsNavBar.module.css";
import CropAutoCompleteFoScouts from "./CropAutoCompleteFoScouts";
import DateRangePickerForAllScouts from "./DateRangePickerForAllScouts";
import DaySummaryComponent from "./DaySummaryComponent";
import FarmAutoCompleteInAllScouting from "./FarmAutoCompleteInAllScouting";
import ScoutingDailyImages from "./ScoutingDailyImages";

interface ApiMethodProps {
  page: string | number;
  limit: string | number;
  farmId: string;
  userId: string;
  fromDate: string;
  toDate: string;
  cropId: string;
}
const ListScouts: FunctionComponent = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [, , removeCookie] = useCookies(["userType"]);
  const [, , loggedIn] = useCookies(["loggedIn"]);

  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [usersOptions, setUserOptions] = useState();
  const [user, setUser] = useState<any>();
  const [farmOptions, setFarmOptions] = useState([]);
  const [farm, setFarm] = useState<any>();
  const [cropOptions, setCropOptions] = useState([]);
  const [crop, setCrop] = useState<any>();
  const [paginationDetails, setPaginationDetails] = useState<any>();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [viewAttachmentId, setViewAttachmentId] = useState("");
  const [previewImageDialogOpen, setPreviewImageDialogOpen] = useState(false);
  const [onlyImages, setOnlyImages] = useState([]);
  const [openDaySummary, setOpenDaySummary] = useState(false);
  const [seletectedItemDetails, setSelectedItemDetails] =
    useState<SingleScoutResponse>();

  const onChangeUser = async (e: any, value: any) => {
    if (value) {
      setUser(value);
      setFarm(null);
      setCrop(null);
      setPage(1);
      await getAllScoutsList({
        page: 1,
        limit: router.query.limit as string,
        userId: value?._id,
        farmId: "",
        cropId: "",
        fromDate: router.query.from_date as string,
        toDate: router.query.to_date as string,
      });
      await getAllFarms(value?._id);
      await getAllCrops("", "", value?._id);
    } else {
      setUser(null);
      setPage(1);
      await getAllFarms();
      await getAllScoutsList({
        page: 1,
        limit: router.query.limit as string,
        userId: "",
        farmId: router.query.farm_id as string,
        cropId: router.query.crop_id as string,
        fromDate: router.query.from_date as string,
        toDate: router.query.to_date as string,
      });
      await getAllCrops("", router.query.farm_id as string, "");
    }
  };

  const onSelectFarmFromDropDown = async (value: any, reason: string) => {
    if (value) {
      setFarm(value);
      setCrop(null);
      setPage(1);
      getAllScoutsList({
        page: 1,
        limit: router.query.limit as string,
        userId: router.query.created_by as string,
        farmId: value._id,
        cropId: "",
        fromDate: router.query.from_date as string,
        toDate: router.query.to_date as string,
      });
      await getAllCrops("", value?._id, router.query.created_by as string);
    } else {
      setFarm(null);
      setPage(1);
      getAllScoutsList({
        page: 1,
        limit: router.query.limit as string,
        farmId: "",
        userId: router.query.created_by as string,
        fromDate: router.query.from_date as string,
        toDate: router.query.to_date as string,
        cropId: router.query.crop_id as string,
      });
      await getAllCrops("", "", router.query.created_by as string);
    }
  };

  const onSelectCropFromDropDown = (value: any, reason: string) => {
    if (value) {
      setCrop(value);
      setPage(1);
      getAllScoutsList({
        page: 1,
        limit: router.query.limit as string,
        farmId: router.query.farm_id as string,
        userId: router.query.created_by as string,
        fromDate: router.query.from_date as string,
        toDate: router.query.to_date as string,
        cropId: value?._id,
      });
    } else {
      setCrop(null);
      setPage(1);
      getAllScoutsList({
        page: 1,
        limit: router.query.limit as string,
        farmId: router.query.farm_id as string,
        userId: router.query.created_by as string,
        fromDate: router.query.from_date as string,
        toDate: router.query.to_date as string,
        cropId: "",
      });
    }
  };

  const onDateFilterChange = (date1: string, date2: string) => {
    if (date1 && date2) {
      setFromDate(date1);
      setToDate(date2);
      setPage(1);
      getAllScoutsList({
        page: 1,
        limit: router.query.limit as string,
        farmId: router.query.farm_id as string,
        userId: router.query.created_by as string,
        fromDate: date1,
        toDate: date2,
        cropId: router.query.crop_id as string,
      });
    } else {
      setFromDate("");
      setToDate("");
      setPage(1);
      getAllScoutsList({
        page: 1,
        limit: router.query.limit as string,
        farmId: router.query.farm_id as string,
        userId: router.query.created_by as string,
        cropId: router.query.crop_id as string,
        fromDate: "",
        toDate: "",
      });
    }
  };

  const captureRowPerItems = (value: number) => {
    setPage(1);
    setLimit(value);
    getAllScoutsList({
      page: 1,
      limit: value,
      farmId: router.query.farm_id as string,
      userId: router.query.created_by as string,
      cropId: router.query.crop_id as string,
      fromDate: router.query.from_date as string,
      toDate: router.query.to_date as string,
    });
  };
  const capturePageNum = (value: number) => {
    setPage(value);
    getAllScoutsList({
      page: value,
      limit: router.query.limit as string,
      farmId: router.query.farm_id as string,
      userId: router.query.created_by as string,
      cropId: router.query.crop_id as string,
      fromDate: router.query.from_date as string,
      toDate: router.query.to_date as string,
    });
  };
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
  const getAllScoutsList = async ({
    page = 1,
    limit = 10,
    farmId,
    userId,
    fromDate,
    toDate,
    cropId,
  }: Partial<ApiMethodProps>) => {
    setLoading(true);
    let url = `/scouts/${page}/${limit}`;
    let queryParams: any = {};
    if (page) {
      queryParams["page"] = page;
    }
    if (limit) {
      queryParams["limit"] = limit;
    }
    if (farmId) {
      queryParams["farm_id"] = farmId;
    }
    if (userId) {
      queryParams["created_by"] = userId;
    }
    if (fromDate && toDate) {
      queryParams["from_date"] = fromDate;
      queryParams["to_date"] = toDate;
    }
    if (cropId) {
      queryParams["crop_id"] = cropId;
    }
    const { page: pageNum, limit: rowsPerPage, ...restParams } = queryParams;

    router.push({ query: queryParams });
    url = prepareURLEncodedParams(url, restParams);
    const response = await getAllExistedScoutsService({
      url: url,
      token: accessToken,
    });

    if (response?.success) {
      const { data, ...rest } = response;
      setPaginationDetails(rest);

      const groupedData: any = {};
      // Iterate through yourData and group objects by createdAt date
      data.forEach((item: any) => {
        const createdAt = timePipe(item.createdAt, "DD-MM-YYYY");
        if (!groupedData[createdAt]) {
          groupedData[createdAt] = [item];
        } else {
          groupedData[createdAt].push(item);
        }
      });
      // Convert the groupedData object into an array
      const groupedArray = Object.values(groupedData);
      console.log(groupedArray);
      setData(groupedArray);

      let onlyImagesData = unWindImages(data);
      setOnlyImages(onlyImagesData);
    } else if (response?.statusCode == 403) {
      await logout();
    } else {
      toast.error("Failed to fetch");
    }
    setLoading(false);
  };

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
  const getAllUsers = async (userId = "") => {
    const response = await getAllUsersService({ token: accessToken });

    if (response?.success) {
      setUserOptions(response?.data);
      if (userId) {
        let obj =
          response?.data?.length &&
          response?.data?.find(
            (item: any, index: number) => item._id == userId
          );

        setUser(obj);
      }
    } else if (response?.statusCode == 403) {
      await logout();
    }
  };

  const getAllFarms = async (userId = "", farmId = "") => {
    let queryParams: any = {
      order_by: "title",
      order_type: "asc",
    };

    let url = prepareURLEncodedParams("", queryParams);

    const response = await ListAllFarmForDropDownService(url, accessToken);
    if (response?.success) {
      setFarmOptions(response?.data);
      if (farmId) {
        let obj =
          response?.data?.length &&
          response?.data?.find((item: any) => item._id == farmId);
        setFarm(obj);
      }
    } else if (response?.statusCode == 403) {
      await logout();
    }
  };

  const modifyDataToGroup = (data: any) => {
    if (Array.isArray(data)) {
      const outputArray: any = [];

      data.forEach((item) => {
        const farmId = item._id;
        const farmTitle = item.title;

        item.crops.forEach((crop: any) => {
          const modifiedCrop = {
            farm_id: farmId,
            farm_title: farmTitle,
            ...crop,
          };

          outputArray.push(modifiedCrop);
        });
      });

      return outputArray;
    } else return [];
  };
  const getAllCrops = async (cropId = "", farmId = "", userId = "") => {
    let queryParams: any = {};

    if (farmId) {
      queryParams["farm_id"] = farmId;
    }
    if (userId) {
      queryParams["user_id"] = userId;
    }
    let url = prepareURLEncodedParams("", queryParams);
    const response = await ListAllCropsForDropDownServices(url);
    if (response?.success) {
      let data = response?.data;
      data = modifyDataToGroup(data);

      setCropOptions(data);
      if (cropId) {
        let obj = data?.length && data?.find((item: any) => item._id == cropId);
        setCrop(obj);
      }
    }
  };

  const clearAllFilterAndGetData = async () => {
    setUser("");
    setFarm("");
    setFromDate("");
    setToDate("");
    setCrop("");
    setPage(1);
    setLimit(10);
    await getAllScoutsList({});
    // getAllUsers();
    getAllFarms();
    getAllCrops();
  };

  useEffect(() => {
    if (router.isReady && accessToken) {
      // getAllUsers(router.query.created_by as string);
      getAllFarms(
        router.query.created_by as string,
        router.query.farm_id as string
      );
      getAllCrops(
        router.query.crop_id as string,
        router.query.farm_id as string,
        router.query.created_by as string
      );

      getAllScoutsList({
        page: router.query?.page as string,
        limit: router.query?.limit as string,
        farmId: router.query?.farm_id as string,
        userId: router.query?.created_by as string,
        fromDate: router.query?.from_date as string,
        toDate: router.query?.to_date as string,
        cropId: router.query?.crop_id as string,
      });
    }
  }, [router.isReady, accessToken]);

  const onClickAttachment = (attachmentId: string) => {
    setViewAttachmentId(attachmentId);
    setPreviewImageDialogOpen(true);
  };

  return (
    <div className={styles.AllScoutsPageWeb}>
      <div className={styles.scoutPageHeader}>
        <Typography variant="h4">
          <img
            src="/scouting-header-icon.svg"
            alt=""
            height="20px"
            width={"20px"}
          />
          Scouting
        </Typography>
        <div className={styles.allScoutsFilterBlock}>
          {/* <UserDropDownForScouts
            user={user}
            onChangeUser={onChangeUser}
            usersOptions={usersOptions}
          /> */}
          <FarmAutoCompleteInAllScouting
            options={farmOptions}
            onSelectFarmFromDropDown={onSelectFarmFromDropDown}
            label={"title"}
            placeholder={"Select Farm here"}
            defaultValue={farm}
          />
          <CropAutoCompleteFoScouts
            options={cropOptions}
            onSelectFarmFromDropDown={onSelectCropFromDropDown}
            label={"title"}
            placeholder={"Select Crop here"}
            defaultValue={crop}
          />
          <DateRangePickerForAllScouts
            onDateFilterChange={onDateFilterChange}
          />
          <Button
            onClick={clearAllFilterAndGetData}
            disabled={Object.keys(router.query)?.length <= 2}
            sx={{ color: "#000", minWidth: "inherit", padding: "0" }}
          >
            <Tooltip title={"Clear Filter"}>
              <FilterAltIcon sx={{ fontSize: "1.7rem" }} />
            </Tooltip>
          </Button>
        </div>
      </div>
      <div className={styles.allFarms}>
        {data?.length
          ? data.map((item: any, index: any) => {
              return (
                <div key={index} className={styles.allScoutingCards}>
                  <Typography className={styles.postedDate}>
                    <InsertInvitationIcon />
                    <span>
                      {timePipe(item[0].createdAt, "ddd, MMM D, YYYY")}
                    </span>
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
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  gap: "0.325rem",
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
                                  gap: "0.325rem",
                                }}
                              >
                                <img src="/cropName-icon.svg" alt="" />
                                {cropName}
                              </div>
                            </div>
                          </div>

                          {row?.suggestions ? (
                            <div
                              className={styles.hasSuggestions}
                              onClick={() => {
                                setOpenDaySummary(true);
                                setSelectedItemDetails(row);
                              }}
                            >
                              <ImageComponent
                                src={"./scouting/recommendations-icon.svg"}
                                height={16}
                                width={16}
                              />
                              <span>Recommendations</span>
                            </div>
                          ) : (
                            <div
                              className={
                                row?.summary
                                  ? styles.hasSummaryBtn
                                  : styles.noSummaryBtn
                              }
                              onClick={() => {
                                setOpenDaySummary(true);
                                setSelectedItemDetails(row);
                              }}
                            >
                              {row?.summary ? (
                                <ImageComponent
                                  src={"./scouting/HasSummary.svg"}
                                  height={19}
                                  width={19}
                                  alt="no-summary"
                                />
                              ) : (
                                <ImageComponent
                                  src="/no-summary-icon.svg"
                                  height={16}
                                  width={16}
                                  alt="no-summary"
                                />
                              )}
                              <span>Summary</span>
                            </div>
                          )}
                        </div>
                        <ScoutingDailyImages
                          item={row}
                          key={rowIndex}
                          onClickAttachment={onClickAttachment}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })
          : ""}
        {!data?.length && !loading ? (
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
              width={200}
              height={150}
            />
            <Typography className={styles.subTitle}>No Scoutings</Typography>
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
      {!loading ? (
        <TablePaginationComponentForScouts
          paginationDetails={paginationDetails}
          capturePageNum={capturePageNum}
          captureRowPerItems={captureRowPerItems}
          values="Scouts"
        />
      ) : (
        ""
      )}
      <LoadingComponent loading={loading} />
    </div>
  );
};

export default ListScouts;
