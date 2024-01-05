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
import styles from "../farms/FarmsNavBar.module.css";
import CropAutoCompleteFoScouts from "./CropAutoCompleteFoScouts";
import DateRangePickerForAllScouts from "./DateRangePickerForAllScouts";
import DaySummaryComponent from "./DaySummaryComponent";
import FarmAutoCompleteInAllScouting from "./FarmAutoCompleteInAllScouting";
import ScoutingDailyImages from "./ScoutingDailyImages";
import { errorMonitor } from "events";

interface ApiMethodProps {
  page: string | number;
  limit: string | number;
  farmId: string;
  userId: string;
  fromDate: string;
  toDate: string;
  cropId: string;
  farmSearchString: string;
}
const ListScouts: FunctionComponent = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [, , removeCookie] = useCookies(["userType_v2"]);
  const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);

  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
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

  const [optionsLoading, setOptionsLoading] = useState(false);
  const [searchString, setSearchString] = useState("");

  const onSelectFarmFromDropDown = async (value: any, reason: string) => {
    setData([]);
    if (reason == "clear") {
      let routerData = { ...router.query };
      delete routerData?.farm_id;
      delete routerData?.crop_id;
      delete routerData?.farm_search_string;

      router.push({ query: routerData });
      setCrop(null);
      setFarm(null);
      setData([]);

      getAllFarms({ clearOrNot: true });
      getAllExistedScouts({
        // farmSearchString: value?.title,
        page: 1,
        limit: router.query.limit as string,
        userId: router.query.created_by as string,
        farmId: "",
        cropId: "",
        fromDate: router.query.from_date as string,
        toDate: router.query.to_date as string,
        farmSearchString:""
      });

      return;
    }
    if (value) {
      setFarm(value);
      setCrop(null);
      setPage(1);

      router.push({
        query: { ...router.query, farm_search_string: value?.title },
      });
      getAllExistedScouts({
        farmSearchString: value?.title,
        page: 1,
        limit: router.query.limit as string,
        userId: router.query.created_by as string,
        farmId: value._id,
        cropId: "",
        fromDate: router.query.from_date as string,
        toDate: router.query.to_date as string,
      });
      await getAllCrops("", value?._id);
    } else {
      setFarm(null);
      setCrop(null);
      setPage(1);
      getAllExistedScouts({
        page: 1,
        limit: router.query.limit as string,
        farmId: "",
        userId: router.query.created_by as string,
        fromDate: router.query.from_date as string,
        toDate: router.query.to_date as string,
        cropId: router.query.crop_id as string,
      });
      await getAllCrops("", "");
    }
  };

  const onSelectCropFromDropDown = (value: any, reason: string) => {
    if (value) {
      setCrop(value);
      setPage(1);
      getAllExistedScouts({
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

      setLoading(false);
      getAllExistedScouts({
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
      getAllExistedScouts({
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
      getAllExistedScouts({
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
    getAllExistedScouts({
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
    getAllExistedScouts({
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
      removeCookie("userType_v2");
      loggedIn_v2("loggedIn_v2");
      router.push("/");
      await dispatch(removeUserDetails());
      await dispatch(deleteAllMessages());
    } catch (err: any) {
      console.error(err);
    }
  };
  const getAllExistedScouts = async ({
    page = 1,
    limit = 50,
    farmId,
    userId,
    fromDate,
    toDate,
    cropId,
    farmSearchString = router.query.farm_search_string as string,
  }: Partial<ApiMethodProps>) => {
    // if (!cropId) {
    //   setData([]);
    //   return;
    // }
    setLoading(true);
    try {
      // let url = `/crops/${cropId}/images/${page}/${limit}`;
      let url = `/farm-images/all/${page}/${limit}`;
      let queryParams: any = {};
      if (page) {
        queryParams["page"] = page;
      }
      if (limit) {
        queryParams["limit"] = limit;
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
      if (farmId) {
        queryParams["farm_id"] = farmId;
      }
      if (farmSearchString) {
        queryParams["farm_search_string"] = farmSearchString;
      }

      const {
        page: pageNum,
        limit: rowsPerPage,
        farm_search_string,
        ...restParams
      } = queryParams;

      router.push({ query: queryParams });
      url = prepareURLEncodedParams(url, restParams);
      const response = await getAllExistedScoutsService({
        url: url,
        token: accessToken,
      });

      if (response?.success) {
        const { data, ...rest } = response;
        setPaginationDetails(rest);
        setOnlyImages(response.data);
        const groupedData: any = {};
        // Iterate through Data and group objects by uploaded_at date
        data.forEach((item: any) => {
          const createdAt = timePipe(item.uploaded_at, "DD-MM-YYYY");
          if (!groupedData[createdAt]) {
            groupedData[createdAt] = [item];
          } else {
            groupedData[createdAt].push(item);
          }
        });
        // Convert the groupedData object into an array
        const groupedArray = Object.values(groupedData);
        setData(groupedArray);
        setLoading(false);
      } else if (response?.statusCode == 403) {
        await logout();
      } else {
        toast.error("Failed to fetch");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  const getAllFarms = async ({
    farmId = "",
    searchString = "",
    searchStringChangeOrNot = false,
    clearOrNot = false,
  }: Partial<{
    farmId: string;
    searchString: string;
    searchStringChangeOrNot: boolean;
    clearOrNot: boolean;
  }>) => {
    try {
      // if (searchString) {
      //   router.push({
      //     query: { ...router.query, farm_search_string: searchString },
      //   });
      // }
      const response = await ListAllFarmForDropDownService(
        searchString,
        accessToken
      );
      if (response?.success) {
        setFarmOptions(response?.data);

        if (farmId) {
          let obj =
            response?.data?.length &&
            response?.data?.find((item: any) => item._id == farmId);
          setFarm(obj);
          getAllCrops(
            router.query.crop_id as string,
            response?.data[0]?._id as string
          );
        }
        // if (searchStringChangeOrNot) {
        //   setFarm(null);
        // } else {
        //   if (!clearOrNot) {
        //     if (farmId) {
        // let obj =
        //   response?.data?.length &&
        //   response?.data?.find((item: any) => item._id == farmId);
        // setFarm(obj);
        //       getAllCrops(router.query.crop_id as string, farmId);
        //     } else {
        //       setFarm(response?.data[0]);
        // getAllCrops(
        //   router.query.crop_id as string,
        //   response?.data[0]?._id as string
        // );
        //     }
        //   }
        // }
      } else if (response?.statusCode == 403) {
        await logout();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getAllCrops = async (
    cropId = router.query.crop_id as string,
    farmId: string
  ) => {
    setLoading(true);
    if (!farmId) {
      setLoading(false);
      return;
    }
    try {
      const response = await ListAllCropsForDropDownServices(
        farmId,
        accessToken
      );
      if (response?.success) {
        let data = response?.data;
        // data = modifyDataToGroup(data);
        if (!data?.length) {
          setLoading(false);
          setCrop(null);
          setCropOptions(data);
          setPaginationDetails({});
          return;
        }
        setCropOptions(data);
        if (cropId) {
          let obj =
            data?.length && data?.find((item: any) => item._id == cropId);
          setCrop(obj);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // const clearAllFilterAndGetData = async () => {
  //   setUser("");
  //   setFarm("");
  //   setFromDate("");
  //   setToDate("");
  //   setCrop(null);
  //   setPage(1);
  //   setLimit(50);
  //   await getAllExistedScouts({});
  // };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (router.isReady && accessToken && !mounted) {
      setMounted(true);
      getAllFarms({
        farmId: router.query.farm_id as string,
        searchString: router.query.farm_search_string as string,
      });
      getAllExistedScouts({
        page: router.query.page as string,
        limit: router.query.limit as string,
        farmId: router.query.farm_id as string,
        userId: router.query.user_id as string,
        fromDate: "",
        toDate: "",
        cropId: router.query.crop_id as string,
        farmSearchString: router.query.farm_search_string as string,
      });
    }
  }, [router.isReady, accessToken]);

  useEffect(() => {
    let debounce = setTimeout(() => {
      if (mounted) {
        setFarm(null);
        getAllFarms({
          // farmId: router.query.farm_id as string,
          searchString: searchString,
          searchStringChangeOrNot: true,
        });
      }
    }, 500);
    return () => clearInterval(debounce);
  }, [searchString]);

  const onClickAttachment = (attachmentId: string) => {
    router.push(
      `/scouts/farm/${router.query.crop_id}/crops/${router.query.crop_id}/${attachmentId}`
    );
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
            optionsLoading={optionsLoading}
            setOptionsLoading={setOptionsLoading}
            searchString={searchString}
            setSearchString={setSearchString}
          />
          <CropAutoCompleteFoScouts
            options={cropOptions}
            onSelectFarmFromDropDown={onSelectCropFromDropDown}
            farm={farm}
            placeholder={"Select Crop here"}
            defaultValue={crop}
          />
          {/* <DateRangePickerForAllScouts
            onDateFilterChange={onDateFilterChange}
          /> */}
          {/* <Button
            onClick={clearAllFilterAndGetData}
            disabled={Object.keys(router.query)?.length <= 2}
            sx={{ color: "#000", minWidth: "inherit", padding: "0" }}
          >
            <Tooltip title={"Clear Filter"}>
              <FilterAltIcon sx={{ fontSize: "1.7rem" }} />
            </Tooltip>
          </Button> */}
        </div>
      </div>
      <div className={styles.AllScoutsWeb}>
        {data?.length
          ? data.map((item: any, index: any) => {
              return (
                <div key={index} className={styles.allScoutingCards}>
                  <Typography className={styles.postedDate}>
                    <InsertInvitationIcon />
                    <span>
                      {timePipe(item[0].uploaded_at, "ddd, MMM D, YYYY")}
                    </span>
                  </Typography>

                  <div className={styles.eachDayScouting} key={index}>
                    <ScoutingDailyImages
                      item={item}
                      key={index}
                      onClickAttachment={onClickAttachment}
                    />
                  </div>
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
      {/* <SingleScoutViewDetails
        viewAttachmentId={viewAttachmentId}
        onlyImages={onlyImages}
        previewImageDialogOpen={previewImageDialogOpen}
        setPreviewImageDialogOpen={setPreviewImageDialogOpen}
      /> */}
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
