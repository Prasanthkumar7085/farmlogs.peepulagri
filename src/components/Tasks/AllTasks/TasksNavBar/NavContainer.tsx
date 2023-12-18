import { FarmInTaskType, userTaskType } from "@/types/tasksTypes";
import {
  Autocomplete,
  Button,
  Icon,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getAllFarmsService from "../../../../../lib/services/FarmsService/getAllFarmsService";
import FarmAutoCompleteInAddTask from "../../AddTask/FarmAutoCompleteInTasks";
import styles from "./NavBarContainer.module.css";
import SelectComponent from "@/components/Core/SelectComponent";
import AddIcon from "@mui/icons-material/Add";
import getAllUsersService from "../../../../../lib/services/Users/getAllUsersService";
import { Search } from "@mui/icons-material";
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
  getAllTasksTab
}) => {
  const router = useRouter();

  const userType = useSelector(
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

  return (
    <>
      <div className={styles.navbarcontainer}>
        <div>
          <div className={styles.pagetitle}>
            <img className={styles.note1Icon} alt="" src="/note-11.svg" />
            <h1 className={styles.taskManagement}>{`Task Management`}</h1>
          </div>

          <Button
            sx={{
              color: router.query.is_my_task == "true" ? "green" : "red",
              textDecoration:
                router.query.is_my_task == "true" ? "underline" : "none",
            }}
            onClick={() => {
              if (router.query.is_my_task == "true") {
                return;
              }
              setUser([]);
              onUserChange([userId], true);
            }}
          >
            My Tasks
          </Button>
          <Button
            sx={{
              color: router.query.is_my_task == "true" ? "red" : "green",
              textDecoration:
                router.query.is_my_task == "true" ? "none" : "underline",
            }}
            onClick={() => {
              if (!(router.query.is_my_task == "true")) {
                return;
              }
              setUser([]);
              getAllTasksTab({
                page: router.query.page as string,
                limit: router.query.limit as string,
                search_string: searchString,
                sortBy: router.query.order_by as string,
                sortType: router.query.order_type as string,
                selectedFarmId: router.query.farm_id as string,
                status: router.query.status as string,
                userId: [],
              });
            }}
          >
            All Tasks
          </Button>
        </div>
        <div className={styles.headeractions}>
          {!(router.query.is_my_task == "true") ? (
            <div>
              <Autocomplete
                multiple
                sx={{
                  width: "250px",
                  maxWidth: "250px",
                  borderRadius: "4px",
                }}
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
                        fontSize: "clamp(.875rem, 1vw, 1.125rem)",
                        backgroundColor: "#fff",
                        border: "none",
                      },
                    }}
                  />
                )}
              />
            </div>
          ) : (
            ""
          )}

          <div style={{ width: "12%" }}>
            <SelectComponent
              options={statusOptions}
              size="small"
              onChange={setStatusValue}
              value={status ? status : ""}
            />
          </div>
          <div style={{ width: "25%" }}>
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
              sx={{ width: "100%", background: "#fff !important" }}
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
          </div>
          {userType !== "USER" ? (
            <Button
              className={styles.filter}
              color="primary"
              size="small"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onButtonAddTaskClick}
            >
              Add
            </Button>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default NavContainer;