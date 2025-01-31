import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import LoadingComponent from "@/components/Core/LoadingComponent";
import NoFarmDataComponent from "@/components/Core/NoFarmDataComponent";
import { FarmDataType } from "@/types/farmCardTypes";
import { IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { prepareURLEncodedParams } from "../../../../lib/requestUtils/urlEncoder";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsServiceMobile";
import getAllLocationsService from "../../../../lib/services/Locations/getAllLocationsService";
import styles from "./DashboardPage.module.css";
import DashBoardHeader from "./dash-board-header";
import FarmCard from "./farm-card";
import NoDataMobileComponent from "@/components/Core/NoDataMobileComponent";

const DashboardPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const [, , removeCookie] = useCookies(["userType_v2"]);
  const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);

  const [farmsData, setFarmsData] = useState<Array<FarmDataType>>([]);
  const [loading, setLoading] = useState(true);
  const [searchString, setSearchString] = useState("");
  const [locations, setLocations] = useState<
    Array<{ title: string; _id: string }>
  >([]);
  const [location, setLocation] = useState("1");
  const [routerLocation, setRouterLocation] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const getAllFarms = async ({
    page = 1,
    limit = 20,
    search_string = "",
    location,
    addData,
  }: Partial<{
    page: number;
    limit: number;
    search_string: string;
    location: any;
    addData: boolean;
  }>) => {
    setLoading(true);
    try {
      let url = `farms/${page}/${limit}`;
      let queryParam: any = {
        sort_by: "createdAt",
        sort_type: "desc",
      };

      if (search_string) {
        queryParam["search_string"] = search_string;
        delete queryParam["sort_by"];
        delete queryParam["sort_type"];
      }

      if (location != 1 && location) {
        queryParam["location_id"] = location;
        delete queryParam["sort_by"];
        delete queryParam["sort_type"];
      }

      router.replace({ pathname: "/farms", query: queryParam });
      url = prepareURLEncodedParams(url, queryParam);

      const response = await getAllFarmsService(url, accessToken);

      if (response?.success) {
        if (addData) {
          if (location || search_string) {
            setFarmsData([...farmsData, ...response.data]);
            setHasMore(response?.has_more);
          } else {
            setFarmsData([...farmsData, ...response.data]);
            setHasMore(response?.has_more);
          }
        } else {
          setFarmsData([...response.data]);
          setHasMore(response?.has_more);
        }
      } else if (response?.statusCode == 403) {
        await logout();
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const captureSearchString = (search: string) => {
    setSearchString(search);
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
  const getAllLocations = async () => {
    const response = await getAllLocationsService(accessToken);
    if (response?.statusCode == 403) {
      await logout();
      return;
    }
    if (response?.data?.length) {
      setLocations([{ title: "All", _id: "1" }, ...response?.data]);
    } else {
      setLocations([{ title: "All", _id: "1" }]);
    }

    let searchFromRouter = router.query?.search_string;
    let locationFromRouter = router.query?.location_id;
    await getAllFarms({
      page: 1,
      limit: 20,
      search_string: searchFromRouter as string,
      location: locationFromRouter as string,
    });
    if (searchFromRouter) {
      setSearchString(searchFromRouter as string);
    }
    if (locationFromRouter) {
      setLocation(locationFromRouter as string);
    } else {
      setLocation("");
    }
  };

  const getData = async () => {
    if (router.isReady && accessToken) {
      await getAllLocations();
    } else {
      setLoading(false);
    }
  };

  const getDataOnLocationChange = async (location: string) => {
    await getAllFarms({
      page: 1,
      limit: 20,
      search_string: searchString as string,
      location: location,
    });
  };

  useEffect(() => {
    if (router.isReady && accessToken) {
      getData();
    }
  }, [router.isReady, accessToken]);

  useEffect(() => {
    setRouterLocation(
      router?.query.location ? (router?.query.location as string) : ""
    );
  }, [router?.query.location]);

  useEffect(() => {
    if (router.isReady && accessToken) {
      const delay = 500;
      const debounce = setTimeout(() => {
        getAllFarms({
          page: 1,
          limit: 20,
          search_string: searchString,
          location: router?.query.location,
        });
      }, delay);
      return () => clearTimeout(debounce);
    }
  }, [searchString]);

  return (
    <div id={styles.dashboardPage}>
      <DashBoardHeader
        captureSearchString={captureSearchString}
        searchString={searchString}
        locations={locations}
        location={location}
        setLocation={setLocation}
        getDataOnLocationChange={getDataOnLocationChange}
      />

      {farmsData.length ? (
        <FarmCard
          farmsData={farmsData}
          setPage={setPage}
          page={page}
          loading={loading}
          getAllFarms={getAllFarms}
          hasMore={hasMore}
        />
      ) : !loading ? (

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", height: "calc(100vh - 180px)" }}>
          <NoDataMobileComponent noData={!Boolean(farmsData.length)} noDataImg={"/NoDataImages/No_Farms.svg"} />
          <p className="noSummaryText">No Farms</p>
        </div>
      ) : (
        <div style={{ minHeight: "75vh" }}></div>
      )}
      <div className="addFormPositionIcon" style={{ gap: "1.5rem" }}>

        <IconButton
          size="large"
          className={styles.AddFarmBtn}
          aria-label="add to shopping cart"
          onClick={() => {
            if (routerLocation) {
              router.push(`/farms/add?location=${routerLocation}`);
            } else {
              router.push("/farms/add");
            }
          }}
        >
          <img src="/mobileIcons/farms/AddFarmicon.svg" alt="" width={"25px"} />
          <span>Add Farm</span>
        </IconButton>
      </div>
      <LoadingComponent loading={loading} />
    </div>
  );
};

export default DashboardPage;
