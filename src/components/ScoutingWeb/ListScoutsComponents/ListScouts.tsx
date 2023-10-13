import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingComponent from "@/components/Core/LoadingComponent";
import ScoutingCardWeb from "../Scouting/ScoutingCard";
import styles from "../farms/FarmsNavBar.module.css";
import UserDropDownForScouts from "./UserDropDownForScouts";
import getAllUsersService from "../../../../lib/services/Users/getAllUsersService";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsServiceMobile";
import FarmAutoCompleteInAllScouting from "./FarmAutoCompleteInAllScouting";
import DateRangePickerForAllScouts from "./DateRangePickerForAllScouts";
import { prepareURLEncodedParams } from "../../../../lib/requestUtils/urlEncoder";
import getAllExistedScoutsService from "../../../../lib/services/ScoutServices/AllScoutsServices/getAllExistedScoutsService";
import { Button } from "@mui/material";

interface ApiMethodProps {
  page: string | number;
  farmId: string;
  userId: string;
  fromDate: string;
  toDate: string;
}
const ListScouts: FunctionComponent = () => {
  const router = useRouter();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [usersOptions, setUserOptions] = useState();
  const [user, setUser] = useState<any>();
  const [farmOptions, setFarmOptions] = useState([]);
  const [farm, setFarm] = useState<any>();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const onChangeUser = async (e: any, value: any) => {
    if (value) {
      setUser(value);
      await getAllScoutsList({
        page: page,
        farmId: router.query.farm_id as string,
        userId: value?._id,
        fromDate: router.query.from_date as string,
        toDate: router.query.to_date as string,
      });
      await getAllFarms(value?._id);
    } else {
      setUser(null);
      setFarm(null);
      await getAllFarms();
      await getAllScoutsList({
        page: page,
        farmId: "",
        userId: "",
        fromDate: router.query.from_date as string,
        toDate: router.query.to_date as string,
      });
    }
  };

  const onSelectFarmFromDropDown = (value: any, reason: string) => {
    if (value) {
      setFarm(value);
      getAllScoutsList({
        page: page,
        farmId: value._id,
        userId: router.query.created_by as string,
        fromDate: router.query.from_date as string,
        toDate: router.query.to_date as string,
      });
    } else {
      setFarm(null);
      getAllScoutsList({
        page: page,
        farmId: "",
        userId: router.query.created_by as string,
        fromDate: router.query.from_date as string,
        toDate: router.query.to_date as string,
      });
    }
  };

  const onDateFilterChange = (date1: string, date2: string) => {
    if (date1 && date2) {
      setFromDate(date1);
      setToDate(date2);
      getAllScoutsList({
        page: page,
        farmId: router.query.farm_id as string,
        userId: router.query.created_by as string,
        fromDate: date1,
        toDate: date2,
      });
    } else {
      setFromDate("");
      setToDate("");
      getAllScoutsList({
        page: page,
        farmId: router.query.farm_id as string,
        userId: router.query.created_by as string,
        fromDate: "",
        toDate: "",
      });
    }
  };

  const getAllScoutsList = async ({
    page,
    farmId,
    userId,
    fromDate,
    toDate,
  }: Partial<ApiMethodProps>) => {
    setLoading(true);
    let url = `/scouts/${page}/${limit}`;
    let queryParams: any = { page: 1 };
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
    console.log(queryParams, "testing");

    url = prepareURLEncodedParams(url, queryParams);
    router.push({ query: queryParams });
    const response = await getAllExistedScoutsService({
      url: url,
      token: accessToken,
    });

    if (response?.success) {
      setData(response?.data);
    }
    setLoading(false);
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
        console.log(obj, "testing");

        setUser(obj);
      }
    }
  };

  const getAllFarms = async (userId = "", farmId = "") => {
    let url = "farm/1/1000";
    if (userId) {
      url += `?created_by=${userId}`;
    }
    const response = await getAllFarmsService(url, accessToken);
    if (response?.success) {
      setFarmOptions(response?.data);
      if (farmId) {
        let obj =
          response?.data?.length &&
          response?.data?.find((item: any) => item._id == farmId);
        setFarm(obj);
      }
    }
  };

  const clearAllFilterAndGetData = async () => {
    setUser("");
    setFarm("");
    setFromDate("");
    setToDate("");
    await getAllScoutsList({});
  };

  useEffect(() => {
    if (router.isReady && accessToken) {
      getAllUsers(router.query.created_by as string);
      getAllFarms(
        router.query.created_by as string,
        router.query.farm_id as string
      );
      getAllScoutsList({
        page: 1,
        farmId: router.query?.farm_id as string,
        userId: router.query?.created_by as string,
        fromDate: router.query?.from_date as string,
        toDate: router.query?.to_date as string,
      });
    }
  }, [router.isReady, accessToken]);

  return (
    <div
      className={styles.AllFarmsPageWeb}
      style={{ paddingTop: "1rem !important" }}
    >
      <div>
        <UserDropDownForScouts
          user={user}
          onChangeUser={onChangeUser}
          usersOptions={usersOptions}
        />
        <FarmAutoCompleteInAllScouting
          options={farmOptions}
          onSelectFarmFromDropDown={onSelectFarmFromDropDown}
          label={"title"}
          placeholder={"Select Farm here"}
          defaultValue={farm}
        />
        <DateRangePickerForAllScouts onDateFilterChange={onDateFilterChange} />
        <Button onClick={clearAllFilterAndGetData}>Clear Filters</Button>
      </div>
      <div className={styles.allFarms}>
        <div className={styles.allScoutingCards}>
          {data?.length
            ? data.map((item, index: number) => {
                return <ScoutingCardWeb item={item} key={index} />;
              })
            : "No Scouts"}
          <LoadingComponent loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default ListScouts;
