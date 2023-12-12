import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import { setAllFarms } from "@/Redux/Modules/Farms";
import LoadingComponent from "@/components/Core/LoadingComponent";
import TablePaginationForFarms from "@/components/Core/TablePaginationForFarms";
import { FarmDataType } from "@/types/farmCardTypes";
import SortIcon from "@mui/icons-material/Sort";
import { List, ListItem, Menu, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { prepareURLEncodedParams } from "../../../../lib/requestUtils/urlEncoder";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsServiceMobile";
import ScoutingFarmDetailsCard from "./FarmDetailsCard";
import FarmsNavBarWeb from "./FarmsNavBar";
import styles from "./FarmsNavBar.module.css";

interface callFarmsProps {
  search_string: string;
  location: any;
  userId: string;
  page: number | string;
  limit: number | string;
  sortBy: string;
  sortType: string;
}
const AllFarmsPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [, , removeCookie] = useCookies(["userType"]);
  const [, , loggedIn] = useCookies(["loggedIn"]);

  const [data, setData] = useState<Array<FarmDataType>>([]);
  const [paginationDetails, setPaginationDetails] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<any>();

  useEffect(() => {
    if (router.isReady && accessToken) {
      getFarmsData({
        search_string: router.query.search_string as string,
        location: router.query.location as string,
        userId: router.query.user_id as string,
        page: router.query.page as string,
        limit: router.query.limit as string,
        sortBy: router.query.order_by as string,
        sortType: router.query.sort_type as string,
      });
    }
  }, [router.isReady, accessToken]);

  const onViewClick = useCallback((farmId: string) => {
    router.push(`/farm/${farmId}`);
  }, []);

  const capturePageNum = (value: string | number) => {
    getFarmsData({
      search_string: router.query.search_string as string,
      location: router.query.location as string,
      userId: router.query.user_id as string,
      page: value,
      limit: router.query.limit as string,
      sortBy: router.query.order_by as string,
      sortType: router.query.sort_type as string,
    });
  };

  const captureRowPerItems = (value: string | number) => {
    getFarmsData({
      search_string: router.query.search_string as string,
      location: router.query.location as string,
      userId: router.query.user_id as string,
      page: 1,
      limit: value,
      sortBy: router.query.order_by as string,
      sortType: router.query.sort_type as string,
    });
  };
  const getFarmsData = async ({
    search_string = "",
    location,
    userId,
    page = 1,
    limit = 20,
    sortBy,
    sortType,
  }: callFarmsProps) => {
    setLoading(true);
    try {
      let url = `farms/${page}/${limit}`;
      let queryParam: any = {
        sort_by: "createdAt",
        sort_type: "desc",
      };
      if (page) {
        queryParam["page"] = page;
      }
      if (limit) {
        queryParam["limit"] = limit;
      }
      if (sortBy) {
        queryParam["sort_by"] = sortBy;
      }
      if (sortType) {
        queryParam["sort_type"] = sortType;
      }
      if (search_string) {
        queryParam["search_string"] = search_string;
        delete queryParam["sort_by"];
        delete queryParam["sort_type"];
      }

      if (location != 1 && location) {
        queryParam["location_id"] = location;
        delete queryParam["order_by"];
        delete queryParam["order_type"];
      }



      if (userId) {
        queryParam["user_id"] = userId;
      }
      router.push({ pathname: "/farm", query: queryParam });
      url = prepareURLEncodedParams(url, queryParam);

      const response = await getAllFarmsService(url, accessToken);

      if (response?.success) {
        const { data, ...rest } = response;
        setData(data);
        setPaginationDetails(rest);
      } else if (response?.statusCode == 403) {
        await logout();
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  const getColor = (orderBy: string, orderType: string) => {
    if (
      orderBy == router.query.order_by &&
      orderType == router.query.order_type
    ) {
      return "#dedede";
    }
    return "#ffffff";
  };

  const sortByMethod = (sortBy: string, sortType: string) => {
    setAnchorEl(null);
    // getCropsByFarmId(router.query.farm_id as string, sortBy, sortType);
    getFarmsData({
      search_string: router.query.search_string as string,
      location: router.query.location as string,
      userId: router.query.user_id as string,
      page: 1,
      limit: router.query.limit as string,
      sortBy: sortBy,
      sortType: sortType,
    });
  };

  const MenuOptions = () => {
    return (
      <List>
        <ListItem
          sx={{ cursor: "pointer", background: getColor("createdAt", "desc") }}
          onClick={() => sortByMethod("createdAt", "desc")}
        >
          {"Recent First"}
        </ListItem>
        <ListItem
          sx={{
            cursor: "pointer",
            background: getColor("createdAt", "asc"),
            borderBottom: "1px solid #B4C1D6",
          }}
          onClick={() => sortByMethod("createdAt", "asc")}
        >
          {"Oldest First"}
        </ListItem>
        <ListItem
          sx={{ cursor: "pointer", background: getColor("title", "asc") }}
          onClick={() => sortByMethod("title", "asc")}
        >
          {"Title (A-Z)"}
        </ListItem>
        <ListItem
          sx={{
            cursor: "pointer",
            background: getColor("title", "desc"),
            borderBottom: "1px solid #B4C1D6",
          }}
          onClick={() => sortByMethod("title", "desc")}
        >
          {"Title (Z-A)"}
        </ListItem>
        <ListItem
          sx={{ cursor: "pointer", background: getColor("area", "desc") }}
          onClick={() => sortByMethod("area", "desc")}
        >
          {"Area Highest first"}
        </ListItem>
        <ListItem
          sx={{ cursor: "pointer", background: getColor("area", "asc") }}
          onClick={() => sortByMethod("area", "asc")}
        >
          {"Area Lowest first"}
        </ListItem>
      </List>
    );
  };

  return (
    <div className={styles.AllFarmsPageWeb}>
      <FarmsNavBarWeb getFarmsData={getFarmsData} />
      <div className={styles.filterBlock}>
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={(event: any) => setAnchorEl(event.currentTarget)}
        >
          <SortIcon />
          <Typography>Sort By</Typography>
        </div>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          sx={{
            "& .MuiMenuItem-root": {
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              minHeight: "inherit",
            },
          }}
        >
          <MenuOptions />
        </Menu>
      </div>
      {data.length ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", overflowX: "hidden" }}>

          <div className={styles.allFarms}>
            <ScoutingFarmDetailsCard
              getFarmsData={getFarmsData}
              data={data}
              onViewClick={onViewClick}
            />
          </div>
          <TablePaginationForFarms
            paginationDetails={paginationDetails}
            capturePageNum={capturePageNum}
            captureRowPerItems={captureRowPerItems}
            values="Farms"
          />
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
          <img
            src="/no-farms-image.svg"
            alt="noFarms"
            width={450}
            height={350}
          />
          <p style={{ margin: "0" }}>No farms</p>
        </div>
      ) : (
        ""
      )}

      <LoadingComponent loading={loading} />
    </div>
  );
};

export default AllFarmsPage;
