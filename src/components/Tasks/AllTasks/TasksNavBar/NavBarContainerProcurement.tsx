import { FarmInTaskType, userTaskType } from "@/types/tasksTypes";
import {
  Autocomplete,
  Button,
  Icon,
  InputAdornment,
  TextField,
  Typography,
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
  onPriorityChange: any
  getProcruments: any
}

const ProcurementNavBarContainer: React.FC<PropTypes> = ({
  onChangeSearch,
  searchString,
  onSelectValueFromDropDown,
  selectedFarm,
  onStatusChange,
  onUserChange,
  onPriorityChange,
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
  const userDetails = useSelector(
    (state: any) => state.auth.userDetails?.user_details
  );


  const [search, setSearch] = useState("");
  const [farmOptions, setFarmOptions] = useState<Array<FarmInTaskType>>();
  const [users, setUsers] = useState<Array<userTaskType>>([]);
  const [user, setUser] = useState<userTaskType[] | null>([]);
  const [selectedFarmOption, setSelectedFarmOption] = useState<
    FarmInTaskType | null | undefined
  >();
  const [selectedUsers, setSelectedUsers] = useState<
    { name: string; _id: string }[] | null
  >();
  const [priority, setPriority] = useState("")
  const [status, setStatus] = useState("");
  const [statusOptions] = useState<Array<{ value: string; title: string }>>([
    { value: "PENDING", title: "Pending" },
    { value: "APPROVED", title: "Approved" },
    { value: "PURCHASED", title: "Purchased" },
    { value: "SHIPPED", title: "Shipped" },
    { value: "DELIVERED", title: "Delivered" },
    { value: "COMPLETED", title: "Completed" },

  ]);

  const [priorityOptions] = useState<Array<{ value: string; title: string }>>([
    { value: "None", title: "None" },
    { value: "Low", title: "Low" },
    { value: "Medium", title: "Medium" },
    { value: "High", title: "High" },
  ]);

  //select the status 
  const setStatusValue = (e: any) => {
    onStatusChange(e.target.value);
    setStatus(e.target.value);
  };

  //select the priority
  const onchnagePriorityValue = (e: any) => {
    onPriorityChange(e.target.value);
    setPriority(e.target.value);
  };

  useEffect(() => {
    setSearch(searchString);
    setSelectedFarmOption(selectedFarm);
    setStatus(router.query.status as string);
    setPriority(router.query.priority as string)
  }, [searchString, selectedFarm, router.query.status]);

  const onButtonAddTaskClick = useCallback(() => {
    if (titleName == "Procurement") {
      router.push("/procurements/add");
    } else {
      router.push("/tasks/add");
    }
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
      router.query.requested_by?.includes(item?._id)
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
        <div className={styles.pagetitle}>
          <img className={styles.note1Icon} alt="" src="/support-icon-procurement.svg" />
          <h1 className={styles.taskManagement}>{titleName}</h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 150px 150px", gridColumnGap: "1rem", width: "70%", alignItems: "flex-end" }}>
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
                isOptionEqualToValue={(option: any, value: any) =>
                  option.name === value.name
                }
                getOptionLabel={(option: any) => {
                  return option.name;
                }}
                options={users}
                onChange={(e, value: userTaskType[] | []) => {
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
                    placeholder="Search by Requested User"
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
          <div >
            <TextField
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                onChangeSearch(e.target.value);
              }}
              className={styles.searchbar}
              color="primary"
              size="small"
              placeholder="Search By Operation Title"
              sx={{
                width: "100%",
                "& .MuiInputBase-root": {
                  fontSize: "clamp(.875rem, 0.833vw, 1.125rem)",
                  backgroundColor: "#fff",
                  border: "none",
                  borderRadius: "4px !important",

                  fontFamily: "'Inter', sans-serif ",
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderRadius: "4px !important"
                }
              }}
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
          <div >
            <Typography>Status</Typography>
            <SelectComponent
              options={statusOptions}
              size="small"
              onChange={setStatusValue}
              value={status ? status : ""}
            />
          </div>
          <div >
            <Typography>Priority</Typography>
            <SelectComponent
              options={priorityOptions}
              size="small"
              onChange={onchnagePriorityValue}
              value={priority ? priority : ""}
            />
          </div>
        </div>
      </div>

      <div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
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
                setSelectedUsers(null)
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
                  page: 1,
                  limit: router.query.limit as string,
                  search_string: searchString,
                  sortBy: router.query.order_by as string,
                  sortType: router.query.order_type as string,
                  selectedFarmId: router.query.farm_id as string,
                  status: router.query.status as string,
                  priority: router.query.priority as string,
                  userId: router.query.requested_by
                    ? Array.isArray(router.query.requested_by)
                      ? (router.query.requested_by as string[])
                      : ([router.query.requested_by] as string[])
                    : [],
                  isMyTasks: false,


                });
              }}

            >
              All Procurements
            </Button>


          </div>
          {userDetails?.user_type == "central_team" ? "" :
            <div className={styles.headeractions}>

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

            </div>}

        </div>
      </div>
    </>
  );
};

export default ProcurementNavBarContainer;

