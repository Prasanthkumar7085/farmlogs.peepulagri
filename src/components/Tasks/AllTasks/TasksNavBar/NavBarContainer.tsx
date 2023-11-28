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
import ListAllFarmForDropDownService from "../../../../../lib/services/FarmsService/ListAllFarmForDropDownService";
import getAllUsersService from "../../../../../lib/services/Users/getAllUsersService";
interface PropTypes {
  onChangeSearch: (search: string) => void;
  searchString: string;
  onSelectValueFromDropDown: (value: FarmInTaskType, reason: string) => void;
  selectedFarm: FarmInTaskType | null | undefined;
  onStatusChange: (value: string) => void;
  onUserChange: (e: any, value: userTaskType) => void;
}

const NavBarContainer: React.FC<PropTypes> = ({
  onChangeSearch,
  searchString,
  onSelectValueFromDropDown,
  selectedFarm,
  onStatusChange,
  onUserChange,
}) => {
  const router = useRouter();

  const userType = useSelector(
    (state: any) => state.auth.userDetails?.user_details?.user_type
  );
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [search, setSearch] = useState("");
  const [farmOptions, setFarmOptions] = useState<Array<FarmInTaskType>>();
  const [users, setUsers] = useState<Array<userTaskType>>([]);
  const [user, setUser] = useState<userTaskType | null>();
  const [selectedFarmOption, setSelectedFarmOption] = useState<
    FarmInTaskType | null | undefined
  >();
  const [status, setStatus] = useState("");
  const [statusOptions] = useState<Array<{ value: string; title: string }>>([
    { value: "TO-START", title: "To Start" },
    { value: "INPROGRESS", title: "In Progress" },
    { value: "DONE", title: "Done" },
    { value: "PENDING", title: "Pending" },
    { value: "OVER-DUE", title: "Over-due" },
  ]);

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

  const getAllFarms = async () => {
    const response = await ListAllFarmForDropDownService("", accessToken);
    if (response?.success) {
      setFarmOptions(response?.data);
      if (router.query.farm_id) {
        let obj = response?.data?.find(
          (item: FarmInTaskType) => item?._id == router.query?.farm_id
        );
        setSelectedFarmOption(obj);
      }
    }
  };
  const getAllUsers = async () => {
    const response = await getAllUsersService({ token: accessToken });
    if (response?.success) {
      setUsers(response?.data);
    }
  };

  // useEffect(() => {
  //   if (router.isReady && accessToken) {
  //     getAllFarms();
  //     getAllUsers();
  //   }
  // }, [router.isReady, accessToken]);

  return (
    <>
      <div className={styles.navbarcontainer}>
        <div className={styles.pagetitle}>
          <img className={styles.note1Icon} alt="" src="/note-11.svg" />
          <h1 className={styles.taskManagement}>{`Task Management`}</h1>
        </div>
        <div className={styles.headeractions}>
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
                    <Icon>search_sharp</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          {userType !== "farmer" ? (
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

export default NavBarContainer;
