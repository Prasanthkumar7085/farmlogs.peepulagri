import SelectComponent from "@/components/Core/SelectComponent";
import { FarmInTaskType, userTaskType } from "@/types/tasksTypes";
import { Search } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import {
  Autocomplete,
  Button,
  InputAdornment,
  Menu,
  TextField
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getAllUsersService from "../../../../../lib/services/Users/getAllUsersService";
import styles from "./NavBarContainer.module.css";
import { changeTaskFilterUserOpen } from "@/Redux/Modules/Farms";
import { prepareURLEncodedParamsWithArray } from "../../../../../lib/requestUtils/urlEncoderWithArray";
interface PropTypes {
  onChangeSearch: (search: string) => void;
  searchString: string;
  onSelectValueFromDropDown: (value: FarmInTaskType, reason: string) => void;
  selectedFarm: FarmInTaskType | null | undefined;
  onStatusChange: (value: string) => void;
  onUserChange: (value: string[] | [], isMyTasks: boolean) => void;
  getAllTasksTab: any;
}

const NavContainer: React.FC<PropTypes> = ({
  onChangeSearch,
  searchString,
  onSelectValueFromDropDown,
  selectedFarm,
  onStatusChange,
  onUserChange,
  getAllTasksTab,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<any>(null);
  const [counts, setCounts] = useState<any>({});

  const open = Boolean(anchorEl);
  const handleClick = (event: any | null, filterOrNot = false) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const router = useRouter();
  const dispatch = useDispatch();

  const filterOpenOrNot = useSelector(
    (state: any) => state?.farms?.taskFilterOpen
  );

  const userType_v2 = useSelector(
    (state: any) => state.auth.userDetails?.user_details?.user_type
  );
  const userId = useSelector(
    (state: any) => state.auth.userDetails?.user_details?._id
  );

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<Array<userTaskType>>([]);
  const [user, setUser] = useState<userTaskType[] | null>([]);

  const [selectedFarmOption, setSelectedFarmOption] = useState<
    FarmInTaskType | null | undefined
  >();
  const [status, setStatus] = useState("");

  const [selectedUsers, setSelectedUsers] = useState<
    { name: string; _id: string }[] | null
  >();
  const [filtersLength, setFiltersLength] = useState(0);

  useEffect(() => {
    let { page, limit, search_string, is_my_task, ...rest } = router.query;

    setFiltersLength(Object.keys(rest)?.length);
  }, [router.query]);

  const setStatusValue = (e: any) => {
    onStatusChange(e.target.value);
    setStatus(e.target.value);
  };

  useEffect(() => {
    setSearch(searchString);
    setSelectedFarmOption(selectedFarm);
    setStatus(router.query.overdue ? "OVER-DUE" : router.query.status as string,);
  }, [searchString, selectedFarm, router.query.status]);

  const onButtonAddTaskClick = useCallback(() => {
    router.push("/tasks/add");
  }, []);

  const getAllUsers = async () => {
    const response = await getAllUsersService({ token: accessToken });
    if (response?.success) {
      setUsers(response?.data);
      setSelectedValue(response?.data);
    }
  };

  //get all the stats count
  const getAllStatsCount = async () => {
    try {
      let urls = [
        "/tasks/status/count/stats?",
        "/tasks/status/count/stats?status=TO-START",
        "/tasks/status/count/stats?status=INPROGRESS",
        "/tasks/status/count/stats?status=DONE",
        "/tasks/status/count/stats?overdue=true",
      ];

      let queryParams: any = {};

      if (router.query.page) {
        queryParams["page"] = router.query.page;
      }
      if (router.query.limit) {
        queryParams["limit"] = router.query.limit;
      }
      if (router.query.search_string) {
        queryParams["search_string"] = router.query.search_string;
      }

      if (router.query.order_by) {
        queryParams["sort_by"] = router.query.order_by;
      }
      if (router.query.order_type) {
        queryParams["sort_type"] = router.query.order_type;
      }
      if (router.query.farm_id) {
        queryParams["farm_id"] = router.query.farm_id;
      }
      // if (router.query.status) {
      //   if (router.query.status !== "ALL") {
      //     queryParams["status"] = router.query.status;
      //   }
      // }

      if (router.query.assign_to) {
        queryParams["assign_to"] = router.query.assign_to
          ? Array.isArray(router.query.assign_to)
            ? (router.query.assign_to as string[])
            : ([router.query.assign_to] as string[])
          : [];
        // queryParams["created_by"] = userId;
      }

      const paramString = prepareURLEncodedParamsWithArray("", queryParams);
      let responses = await Promise.allSettled(
        urls.map(async (url) => {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}${url}${paramString.replace(
              "?",
              "&"
            )}`,
            {
              method: "GET",
              headers: new Headers({
                authorization: accessToken,
              }),
            }
          );
          return response.json();
        })
      );

      const statusTitles = [
        "all",
        "to_start",
        "inprogress",
        "done",
        "overdue",
      ];

      let data: any = {};
      responses?.map((item: any, index: number) => {
        if (item.status == "fulfilled") {
          data = { ...data, [statusTitles[index]]: item?.value?.data };
        } else {
          return 0;
        }
      });
      setCounts(data);
      setStatusOptions([{ value: "TO-START", title: `To-Start (${getModifiedCount(data["to_start"])})` },
      { value: "INPROGRESS", title: `In-Progress (${getModifiedCount(data["inprogress"])})` },
      { value: "DONE", title: `Done (${getModifiedCount(data["done"])})` },
      { value: "OVER-DUE", title: `Over-due (${getModifiedCount(data["overdue"])})` },])
    } catch (err) {
      console.error();
    }
  };

  const getModifiedCount = (count: number) => {
    if (+count >= 100000) {
      let remainder = +count % 100000;
      if (remainder) {
        remainder = Number(String(remainder).slice(0, 2));
        return `${Math.floor(count / 100000)}.${remainder}k`;
      }
      return `${Math.floor(count / 100000)}k`;
    }

    if (+count >= 1000) {
      let remainder = +count % 1000;
      if (remainder) {
        remainder = Number(String(remainder).slice(0, 2));
        return `${Math.floor(count / 1000)}.${remainder}k`;
      }
      return `${Math.floor(count / 1000)}k`;
    }
    return count;

  };

  const [statusOptions, setStatusOptions] = useState<Array<{ value: string; title: string }>>([
    { value: "TO-START", title: `To-Start` },
    { value: "INPROGRESS", title: `In-Progress` },
    { value: "DONE", title: `Done` },
    { value: "OVER-DUE", title: `Over-due` },
  ]);
  useEffect(() => {
    if (router.isReady && accessToken) {
      getAllStatsCount();
    }
  }, [router.isReady, accessToken, router.query]);


  useEffect(() => {
    if (router.isReady && accessToken) {
      getAllUsers();
    }
  }, [router.isReady, accessToken]);

  const setSelectedValue = (usersData: { name: string; _id: string }[]) => {
    let usersObj = usersData.filter((item: any) =>
      router.query.assign_to?.includes(item?._id)
    );
    if (router.query.is_my_task) {
      setSelectedUsers(null);
      return;
    }
    setSelectedUsers(usersObj);
  };

  const clearFiltersDisabledOrNot = () => {
    let { page, limit, ...rest } = router.query;
    return !Object.keys(rest)?.length;
  };

  const targetDivRef = useRef(null);

  return (
    <>
      <div className={styles.navbarcontainer}>
        <div className={styles.pagetitle}>
          <img
            className={styles.note1Icon}
            alt=""
            src="/viewTaskIcons/task-symbol-icon.svg"
          />
          <h1 className={styles.taskManagement}>{`Task Management`}</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {!(router.query.is_my_task == "true") ? (
            <Button
              ref={targetDivRef}
              id="demo-positioned-button"
              aria-controls={
                filterOpenOrNot ? "demo-positioned-menu" : undefined
              }
              aria-haspopup="true"
              aria-expanded={filterOpenOrNot ? "true" : undefined}
              onClick={(e) => {
                handleClick(e, true);
              }}
              variant="contained"
              className={
                router.query.assign_to ? styles.activeFilterBtn : styles.filterBtn
              }
            >
              <img
                src={
                  router.query.assign_to
                    ? "/viewTaskIcons/filter-sybol-icon-active.svg"
                    : "/viewTaskIcons/filter-sybol-icon.svg"
                }
                alt=""
                width={"14px"}
              />
              <span>Filter</span>
            </Button>
          ) : (
            ""
          )}
          <TextField
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onChangeSearch(e.target.value);
            }}
            className={styles.searchbar}
            color="primary"
            size="small"
            placeholder="Search By Title"
            sx={{
              width: "100%",
              background: "#fff !important",
              minWidth: "250px",
              maxWidth: "300px",
            }}
            variant="outlined"
            type="search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button
            className={styles.filterAddBtn}
            color="primary"
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onButtonAddTaskClick}
          >
            Add
          </Button>
        </div>
      </div>

      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: "1rem",
          }}
        >
          <div className={styles.TabButtonGrp}>
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

                getAllTasksTab({
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
          </div>

          <div
            className={styles.headeractions}
            style={{
              width: "35%",
              display: "grid",
              gridTemplateColumns: "200px 200px",
            }}
          >
            {/* <div>
              {!(router.query.is_my_task == "true") ? (
                <Autocomplete
                  limitTags={1}
                  multiple
                  id="size-small-outlined-multi"
                  size="small"
                  fullWidth
                  noOptionsText={"No such User"}
                  value={selectedUsers?.length ? selectedUsers : []}
                  isOptionEqualToValue={(option: any, value: any) =>
                    option.name === value.name
                  }
                  getOptionLabel={(option: any) => {
                    return option.name;
                  }}
                  options={users}
                  onChange={(e: any, value: userTaskType[] | []) => {
                    setSelectedUsers(value);
                    setUser(value);
                    let data: string[] = value?.length
                      ? value?.map(
                        (item: { _id: string; name: string }) => item._id
                      )
                      : [];
                    onUserChange(data, false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search by User"
                      variant="outlined"
                      size="small"
                      sx={{
                        "& .MuiInputBase-root": {
                          fontSize: "clamp(.875rem, 0.833vw, 1.125rem)",
                          backgroundColor: "#fff",
                          border: "none",
                          fontFamily: "'Inter', sans-serif ",
                        },
                      }}
                    />
                  )}
                />
              ) : (
                ""
              )}
            </div> */}
            {selectedUsers?.length ? (
              <div
                className={styles.selectedUsersCount}
                onClick={(e) => handleClick(e)}
              >
                {" "}
                <span style={{ fontWeight: "500" }}>User :</span>{" "}
                <span>{selectedUsers[0]?.name}</span>{" "}
                {selectedUsers?.length > 1 ? (
                  <span className={styles.count}>
                    + {selectedUsers?.length - 1}
                  </span>
                ) : (
                  ""
                )}{" "}
              </div>
            ) : (
              <div></div>
            )}

            <SelectComponent
              options={statusOptions}
              size="small"
              onChange={setStatusValue}
              value={status ? status : ""}
              countsValues={counts}
            />
            {/* <Button
              onClick={() => {
                setUser(null);
                setSelectedUsers(null);
                getAllTasksTab({
                  page: 1,
                  limit: 15,
                  search_string: "",
                  sortBy: "",
                  sortType: "",
                  selectedFarmId: "",
                  status: "",
                  userId: [],
                  isMyTasks: false,
                });
              }}
              disabled={clearFiltersDisabledOrNot()}
            >
              <FilterAltOffIcon />
            </Button> */}
          </div>
        </div>
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        PaperProps={{
          style: {
            width: "28ch",
            padding: "1rem",
          },
        }}
      >
        <div>
          {!(router.query.is_my_task == "true") ? (
            <Autocomplete
              sx={{
                "& .MuiChip-root": {
                  background: "#f0fff0",
                  border: "1px solid #05a155",
                  borderRadius: "5px",
                },
              }}
              multiple
              id="size-small-outlined-multi"
              size="small"
              fullWidth
              noOptionsText={"No such User"}
              value={selectedUsers?.length ? selectedUsers : []}
              getOptionDisabled={(option) => {
                let firstOption = selectedUsers?.length
                  ? selectedUsers?.some(
                    (item) =>
                      item?._id === option?._id && item?.name === option?.name
                  )
                  : false;

                return firstOption
              }}
              isOptionEqualToValue={(option: any, value: any) =>
                option.name === value.name
              }
              getOptionLabel={(option: any) => {
                return option.name;
              }}
              options={users}
              onChange={(e, value: userTaskType[] | []) => {
                if (!value?.length) {
                  setAnchorEl(null);
                }

                setSelectedUsers(value);
                setUser(value);
                let data: string[] = value?.length
                  ? value?.map(
                    (item: { _id: string; name: string }) => item._id
                  )
                  : [];
                onUserChange(data, false);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search by User"
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiInputBase-root": {
                      fontSize: "clamp(.875rem, 0.833vw, 1.125rem)",
                      backgroundColor: "#fff",
                      border: "none",
                      fontFamily: "'Inter', sans-serif ",
                    },
                  }}
                />
              )}
            />
          ) : (
            ""
          )}
        </div>
      </Menu>
    </>
  );
};

export default NavContainer;
