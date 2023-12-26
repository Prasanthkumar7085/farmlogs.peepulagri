import LoadingComponent from "@/components/Core/LoadingComponent";
import { FarmInTaskType, userTaskType } from "@/types/tasksTypes";
import { Button, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { prepareURLEncodedParamsWithArray } from "../../../../lib/requestUtils/urlEncoderWithArray";
import getAllTasksService from "../../../../lib/services/TasksService/getAllTasksService";
import styles from "./all-tasks.module.css";
import Tabs from "./tabs";
import TaskCard from "./task-card";
import TaskHeader from "./taskHeader";

export interface ApiCallProps {
  page: string | number;
  limit: string | number;
  search_string: string;
  sortBy: string;
  sortType: string;
  selectedFarmId: string;
  status: string;
  userId: string[];
  isMyTasks: boolean | string;
  createdAt: string;
}

const AllTasks = () => {
  const router = useRouter();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchString, setSearchString] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedFarm, setSelectedFarm] = useState<FarmInTaskType | null>();
  const userId = useSelector(
    (state: any) => state.auth.userDetails?.user_details?._id
  );
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

  const getAllTasks = async ({
    page = 1,
    limit = 15,
    search_string = "",
    sortBy = "",
    sortType = "",
    selectedFarmId = "",
    createdAt = "",
    status = "ALL",
    userId = [],
    isMyTasks = "",
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
    if (createdAt) {
      queryParams["createdAt"] = createdAt;
    }
    if (sortBy) {
      queryParams["sort_by"] = sortBy;
    }
    if (sortType) {
      queryParams["sort_type"] = sortType;
    }
    if (selectedFarmId) {
      queryParams["farm_id"] = selectedFarmId;
    }
    if (status) {
      if (status !== "ALL") {
        queryParams["status"] = status;
      }
    }

    if (userId?.length) {
      queryParams["assign_to"] = userId;
      // queryParams["created_by"] = userId;
    }
    if (Boolean(isMyTasks)) {
      queryParams["is_my_task"] = true;
    }

    const {
      page: pageCount,
      limit: limitCount,
      is_my_task,
      ...queryParamsUpdated
    } = queryParams;

    router.push({ query: queryParams });
    const paramString = prepareURLEncodedParamsWithArray(
      "",
      queryParamsUpdated
    );

    const response = await getAllTasksService({
      page: page,
      limit: limit,
      paramString: paramString,
      accessToken,
    });

    if (response?.success) {
      if (page !== 1) {
        setHasMore(response?.has_more);
        setData([...data, ...response.data]);
      } else {
        setHasMore(response?.has_more);
        setData(response.data);
      }
    } else {
      setHasMore(false);
      setData(response.data);
    }
    if (response.status == 401) {
      logout();
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
          createdAt: dateFilter,
          sortBy: router.query.order_by as string,
          sortType: router.query.order_type as string,
          selectedFarmId: router.query.farm_id as string,
          status: router.query.status as string,
          userId: router.query.assign_to
            ? Array.isArray(router.query.assign_to)
              ? (router.query.assign_to as string[])
              : ([router.query.assign_to] as string[])
            : [],
          isMyTasks: router.query.is_my_task as string,
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

  // useEffect(() => {
  //   setDateFilter(router.query.createdAt as string);
  // }, [router.query.createdAt]);

  const onSelectValueFromDropDown = async (value: FarmInTaskType) => {
    if (value) {
      setSelectedFarm(value);

      getAllTasks({
        page: 1,
        limit: router.query.limit as string,
        search_string: searchString,
        createdAt: dateFilter,
        sortBy: router.query.order_by as string,
        sortType: router.query.order_type as string,
        selectedFarmId: value?._id,
        status: router.query.status as string,
        userId: router.query.assign_to
          ? Array.isArray(router.query.assign_to)
            ? (router.query.assign_to as string[])
            : ([router.query.assign_to] as string[])
          : [],
        isMyTasks: router.query?.is_my_task as string,
      });
    } else {
      setSelectedFarm(null);
      getAllTasks({
        page: 1,
        limit: router.query.limit as string,
        search_string: searchString,
        createdAt: dateFilter,
        sortBy: router.query.order_by as string,
        sortType: router.query.order_type as string,
        selectedFarmId: "",
        status: router.query.status as string,
        userId: router.query.assign_to
          ? Array.isArray(router.query.assign_to)
            ? (router.query.assign_to as string[])
            : ([router.query.assign_to] as string[])
          : [],
        isMyTasks: router.query?.is_my_task as string,
      });
    }
  };

  const onStatusChange = async (value: any) => {
    getAllTasks({
      page: 1,
      limit: router.query.limit as string,
      search_string: searchString,
      createdAt: dateFilter,
      sortBy: router.query.order_by as string,
      sortType: router.query.order_type as string,
      selectedFarmId: router.query.farm_id as string,
      status: value,
      userId: router.query.assign_to
        ? Array.isArray(router.query.assign_to)
          ? (router.query.assign_to as string[])
          : ([router.query.assign_to] as string[])
        : [],
      isMyTasks: router.query?.is_my_task as string,
    });
  };

  const onUserChange = async (value: string[] | [], isMyTasks = false) => {
    getAllTasks({
      page: 1,
      limit: router.query.limit as string,
      search_string: searchString,
      createdAt: dateFilter,
      sortBy: router.query.order_by as string,
      sortType: router.query.order_type as string,
      selectedFarmId: router.query.farm_id as string,
      status: router.query.status as string,
      userId: value,
      isMyTasks: isMyTasks,
    });
  };

  const lastItemRef = useRef<HTMLDivElement>(null);
  const scrollToLastItem = () => {
    if (lastItemRef.current) {
      lastItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };

  const observer: any = useRef();

  const lastBookElementRef = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && data.length > 0) {
          setPage((prevPageNumber) => prevPageNumber + 1);
          getAllTasks({
            page: page + 1,
            limit: router.query.limit as string,
            search_string: searchString,
            createdAt: dateFilter,
            sortBy: router.query.order_by as string,
            sortType: router.query.order_type as string,
            selectedFarmId: router.query.farm_id as string,
            status: router.query.status as string,
            userId: router.query.assign_to
              ? Array.isArray(router.query.assign_to)
                ? (router.query.assign_to as string[])
                : ([router.query.assign_to] as string[])
              : [],
            isMyTasks: router.query.is_my_task as string,
          });
          scrollToLastItem(); // Restore scroll position after new data is loaded
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const [user, setUser] = useState<userTaskType[] | null>([]);
  const [selectedUsers, setSelectedUsers] = useState<
    { name: string; _id: string }[] | null
  >();

  return (
    <div>
      <TaskHeader
        onChangeSearch={onChangeSearch}
        searchString={searchString}
        onUserChange={onUserChange}
        getAllTasks={getAllTasks}
      />
      <div className={styles.allTasksPage}>
        <div className={styles.TabButtonGrp}>
          <Button
            className={
              router.query.is_my_task !== "true"
                ? styles.tabActiveButton
                : styles.tabButton
            }
            onClick={() => {
              if (!(router.query.is_my_task == "true")) {
                return;
              }
              setUser([]);
              setSelectedUsers([]);

              getAllTasks({
                page: router.query.page as string,
                limit: router.query.limit as string,
                search_string: searchString,
                sortBy: router.query.order_by as string,
                sortType: router.query.order_type as string,
                selectedFarmId: router.query.farm_id as string,
                status: router.query.status as string,
                userId: [],
                isMyTasks: false,
              });
            }}
          >
            All Tasks
          </Button>
          <Button
            className={
              router.query.is_my_task == "true"
                ? styles.tabActiveButton
                : styles.tabButton
            }
            onClick={() => {
              if (router.query.is_my_task == "true") {
                return;
              }
              setUser([]);
              setSelectedUsers([]);
              onUserChange([userId], true);
            }}
          >
            My Tasks
          </Button>

        </div>
        {/* <ListHeader onDateChange={onDateChange} /> */}
        <Tabs onStatusChange={onStatusChange} />

        <TaskCard
          data={data}
          lastBookElementRef={lastBookElementRef}
          hasMore={hasMore}
          lastItemRef={lastItemRef}
          loading={loading}
        />
      </div>
      <div className="addFormPositionIcon">
        <IconButton
          size="large"
          className={styles.AddTaskBtn}
          aria-label="add to shopping cart"
          onClick={() => {
            router.push("/users-tasks/add");
          }}
        >
          <img src="/mobileIcons/navTabs/Add Task.svg" alt="" width={"25px"} />
          <span>Add Task</span>
        </IconButton>
      </div>
      <LoadingComponent loading={loading} />
    </div>
  );
};
export default AllTasks;
