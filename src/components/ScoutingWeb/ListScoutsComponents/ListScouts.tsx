import ImageComponent from "@/components/Core/ImageComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import {
  SingleScoutResponse,
} from "@/types/scoutTypes";
import { QueryParamsForScouting, removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import timePipe from "@/pipes/timePipe";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import { Autocomplete, Button, TextField, Tooltip, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { prepareURLEncodedParams } from "../../../../lib/requestUtils/urlEncoder";
import ListAllCropsForDropDownServices from "../../../../lib/services/CropServices/ListAllCropsForDropDownServices";
import ListAllFarmForDropDownService from "../../../../lib/services/FarmsService/ListAllFarmForDropDownService";
import getAllExistedScoutsService from "../../../../lib/services/ScoutServices/AllScoutsServices/getAllExistedScoutsService";
import styles from "../farms/FarmsNavBar.module.css";
import CropAutoCompleteFoScouts from "./CropAutoCompleteFoScouts";
import DaySummaryComponent from "./DaySummaryComponent";
import FarmAutoCompleteInAllScouting from "./FarmAutoCompleteInAllScouting";
import ScoutingDailyImages from "./ScoutingDailyImages";
import getAllLocationsService from "../../../../lib/services/Locations/getAllLocationsService";
import GoogleImageView from "./GoogleImageView";
import TablePaginationComponent from "@/components/Core/TablePaginationComponent";
import DateRangePickerForAllScouts from "./DateRangePickerForAllScouts";
import ScoutingComments from "./ScoutingComments/ScoutingComments";

interface ApiMethodProps {
  page: string | number;
  limit: string | number;
  farmId: string;
  userId: string;
  fromDate: string;
  toDate: string;
  cropId: string;
  farmSearchString: string;
  location: string;
  image_view: boolean;
  pageChange: boolean;
  pageDirection: string;
}
const ListScouts: FunctionComponent = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const paramasFromStore = useSelector((state: any) => state.auth.queryParams);

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
  const [cropOptionsLoading, setCropOptionsLoading] = useState<boolean>(false)
  const [paginationDetails, setPaginationDetails] = useState<any>();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [viewAttachmentId, setViewAttachmentId] = useState("");
  const [previewImageDialogOpen, setPreviewImageDialogOpen] = useState(false);
  const [onlyImages, setOnlyImages] = useState<any>([]);
  const [openDaySummary, setOpenDaySummary] = useState(false);
  const [seletectedItemDetails, setSelectedItemDetails] =
    useState<SingleScoutResponse>();
  const [hasMore, setHasMore] = useState<boolean>()
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [locations, setLocations] = useState<
    Array<{ title: string; _id: string }>
  >([]);
  const [location, setLocation] = useState<{
    _id: string;
    title: string;
  } | null>();
  const [imageDetails, setImageDetails] = useState<any>()
  const [rightBarOpen, setRightBarOpen] = useState<any>(false)
  const [settingLocationLoading, setSettingLocationLoading] = useState(false);
  const [changed, setChanged] = useState(false);
  const [queries, setQueries] = useState<any>()
  const [rendering, setRendering] = useState<boolean>(false)


  //select the drop down and get the farm value
  const onSelectFarmFromDropDown = async (value: any, reason: string) => {
    dispatch(QueryParamsForScouting(""))
    setData([]);
    if (reason == "clear") {

      let routerData = { ...router.query };
      delete routerData?.farm_id;
      delete routerData?.crop_id;
      delete routerData?.farm_search_string;
      delete routerData?.location_id;
      router.push({ query: routerData });
      setCrop(null);
      setFarm(null);
      setData([]);

      getAllFarms({ clearOrNot: true, location_id: router.query.location_id as string });
      await getAllCrops("", "");
      getAllExistedScouts({
        // farmSearchString: value?.title,
        page: 1,
        limit: router.query.limit as string,
        userId: router.query.created_by as string,
        farmId: "",
        cropId: "",
        fromDate: router.query.from_date as string,
        toDate: router.query.to_date as string,
        farmSearchString: "",
        location: router.query.location_id as string,
        image_view: false
      });

      return;
    }
    if (value) {
      setFarm(value);
      setCrop(null);
      setPage(1);
      setSettingLocationLoading(true);
      setLocation(value?.location_id)
      setTimeout(() => {
        setSettingLocationLoading(false);
      }, 1);

      await getAllExistedScouts({
        farmSearchString: value?.title,
        page: 1,
        limit: router.query.limit as string,
        userId: router.query.created_by as string,
        farmId: value._id,
        cropId: "",
        fromDate: router.query.from_date as string,
        toDate: router.query.to_date as string,
        location: value?.location_id?._id as string,
        image_view: false
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
        location: router.query.location_id as string,
        image_view: false


      });
      await getAllCrops("", "");
    }
  };

  //get the crop object
  const onSelectCropFromDropDown = (value: any, reason: string) => {
    setRightBarOpen(false)
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
        location: router.query.location_id as string,
        image_view: false

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
        location: router.query.location_id as string,
        image_view: false

      });
    }
  };

  const onDateFilterChange = (date1: string, date2: string) => {
    dispatch(QueryParamsForScouting(""))

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
        location: router.query.location_id as string,
        image_view: false

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
        location: router.query.location_id as string
      });
    }
  };

  //get the limit value
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
      location: router.query.location_id as string
    });
  };
  //get the page value
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
      location: router.query.location_id as string
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
    location,
    image_view = false,
    pageChange = false,
    pageDirection
  }: Partial<ApiMethodProps>) => {
    // if (!cropId) {
    //   setData([]);
    //   return;
    // }
    setRightBarOpen(false)
    setLoading(true);
    try {
      // let url = `/crops/${cropId}/images/${page}/${limit}`;
      let url = `/farm-images/all/${page}/${limit}`;
      let queryParams: any = { "include": "tags" };
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
      if (location && location != '1') {
        queryParams["location_id"] = location
      }

      const {
        page: pageNum,
        limit: rowsPerPage,
        farm_search_string,
        ...restParams

      } = queryParams;
      if (image_view && pageChange == false) {
        let temp = { ...queryParams, view: paramasFromStore?.view, image_id: paramasFromStore.image_id }
        router.push({ query: temp });
      }
      else {
        setRightBarOpen(false)
        let temp = { ...queryParams }
        delete temp?.image_id;
        delete temp?.view;
        delete temp?.view_limit;
        router.push({ query: temp });
      }

      setQueries(queryParams)
      url = prepareURLEncodedParams(url, restParams);
      const response = await getAllExistedScoutsService({
        url: url,
        token: accessToken,
      });

      if (response?.success) {
        setHasMore(response?.has_more)
        const { data, ...rest } = response;
        setPaginationDetails(rest);
        setOnlyImages(response.data);
        if (pageChange && pageDirection == "next") {
          let temp = { ...queryParams, view: true, image_id: response?.data[0]?._id }
          router.push({ query: temp });
          setImageDetails(response?.data[0])
          dispatch(QueryParamsForScouting(temp))

        }
        if (pageChange && pageDirection == "prev") {
          let temp = { ...queryParams, view: true, image_id: response?.data[response?.data?.length - 1]?._id }
          router.push({ query: temp });
          dispatch(QueryParamsForScouting(temp))
          setImageDetails(response?.data[response?.data?.length - 1])

        }
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

  // const getAllUsers = async (userId = "") => {
  //   const response = await getAllUsersService({ token: accessToken });

  //   if (response?.success) {
  //     setUserOptions(response?.data);
  //     if (userId) {
  //       let obj =
  //         response?.data?.length &&
  //         response?.data?.find(
  //           (item: any, index: number) => item._id == userId
  //         );

  //       setUser(obj);
  //     }
  //   } else if (response?.statusCode == 403) {
  //     await logout();
  //   }
  // };


  const getLocations = async (newLocation = "") => {
    setOptionsLoading(true);
    try {
      const response = await getAllLocationsService(accessToken);
      if (response?.success) {
        setLocations(response?.data);
        if (newLocation) {
          setSettingLocationLoading(true);
          const newLocationObject = response?.data?.find(
            (item: any) => item?._id == newLocation
          );

          setLocation(newLocationObject);
          setTimeout(() => {
            setSettingLocationLoading(false);
          }, 1);
        } else {
          setSettingLocationLoading(true);

          // setLocation({ title: 'All', _id: '1' });
          setTimeout(() => {
            setSettingLocationLoading(false);
          }, 1);
        }
      }
      if (response?.data?.length) {
        setLocations([{ title: "All", _id: "1" }, ...response?.data]);
      } else {
        setLocations([{ title: "All", _id: "1" }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setOptionsLoading(false);
    }
  };


  const getAllFarms = async ({
    farmId = "",
    searchString = "",
    location_id = "",
    searchStringChangeOrNot = false,
    clearOrNot = false,
  }: Partial<{
    farmId: string;
    searchString: string;
    location_id: string;
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
        accessToken,
        location_id,
      );
      if (response?.success) {
        setFarmOptions(response?.data);



        if (farmId || router.query.farm_id) {

          let obj =
            response?.data?.length &&
            response?.data?.find((item: any) => item._id == farmId);
          setFarm(obj);
          getAllCrops(
            router.query.crop_id as string,
            obj?._id as string
          );
          getLocations(obj?.location_id?._id)
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
    setCropOptionsLoading(true);
    if (!farmId) {
      setCropOptionsLoading(false);
      return;
    }
    try {
      const response = await ListAllCropsForDropDownServices(
        farmId as string,
        accessToken
      );
      if (response?.success) {
        let data = response?.data;
        // data = modifyDataToGroup(data);
        if (!data?.length) {
          setCropOptionsLoading(false);
          setCrop(null);
          setCropOptions(data);
          setPaginationDetails({});
          return;
        }
        setCropOptions(data);
        if (cropId || router.query.crop_id) {
          let obj =
            data?.length && data?.find((item: any) => item._id == cropId);
          setCrop(obj);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCropOptionsLoading(false);
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
        location_id: router.query.location_id as string
      });
      getLocations(router.query.location_id as string);
      getAllExistedScouts({
        page: router.query.page as string,
        limit: router.query.limit as string,
        farmId: router.query.farm_id as string,
        userId: router.query.user_id as string,
        fromDate: router.query.from_date as string,
        toDate: router.query.to_date as string,
        cropId: router.query.crop_id as string,
        farmSearchString: router.query.farm_search_string as string,
        location: router.query.location_id as string,
        image_view: router.query.view ? true : false
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

  const onClickAttachment = (attachment: any, farmId: string, cropId: string, location_id: string) => {

    setRightBarOpen(true)
    setImageDetails(attachment);
    let temp = { ...queries, view: true, image_id: attachment?._id }
    dispatch(QueryParamsForScouting(temp))
    if (attachment?._id) {
      router.replace({ pathname: "/scouts", query: { ...router.query, view: true, image_id: attachment?._id } });

    }
    else {
      router.replace({ pathname: "/scouts", query: { ...router.query } });

    }

  };

  const onChangeLocation = (e: any, value: any, reason: any) => {

    dispatch(QueryParamsForScouting(""))

    if (value) {
      setChanged(true);
      setLocation(value);
      setFarm(null);
      setCrop(null)
      getAllFarms({
        farmId: '',
        searchString: '',
        location_id: value?._id as string
      });
      getAllExistedScouts({
        page: 1,
        limit: 50,
        farmId: '',
        userId: router.query.user_id as string,
        fromDate: router.query.from_date as string,
        toDate: router.query.to_date as string,
        cropId: router.query.crop_id as string,
        farmSearchString: '',
        location: value?._id,
        image_view: false
      });

    }
    else {
      setFarm(null);
      setCrop(null)
      setChanged(true);
      setLocation(null);
      getAllFarms({
        farmId: '',
        searchString: '',
        location_id: ""
      });
      getAllExistedScouts({
        page: 1,
        limit: 50,
        farmId: '',
        userId: router.query.user_id as string,
        fromDate: router.query.from_date as string,
        toDate: router.query.to_date as string,
        cropId: "",
        farmSearchString: '',
        location: "",
        image_view: false
      });
    }
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
          <DateRangePickerForAllScouts
            onDateFilterChange={onDateFilterChange}
          />
          {/* <UserDropDownForScouts
            user={user}
            onChangeUser={onChangeUser}
            usersOptions={usersOptions}
          /> */}
          {!settingLocationLoading ? (
            <Autocomplete
              sx={{
                width: "100%",

                borderRadius: "4px",
              }}
              id="size-small-outlined-multi"
              size="small"
              fullWidth
              noOptionsText={"No such location"}
              value={location}
              isOptionEqualToValue={(option, value) =>
                option.title === value.title
              }
              getOptionLabel={(option: { title: string; _id: string }) =>
                option.title
              }
              options={locations}
              loading={optionsLoading}
              onChange={onChangeLocation}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search by location"
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiInputBase-root": {
                      fontSize: "clamp(.875rem, 1vw, 1.125rem)",
                      backgroundColor: "#fff",
                      border: "none",
                    },
                  }}
                />
              )}
            />
          ) : (
            ""
          )}
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
            cropOptionsLoading={cropOptionsLoading}
          />

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

      <div style={{ display: "flex", flexDirection: "row", gap: "1rem", marginBottom: "1rem" }}>

        <div className={rightBarOpen || router.query.view ? styles.AllScoutsLeftWebPage : styles.AllScoutsWeb}>
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
                      rightBarOpen={rightBarOpen}
                    />
                  </div>
                </div>
              );
            })
            : ""}
          {!data?.length && !loading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "10%"

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

        {(rightBarOpen || router.query.view) && onlyImages?.length ?
          <div className={rightBarOpen || router.query.view ? styles.AllScoutsRightWebPage : styles.AllScoutsRightClose}>
            <GoogleImageView
              rightBarOpen={rightBarOpen}
              setRightBarOpen={setRightBarOpen}
              imageDetails={imageDetails}
              setImageDetails={setImageDetails}
              data={onlyImages}
              getAllExistedScouts={getAllExistedScouts}
              hasMore={hasMore}
              setOnlyImages={setOnlyImages}



            />
          </div> : ""}
        {(rightBarOpen || router.query.view) && onlyImages?.length ?
          <div className={rightBarOpen || router.query.view ? styles.AllScoutsComments : styles.AllScoutsCommentsClose}>
            <ScoutingComments
              rightBarOpen={rightBarOpen}
              setRightBarOpen={setRightBarOpen}
              imageDetails={imageDetails}
              setImageDetails={setImageDetails}


            />
          </div> : ""}

      </div>

      <DaySummaryComponent
        openDaySummary={openDaySummary}
        setOpenDaySummary={setOpenDaySummary}
        seletectedItemDetails={seletectedItemDetails}
      />
      {!loading ? (
        <TablePaginationComponent
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
