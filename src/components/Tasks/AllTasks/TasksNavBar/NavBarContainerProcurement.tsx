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
  onUserChange: (value: string[] | [], isMyTasks: boolean) => void;
  titleName: any
  getProcruments: any
}

const ProcurementNavBarContainer: React.FC<PropTypes> = ({
  onChangeSearch,
  searchString,
  onSelectValueFromDropDown,
  selectedFarm,
  onStatusChange,
  onUserChange,
  titleName,
  getProcruments
}) => {
  const router = useRouter();

  const userType_v2 = useSelector(
    (state: any) => state.auth.userDetails?.user_details?.user_type
  );
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const userId = useSelector(
    (state: any) => state.auth.userDetails?.user_details?._id
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
    { value: "PENDING", title: "Pending" },
    { value: "APPROVED", title: "Approved" },
    { value: "PURCHASED", title: "Purchased" },
    { value: "SHIPPED", title: "Shipped" },
    { value: "DELIVERED", title: "Delivered" },
    { value: "COMPLETED", title: "Completed" },

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
    if (titleName == "Procurement Module") {
      router.push("/procurements/add");
    } else {
      router.push("/tasks/add");
    }
  }, []);

  return (
    <>
      <div className={styles.navbarcontainer}>
        <div className={styles.pagetitle}>
          <img className={styles.note1Icon} alt="" src="/support-icon-procurement.svg" />
          <h1 className={styles.taskManagement}>{titleName}</h1>
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
          <div style={{ width: "30%" }}>
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
          {userType_v2 !== "farmer" ? (
            <Button
              className={styles.addProcurementBtn}
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

                onUserChange([userId], true);
              }}
            >
              My Procurements
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

                getProcruments({
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
              All Procurements
            </Button>
          </div>


        </div>
      </div>
    </>
  );
};

export default ProcurementNavBarContainer;

