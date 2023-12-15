import { removeTheFilesFromStore, setFarmTitleTemp } from "@/Redux/Modules/Farms";
import NewFolderDiloag from "@/components/Core/AddCropalert/AddNewFolder";
import AlertComponent from "@/components/Core/AlertComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import SelectAutoCompleteForFarms from "@/components/Core/selectDropDownForFarms";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import SortIcon from "@mui/icons-material/Sort";
import {
  Box,
  Divider,
  Drawer,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  ListItem,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { prepareURLEncodedParams } from "../../../../lib/requestUtils/urlEncoder";
import ListAllFarmForDropDownService from "../../../../lib/services/FarmsService/ListAllFarmForDropDownService";
import CropCard from "./CropCard";
import styles from "./crop-card.module.css";
import NoDataMobileComponent from "@/components/Core/NoDataMobileComponent";
import SelectAutoCompleteForFarmsCropPage from "@/components/Core/selectDropDownForFarmsCropPage";

const AllCropsComponent = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const form_Id = router.query.farm_id;

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [defaultValue, setDefaultValue] = useState<any>("");
  const [formId, setFormId] = useState<any>();
  const [formOptions, setFarmOptions] = useState<any>([]);
  const [cropOptions, setCropOptions] = useState<any>([]);
  const [dilogOpen, setDilogOpen] = useState<any>();
  const [loading, setLoading] = useState<any>(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(false);
  const [loadingForAdd, setLoadingForAdd] = useState<any>();
  const [errorMessages, setErrorMessages] = useState([]);
  const [state, setState] = useState({ bottom: false });
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortType, setSortType] = useState("desc");

  const [searchString, setSearchString] = useState("");
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [, , removeCookie] = useCookies(["userType"]);
  const [, , loggedIn] = useCookies(["loggedIn"]);

  const logout = async () => {
    try {
      removeCookie("userType");
      loggedIn("loggedIn");
      router.push("/");
    } catch (err: any) {
      console.error(err);
    }
  };
  const getFarmDetails = async (
    farmsearchstring: any,
    id: any,
    reason = ""
  ) => {
    setOptionsLoading(true);

    if (farmsearchstring) {
      router.push({
        pathname: `/farms/${router.query.farm_id}/crops`,
        query: { search_string: farmsearchstring },
      });
    }

    try {
      let response = await ListAllFarmForDropDownService(
        farmsearchstring,
        accessToken
      );
      if (response?.success == true && response?.data?.length) {
        setFarmOptions(response?.data);
        if (reason == "clear") {
          setDefaultValue(null);
        } else if (id) {
          let selectedObject =
            response?.data?.length &&
            response?.data?.find((item: any) => item._id == id);

          setDefaultValue(selectedObject?.title);
          // dispatch(setFarmTitleTemp(selectedObject?.title));
          captureFarmName(selectedObject);
        } else {
          setDefaultValue(response?.data[0].title);
          // dispatch(setFarmTitleTemp(response?.data[0].title));
          captureFarmName(response?.data[0]);
        }
      } else if (response?.statusCode == 403) {
        await logout();
      } else {
        setFarmOptions([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOptionsLoading(false);
    }
  };

  //get all crops name
  const getCropsDetails = async (
    id: any,
    orderBy = sortBy,
    orderType = sortType
  ) => {
    setLoading(true);

    try {
      let queryParams: any = {};

      if (orderBy) {
        queryParams["sort_by"] = orderBy;
      }
      if (orderType) {
        queryParams["sort_type"] = orderType;
      }

      let options = {
        method: "GET",
        headers: new Headers({
          authorization: accessToken,
        }),
      };
      let url = prepareURLEncodedParams(
        `${process.env.NEXT_PUBLIC_API_URL}/farms/${id}/crops/list`,
        queryParams
      );

      let response = await fetch(url, options);
      let responseData: any = await response.json();

      if (responseData.success == true) {
        setCropOptions(responseData?.data);
      } else if (responseData?.statusCode == 403) {
        await logout();
      } else {
        setCropOptions([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //create crop api call
  const createCrop = async (value: any) => {
    setLoadingForAdd(true);
    let options = {
      method: "POST",
      body: JSON.stringify(value),
      headers: new Headers({
        "content-type": "application/json",
        authorization: accessToken,
      }),
    };
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/crops`,
        options
      );
      let responseData = await response.json();
      if (responseData.success) {
        await getCropsDetails(formId);
        setDilogOpen(false);
        setAlertMessage(responseData.message);
        setAlertType(true);
      } else if (responseData?.status == 422) {
        setErrorMessages(responseData?.errors);
      } else if (responseData?.statusCode == 403) {
        await logout();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingForAdd(false);
    }
  };

  useEffect(() => {
    if (router.isReady && router.query.farm_id && accessToken) {
      let delay = 500;
      let debounce = setTimeout(() => {
        dispatch(removeTheFilesFromStore([]));

        getFarmDetails(
          searchString ? searchString : router.query?.search_string,
          router.query.farm_id
        );
      }, delay);
      return () => clearTimeout(debounce);
    }
  }, [searchString, accessToken, router.isReady]);

  const captureFarmName = (selectedObject: any, reason = "") => {
    if (reason && reason == "clear") {
      router.replace(`/farms/${selectedObject?._id}/crops`);
      getFarmDetails("", router.query.farm_id, reason);
    }
    if (selectedObject && Object.keys(selectedObject).length) {
      setFormId(selectedObject?._id);
      getCropsDetails(selectedObject?._id);
      router.replace(
        `/farms/${selectedObject?._id}/crops?search_string=${selectedObject.title}`
      );
    } else {
      setLoading(false);
      router.replace(`/farms/${router.query.farm_id}/crops`);
    }
  };

  //create new folder (dilog)
  const captureResponseDilog = (value: any) => {
    if (value) {
      setDilogOpen(false);
      setErrorMessages([]);
    } else {
      const { title, crop_area } = value;

      let obj = {
        farm_id: router.query.farm_id,
        title: title ? title?.trim() : "",
        area: crop_area,
      };

      setErrorMessages([]);
      createCrop(obj);
    }
  };

  const toggleDrawer = (open: boolean) => {
    setState({ ...state, bottom: open });
  };

  const sortMethod = (value: number) => {
    if (sortBy == "createdAt") {
      if (value == 1 && sortType == "desc") {
        return true;
      } else if (value == 2 && sortType == "asc") {
        return true;
      }
    } else if (sortBy == "title") {
      if (value == 3 && sortType == "asc") {
        return true;
      } else if (value == 4 && sortType == "desc") {
        return true;
      }
    } else if (sortBy == "area") {
      if (value == 5 && sortType == "desc") {
        return true;
      } else if (value == 6 && sortType == "asc") {
        return true;
      }
    }

    return false;
  };

  const sortByMethod = (sortBy: string, sortType: string) => {
    toggleDrawer(false);
    getCropsDetails(router.query.farm_id as string, sortBy, sortType);
    setSortBy(sortBy);
    setSortType(sortType);
  };

  const SortMenu = () => {
    return (
      <div className={styles.sortOptions}>
        <ListItem className={styles.subTitle}>
          {" "}
          <SortIcon /> <span>Sort By</span>
        </ListItem>
        <ListItem onClick={() => sortByMethod("createdAt", "desc")}>
          <RadioButtonUncheckedIcon
            sx={{
              display: sortMethod(1) ? "none" : "flex",
              fontSize: "1.25rem",
            }}
          />
          <RadioButtonCheckedIcon
            sx={{
              display: sortMethod(1) ? "flex" : "none",
              color: "#05a155",
              fontSize: "1.25rem",
            }}
          />
          <div style={{ color: sortMethod(1) ? "#05a155" : "#333333" }}>
            {"Recent First"}
          </div>
        </ListItem>
        <ListItem onClick={() => sortByMethod("createdAt", "asc")}>
          <RadioButtonUncheckedIcon
            sx={{
              display: sortMethod(2) ? "none" : "flex",
              fontSize: "1.25rem",
            }}
          />
          <RadioButtonCheckedIcon
            sx={{
              display: sortMethod(2) ? "flex" : "none",
              color: "#05a155",
              fontSize: "1.25rem",
            }}
          />
          <div style={{ color: sortMethod(2) ? "#05a155" : "#333333" }}>
            {"Oldest First"}
          </div>
        </ListItem>
        <Divider variant="middle" className={styles.divider} component="li" />
        <ListItem onClick={() => sortByMethod("title", "asc")}>
          <RadioButtonUncheckedIcon
            sx={{
              display: sortMethod(3) ? "none" : "flex",
              fontSize: "1.25rem",
            }}
          />
          <RadioButtonCheckedIcon
            sx={{
              display: sortMethod(3) ? "flex" : "none",
              color: "#05a155",
              fontSize: "1.25rem",
            }}
          />
          <div style={{ color: sortMethod(3) ? "#05a155" : "#333333" }}>
            {"Title (A-Z)"}
          </div>
        </ListItem>
        <ListItem onClick={() => sortByMethod("title", "desc")}>
          <RadioButtonUncheckedIcon
            sx={{
              display: sortMethod(4) ? "none" : "flex",
              fontSize: "1.25rem",
            }}
          />
          <RadioButtonCheckedIcon
            sx={{
              display: sortMethod(4) ? "flex" : "none",
              color: "#05a155",
              fontSize: "1.25rem",
            }}
          />
          <div style={{ color: sortMethod(4) ? "#05a155" : "#333333" }}>
            {"Title (Z-A)"}
          </div>
        </ListItem>
        <Divider variant="middle" className={styles.divider} component="li" />
        <ListItem onClick={() => sortByMethod("area", "desc")}>
          <RadioButtonUncheckedIcon
            sx={{
              display: sortMethod(5) ? "none" : "flex",
              fontSize: "1.25rem",
            }}
          />
          <RadioButtonCheckedIcon
            sx={{
              display: sortMethod(5) ? "flex" : "none",
              color: "#05a155",
              fontSize: "1.25rem",
            }}
          />
          <div style={{ color: sortMethod(5) ? "#05a155" : "#333333" }}>
            {"Area Highest first"}
          </div>
        </ListItem>
        <ListItem onClick={() => sortByMethod("area", "asc")}>
          <RadioButtonUncheckedIcon
            sx={{
              display: sortMethod(6) ? "none" : "flex",
              fontSize: "1.25rem",
            }}
          />
          <RadioButtonCheckedIcon
            sx={{
              display: sortMethod(6) ? "flex" : "none",
              color: "#05a155",
              fontSize: "1.25rem",
            }}
          />
          <div style={{ color: sortMethod(6) ? "#05a155" : "#333333" }}>
            {"Area Lowest first"}
          </div>
        </ListItem>
      </div>
    );
  };

  let colorsArray = [
    "#C71585",
    "#7B68EE",
    "#FF8C00",
    " #008080",
    "#2E8B57",
    "#4682B4",
    "#000080",
    "#3D3D5B",
    " #CC0044",
    "#BA55D3",
    "#663399",
    "#8B0000",
    "#FF4500",
    "#DA0E0E",
    "#00CED1",
    "#4169E1",
    " #A52A2A",
    "#2D1E2F",
    "#714E47",
    "#C65B7C",
    "#A04662",
    "#FE654F",
    " #5F6A89",
    "#067BBD",
  ];

  return (
    <div>
      <div className={styles.pageHeader}>
        <div className={styles.header} id="header">
          <img
            className={styles.iconsiconArrowLeft}
            alt=""
            src="/iconsiconarrowleft.svg"
            onClick={() => router.push("/farms")}
          />
          <Typography className={styles.viewFarm}>My Crops</Typography>
          <div className={styles.headericon} id="header-icon"></div>
        </div>
        <div className={styles.searchBlock}>
          <FormControl
            variant="outlined"
            className={styles.filterBox}
            sx={{
              " .MuiAutocomplete-root": {
                borderRadius: "30px",
              },
              "& .MuiInputBase-root": {
                background: "#fff",
                color: "#000",
                borderRadius: "24px",
                paddingBlock: "12px !important",
              },
              "& .MuiOutlinedInput-notchedOutline ": {
                border: "0",
                color: "#fff",
              },
            }}
          >
            <InputLabel color="primary" />
            <SelectAutoCompleteForFarmsCropPage
              setOptionsLoading={setOptionsLoading}
              optionsLoading={optionsLoading}
              options={formOptions}
              label={"title"}
              onSelectValueFromDropDown={captureFarmName}
              placeholder={"Select Farm"}
              defaultValue={defaultValue}
              searchString={searchString}
              setSearchString={setSearchString}
            />
            <FormHelperText />
          </FormControl>
          <div
            style={{
              width: "13%",
            }}
          >
            <IconButton
              className={styles.sortIconBtn}
              onClick={() => toggleDrawer(true)}
            >
              <img
                src="/mobileIcons/crops/SortIcon.svg"
                alt=""
                width={"24px"}
              />
            </IconButton>
            <React.Fragment>
              <Drawer
                onClose={() => toggleDrawer(false)}
                anchor={"bottom"}
                open={state["bottom"]}
              >
                <Box>
                  <SortMenu />
                </Box>
              </Drawer>
            </React.Fragment>
          </div>
        </div>
      </div>
      <div className={styles.myCropsPage}>
        <div className={styles.allCrops}>
          {cropOptions?.length ? (
            <div id={styles.allCropCardBlock}>
              {cropOptions?.map((item: any, index: any) => {
                const colorIndex = index % colorsArray.length;

                return (
                  <CropCard
                    itemDetails={item}
                    form_Id={formId}
                    key={index}
                    getCropsDetails={getCropsDetails}
                    colorIndex={colorIndex}
                  />
                );
              })}
            </div>
          ) : !loading ? (

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", height: "calc(100vh - 222px)" }}>
              <NoDataMobileComponent noData={!Boolean(cropOptions?.length)} noDataImg={"/NoDataImages/No_Crops.svg"} />
              <p className="noSummaryText">No Crops</p>
            </div>
          ) : (
            ""
          )}
        </div>

        {!loading ? (
          <div className="addFormPositionIcon">
            <IconButton
              size="large"
              className={styles.AddScoutingbtn}
              aria-label="add to shopping cart"
              onClick={() =>
                router.push({
                  pathname: `/farms/${router.query.farm_id}/crops/add-crop`,
                })
              }
            >
              <img
                src="/mobileIcons/crops/Add-crop.svg"
                alt=""
                width={"25px"}
              />
              <span>Add Crop</span>
            </IconButton>
          </div>
        ) : (
          ""
        )}

        {dilogOpen ? (
          <NewFolderDiloag
            open={dilogOpen}
            captureResponseDilog={captureResponseDilog}
            loading={loadingForAdd}
            errorMessages={errorMessages}
          />
        ) : (
          ""
        )}
        <AlertComponent
          alertMessage={alertMessage}
          alertType={alertType}
          setAlertMessage={setAlertMessage}
          mobile={true}
        />
        <LoadingComponent loading={loading} />
      </div>
    </div>
  );
};
export default AllCropsComponent;