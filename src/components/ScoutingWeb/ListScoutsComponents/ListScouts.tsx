import LoadingComponent from "@/components/Core/LoadingComponent";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { prepareURLEncodedParams } from "../../../../lib/requestUtils/urlEncoder";
import ListAllCropsForDropDownServices from "../../../../lib/services/CropServices/ListAllCropsForDropDownServices";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsServiceMobile";
import getAllUsersService from "../../../../lib/services/Users/getAllUsersService";
import ScoutingCardWeb from "../Scouting/ScoutingCard";
import styles from "../farms/FarmsNavBar.module.css";
import CropAutoCompleteFoScouts from "./CropAutoCompleteFoScouts";
import DateRangePickerForAllScouts from "./DateRangePickerForAllScouts";
import FarmAutoCompleteInAllScouting from "./FarmAutoCompleteInAllScouting";
import UserDropDownForScouts from "./UserDropDownForScouts";
import ListAllFarmForDropDownService from "../../../../lib/services/FarmsService/ListAllFarmForDropDownService";
import getAllExistedScoutsService from "../../../../lib/services/ScoutServices/AllScoutsServices/getAllExistedScoutsService";

interface ApiMethodProps {
  page: string | number;
  farmId: string;
  userId: string;
  fromDate: string;
  toDate: string;
  cropId: string;
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
  const [cropOptions, setCropOptions] = useState([]);
  const [crop, setCrop] = useState<any>();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const onChangeUser = async (e: any, value: any) => {
    if (value) {
      setUser(value);
      setFarm(null);
      setCrop(null);
      await getAllScoutsList({
        page: page,
        farmId: router.query.farm_id as string,
        userId: value?._id,
        fromDate: router.query.from_date as string,
        toDate: router.query.to_date as string,
        cropId: router.query.crop_id as string,
      });
      await getAllFarms(value?._id);
      await getAllCrops("", "", value?._id);
    } else {
      setUser(null);
      await getAllFarms();
      await getAllScoutsList({
        page: page,
        farmId: "",
        userId: "",
        fromDate: router.query.from_date as string,
        toDate: router.query.to_date as string,
        cropId: router.query.crop_id as string,
      });
      await getAllCrops("", router.query.farm_id as string, "");
    }
  };

  const onSelectFarmFromDropDown = async (value: any, reason: string) => {
    if (value) {
      setFarm(value);
      setCrop(null);
      getAllScoutsList({
        page: page,
        userId: router.query.created_by as string,
        farmId: value._id,
        cropId: "",
        fromDate: router.query.from_date as string,
        toDate: router.query.to_date as string,
      });
      await getAllCrops("", value?._id, router.query.created_by as string);
    } else {
      setFarm(null);
      getAllScoutsList({
        page: page,
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
      getAllScoutsList({
        page: page,
        farmId: router.query.farm_id as string,
        userId: router.query.created_by as string,
        fromDate: router.query.from_date as string,
        toDate: router.query.to_date as string,
        cropId: value?._id,
      });
    } else {
      setCrop(null);
      getAllScoutsList({
        page: page,
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
      getAllScoutsList({
        page: page,
        farmId: router.query.farm_id as string,
        userId: router.query.created_by as string,
        fromDate: date1,
        toDate: date2,
        cropId: router.query.crop_id as string,
      });
    } else {
      setFromDate("");
      setToDate("");
      getAllScoutsList({
        page: page,
        farmId: router.query.farm_id as string,
        userId: router.query.created_by as string,
        cropId: router.query.crop_id as string,
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
    cropId,
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
    if (cropId) {
      queryParams["crop_id"] = cropId;
    }

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

        setUser(obj);
      }
    }
  };

  const getAllFarms = async (userId = "", farmId = "") => {
    let queryParams: any = {
      order_by: "title",
      order_type: "asc",
    };
    if (userId) {
      queryParams["user_id"] = userId;
    }
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
    await getAllScoutsList({});
  };

  useEffect(() => {
    if (router.isReady && accessToken) {
      getAllUsers(router.query.created_by as string);
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
        page: 1,
        farmId: router.query?.farm_id as string,
        userId: router.query?.created_by as string,
        fromDate: router.query?.from_date as string,
        toDate: router.query?.to_date as string,
        cropId: router.query?.crop_id as string,
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
        <CropAutoCompleteFoScouts
          options={cropOptions}
          onSelectFarmFromDropDown={onSelectCropFromDropDown}
          label={"title"}
          placeholder={"Select Crop here"}
          defaultValue={crop}
        />
        <DateRangePickerForAllScouts onDateFilterChange={onDateFilterChange} />
        <Button
          onClick={clearAllFilterAndGetData}
          disabled={Object.keys(router.query)?.length <= 1}
        >
          Clear Filters
        </Button>
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
