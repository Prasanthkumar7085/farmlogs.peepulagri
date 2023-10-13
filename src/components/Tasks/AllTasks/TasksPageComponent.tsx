import LoadingComponent from "@/components/Core/LoadingComponent";
import { FarmInTaskType } from "@/types/tasksTypes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { prepareURLEncodedParams } from "../../../../lib/requestUtils/urlEncoder";
import getAllTasksService from "../../../../lib/services/TasksService/getAllTasksService";
import NavBarContainer from "./TasksNavBar/NavBarContainer";
import TasksTableComponent from "./TasksTable/TasksTableComponent";

export interface ApiCallProps {
  page: string | number;
  limit: string | number;
  search_string: string;
  sortBy: string;
  sortType: string;
  selectedFarmId: string;
  status: string;
}
const TasksPageComponent = () => {
  const router = useRouter();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [data, setData] = useState([]);
  const [paginationDetails, setPaginationDetails] = useState();
  const [loading, setLoading] = useState(true);
  const [searchString, setSearchString] = useState("");
  const [selectedFarm, setSelectedFarm] = useState<FarmInTaskType | null>();

  const getAllTasks = async ({
    page = 1,
    limit = 10,
    search_string = "",
    sortBy = "",
    sortType = "",
    selectedFarmId = "",
    status = "ALL",
  }: Partial<ApiCallProps>) => {
    setLoading(true);
    let queryParams: any = {};
    if (page) {
      queryParams["page"] = page;
    }
    if (limit) {
      queryParams["limit"] = limit;
    }
    if (search_string) {
      queryParams["search_string"] = search_string;
    }
    if (sortBy) {
      queryParams["order_by"] = sortBy;
    }
    if (sortType) {
      queryParams["order_type"] = sortType;
    }
    if (selectedFarmId) {
      queryParams["farm_id"] = selectedFarmId;
    }
    if (status) {
      if (status !== "ALL") {
        queryParams["status"] = status;
      }
    }

    const {
      page: pageCount,
      limit: limitCount,
      ...queryParamsUpdated
    } = queryParams;

    router.push({ query: queryParams });
    const paramString = prepareURLEncodedParams("", queryParamsUpdated);

    const response = await getAllTasksService({
      page: page,
      limit: limit,
      paramString: paramString,
      accessToken,
    });
    if (response?.success) {
      const { data, ...rest } = response;
      setData(data);
      setPaginationDetails(rest);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (router.isReady && accessToken) {
      let delay = 500;
      let debounce = setTimeout(() => {
        getAllTasks({
          page: router.query.page as string,
          limit: router.query.limit as string,
          search_string: searchString,
          sortBy: router.query.order_by as string,
          sortType: router.query.order_type as string,
          selectedFarmId: router.query.farm_id as string,
          status: router.query.status as string,
        });
      }, delay);
      return () => clearTimeout(debounce);
    }
  }, [searchString, router.isReady, accessToken]);

  useEffect(() => {
    setSearchString(router.query.search_string as string);
  }, [router.query.search_string]);

  const onChangeSearch = (search: string) => {
    setSearchString(search);
  };
  const onSelectValueFromDropDown = async (value: FarmInTaskType) => {
    if (value) {
      setSelectedFarm(value);

      getAllTasks({
        page: router.query.page as string,
        limit: router.query.limit as string,
        search_string: searchString,
        sortBy: router.query.order_by as string,
        sortType: router.query.order_type as string,
        selectedFarmId: value?._id,
        status: router.query.status as string,
      });
    } else {
      setSelectedFarm(null);
      getAllTasks({
        page: router.query.page as string,
        limit: router.query.limit as string,
        search_string: searchString,
        sortBy: router.query.order_by as string,
        sortType: router.query.order_type as string,
        selectedFarmId: "",
        status: router.query.status as string,
      });
    }
  };

  const onStatusChange = async (value: any) => {
    getAllTasks({
      page: router.query.page as string,
      limit: router.query.limit as string,
      search_string: searchString,
      sortBy: router.query.order_by as string,
      sortType: router.query.order_type as string,
      selectedFarmId: router.query.farm_id as string,
      status: value,
    });
  };

  return (
    <div style={{ padding: "1rem 2rem" }}>
      <NavBarContainer
        onChangeSearch={onChangeSearch}
        searchString={searchString}
        onSelectValueFromDropDown={onSelectValueFromDropDown}
        selectedFarm={selectedFarm}
        onStatusChange={onStatusChange}
      />
      {data.length ? (
        <TasksTableComponent
          data={data}
          getData={getAllTasks}
          paginationDetails={paginationDetails}
        />
      ) : !loading ? (
        "No Data"
      ) : (
        ""
      )}

      <LoadingComponent loading={loading} />
    </div>
  );
};

export default TasksPageComponent;
