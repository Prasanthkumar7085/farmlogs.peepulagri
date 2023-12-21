import { changeTaskFilterOpen } from "@/Redux/Modules/Farms";
import SelectComponent from "@/components/Core/SelectComponent";
import { FarmInTaskType, userTaskType } from "@/types/tasksTypes";
import { Search } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import {
  Autocomplete,
  Button,
  Collapse,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getAllUsersService from "../../../../../lib/services/Users/getAllUsersService";
import styles from "./NavBarContainer.module.css";
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
  const [statusOptions] = useState<Array<{ value: string; title: string }>>([
    { value: "TO-START", title: "To-Start" },
    { value: "INPROGRESS", title: "In-Progress" },
    { value: "DONE", title: "Done" },
    { value: "PENDING", title: "Pending" },
    { value: "OVER-DUE", title: "Over-due" },
  ]);
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
    setStatus(router.query.status as string);
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

  return (
    <>
      <div className={styles.navbarcontainer}>
        <div className={styles.pagetitle}>
          <img className={styles.note1Icon} alt="" src="/viewTaskIcons/task-symbol-icon.svg" />
          <h1 className={styles.taskManagement}>{`Task Management`}</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Button
            id="demo-positioned-button"
            aria-controls={filterOpenOrNot ? "demo-positioned-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={filterOpenOrNot ? "true" : undefined}
            onClick={(e) => {
              dispatch(changeTaskFilterOpen());
            }}
            variant="contained"
            className={
              filtersLength ? styles.activeFilterBtn : styles.filterBtn
            }
          >
            <img
              src={
                filtersLength
                  ? "/viewTaskIcons/filter-sybol-icon-active.svg"
                  : "/viewTaskIcons/filter-sybol-icon.svg"
              }
              alt=""
              width={"14px"}
            />
            <span style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              Filter{" "}
              <span className={styles.FilterCount}>
                {" "}
                {filtersLength ? filtersLength : ""}
              </span>
            </span>
          </Button>
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
              gridTemplateColumns: "2fr 1fr .5fr",
            }}
          >
            <div>
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
            </div>

            <SelectComponent
              options={statusOptions}
              size="small"
              onChange={setStatusValue}
              value={status ? status : ""}
            />
            <Button
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
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavContainer;
