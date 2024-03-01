import { FarmInTaskType, userTaskType } from "@/types/tasksTypes";
import {
  Autocomplete,
  Button,
  Icon,
  IconButton,
  InputAdornment,
  Menu,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./NavBarContainer.module.css";
import SelectComponent from "@/components/Core/SelectComponent";
import AddIcon from "@mui/icons-material/Add";
import getAllUsersService from "../../../../../lib/services/Users/getAllUsersService";
import Image from "next/image";
import ClearIcon from '@mui/icons-material/Clear';

interface PropTypes {
  onChangeSearch: (search: string) => void;
  searchString: string;
  onSelectValueFromDropDown: (value: FarmInTaskType, reason: string) => void;
  selectedFarm: FarmInTaskType | null | undefined;
  onStatusChange: (value: string) => void;
  onUserChange: (value: string[] | [], isMyTasks: boolean) => void;
  titleName: any;
  onPriorityChange: any;
  getProcruments: any;
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
  getProcruments,
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
  const filterOpenOrNot = useSelector(
    (state: any) => state?.farms?.taskFilterOpen
  );

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [search, setSearch] = useState("");
  const [farmOptions, setFarmOptions] = useState<Array<FarmInTaskType>>();
  const [users, setUsers] = useState<Array<userTaskType>>([]);
  const [user, setUser] = useState<userTaskType[] | null>([]);
  const [selectedFarmOption, setSelectedFarmOption] = useState<
    FarmInTaskType | null | undefined
  >();

  const open = Boolean(anchorEl);
  const handleClick = (event: any | null, filterOrNot = false) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const targetDivRef = useRef(null);

  const [selectedUsers, setSelectedUsers] = useState<any>();
  const [priority, setPriority] = useState("");
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
    setPriority(router.query.priority as string);
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
          <Image
            className={styles.note1Icon}
            alt=""
            src="/procurement-side-menu-icon-main.svg"
            width={35}
            height={35}
          />
          <h1 className={styles.taskManagement}>{titleName}</h1>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr 150px 150px",
            gridColumnGap: "1rem",
            width: "60%",
            alignItems: "flex-end",
          }}
        >
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
                router.query.requested_by && router.query.is_my_task
                  ? styles.activeFilterBtn
                  : styles.filterBtn
              }
            >
              <Image
                src={
                  router.query.requested_by && router.query.is_my_task
                    ? "/viewTaskIcons/filter-sybol-icon-active.svg"
                    : "/viewTaskIcons/filter-sybol-icon.svg"
                }
                alt=""
                width={14}
                height={14}
              />
              <span>Requested by Filter</span>
              <span>
                {" "}
                {selectedUsers?.length ? (
                  <span className={styles.count}>
                    + {selectedUsers?.length}
                  </span>
                ) : (
                  ""
                )}
              </span>
            </Button>
          ) : (
            ""
          )}
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
                width: "34ch",
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
                        (item: any) =>
                          item?._id === option?._id &&
                          item?.name === option?.name
                      )
                      : false;

                    return firstOption;
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
          <div>
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
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "4px !important",
                },
              }}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>search_sharp</Icon>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="start">
                    {searchString ?
                      <IconButton onClick={() => {
                        setSearch("");
                        onChangeSearch("");
                      }}>
                        <ClearIcon />
                      </IconButton> : ""}
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div>
            <Typography>Status</Typography>
            <SelectComponent
              options={statusOptions}
              size="small"
              onChange={setStatusValue}
              value={status ? status : ""}
            />
          </div>
          <div>
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
          {userDetails?.user_type == "central_team" ? "" :
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
                  setSelectedUsers(null);
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
                    userId: [],
                    isMyTasks: false,
                  });
                }}
              >
                All Procurements
              </Button>
            </div>}
          {userDetails?.user_type == "central_team" ? (
            ""
          ) : (
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
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProcurementNavBarContainer;

