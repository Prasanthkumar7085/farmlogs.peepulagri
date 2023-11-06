import LoadingComponent from "@/components/Core/LoadingComponent";
import { FarmInTaskType, userTaskType } from "@/types/tasksTypes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { prepareURLEncodedParams } from "../../../../lib/requestUtils/urlEncoder";
import getAllTasksService from "../../../../lib/services/TasksService/getAllTasksService";
import NavBarContainer from "./TasksNavBar/NavBarContainer";
import TasksTableComponent from "./TasksTable/TasksTableComponent";
import ImageComponent from "@/components/Core/ImageComponent";

export interface ApiCallProps {
  page: string | number;
  limit: string | number;
  search_string: string;
  sortBy: string;
  sortType: string;
  selectedFarmId: string;
  status: string;
  userId: string;
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
    limit = 15,
    search_string = "",
    sortBy = "",
    sortType = "",
    selectedFarmId = "",
    status = "ALL",
    userId = "",
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
    if (userId) {
      queryParams["assigned_to"] = userId;
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
          page: 1,
          limit: router.query.limit as string,
          search_string: searchString,
          sortBy: router.query.order_by as string,
          sortType: router.query.order_type as string,
          selectedFarmId: router.query.farm_id as string,
          status: router.query.status as string,
          userId: router.query.assigned_to as string,
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
        page: 1,
        limit: router.query.limit as string,
        search_string: searchString,
        sortBy: router.query.order_by as string,
        sortType: router.query.order_type as string,
        selectedFarmId: value?._id,
        status: router.query.status as string,
        userId: router.query.assigned_to as string,
      });
    } else {
      setSelectedFarm(null);
      getAllTasks({
        page: 1,
        limit: router.query.limit as string,
        search_string: searchString,
        sortBy: router.query.order_by as string,
        sortType: router.query.order_type as string,
        selectedFarmId: "",
        status: router.query.status as string,
        userId: router.query.assigned_to as string,
      });
    }
  };

  const onStatusChange = async (value: any) => {
    getAllTasks({
      page: 1,
      limit: router.query.limit as string,
      search_string: searchString,
      sortBy: router.query.order_by as string,
      sortType: router.query.order_type as string,
      selectedFarmId: router.query.farm_id as string,
      status: value,
      userId: router.query.assigned_to as string,
    });
  };

  const onUserChange = async (e: any, value: userTaskType) => {
    getAllTasks({
      page: 1,
      limit: router.query.limit as string,
      search_string: searchString,
      sortBy: router.query.order_by as string,
      sortType: router.query.order_type as string,
      selectedFarmId: router.query.farm_id as string,
      status: router.query.status as string,
      userId: value?._id as string,
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
        onUserChange={onUserChange}
      />
      {data.length ? (
        <TasksTableComponent
          data={data}
          getData={getAllTasks}
          paginationDetails={paginationDetails}
        />
      ) : !loading ? (
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ImageComponent
            src="/no-tasks-data.svg"
            height={500}
            width={500}
            alt="no-tasks"
          />
          <div
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#a05148",
            }}
          >
            No Tasks
          </div>
        </div>
      ) : (
        ""
      )}

      <LoadingComponent loading={loading} />
    </div>
  );
};

export default TasksPageComponent;
