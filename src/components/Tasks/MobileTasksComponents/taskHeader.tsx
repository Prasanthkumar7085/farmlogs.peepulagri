import { userTaskType } from "@/types/tasksTypes";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  Badge,
  Box,
  Button,
  Chip,
  ClickAwayListener,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getAllUsersService from "../../../../lib/services/Users/getAllUsersService";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import SortIcon from "@mui/icons-material/Sort";

import styles from "./taskHeader.module.css";

const TaskHeader = ({
  onChangeSearch,
  searchString,
  onUserChange,
  getAllTasks,
}: any) => {
  const router = useRouter();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const userId = useSelector(
    (state: any) => state.auth.userDetails?.user_details?._id
  );
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<Array<userTaskType>>([]);
  const [usersDrawerOpen, setUsersDrawerOpen] = useState<any>(false);
  const [isSearchOpenOrNot, setIsSearchOpenOrNot] = useState(false);

  const [textFieldAutoFocus, setTextFieldAutoFocus] = useState(false);
  const [usersArray, setUsersArray] = useState<userTaskType[]>([]);
  const [renderField, setRenderField] = useState(true);

  const [state, setState] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortType, setSortType] = useState("desc");
  const [dateFilter, setDateFilter] = useState("");

  const getAllUsers = async () => {
    const response = await getAllUsersService({ token: accessToken });
    if (response?.success) {
      setUsers(response?.data);
      setSelectedValue(response?.data);
    }
  };
  const setSelectedValue = (usersData: userTaskType[]) => {
    let usersObj = usersData.filter((item: any) =>
      router.query.assign_to?.includes(item?._id)
    );
    if (router.query.is_my_task) {
      return;
    }
    setUsersArray(usersObj);
  };

  const captureUser = (event: any, selectedObject: any) => {
    if (selectedObject) {
      setUsersArray([...usersArray, selectedObject]);
      setRenderField(false);
      setTimeout(() => {
        setRenderField(true);
      }, 0.1);

      onUserChange(
        [...usersArray, selectedObject].map((item: { _id: string }) => item._id)
      );
    }
  };
  const toggleDrawer = (open: boolean) => {
    setState(open);
  };
  const sortByMethod = (sortBy: string, sortType: string) => {
    toggleDrawer(false);

    getAllTasks({
      page: 1,
      limit: router.query.limit as string,
      search_string: searchString,
      createdAt: dateFilter,
      sortBy: sortBy,
      sortType: sortType,
      selectedFarmId: router.query.farm_id as string,
      status: router.query.status,
      userId: router.query.assign_to
        ? Array.isArray(router.query.assign_to)
          ? (router.query.assign_to as string[])
          : ([router.query.assign_to] as string[])
        : [],
      isMyTasks: router.query?.is_my_task as string,
    });
    setSortBy(sortBy);
    setSortType(sortType);
  };

  const sortMethod = (value: number) => {
    if (sortBy == "createdAt") {
      if (value == 1 && sortType == "desc") {
        return true;
      } else if (value == 2 && sortType == "asc") {
        return true;
      }
    } else if (sortBy == "title") {
      if (value == 3 && sortType == "asc") {
        return true;
      } else if (value == 4 && sortType == "desc") {
        return true;
      }
    } else if (sortBy == "area") {
      if (value == 5 && sortType == "desc") {
        return true;
      } else if (value == 6 && sortType == "asc") {
        return true;
      }
    }

    return false;
  };
  useEffect(() => {
    if (router.isReady && accessToken) {
      if (router.query.search_string) {
        setIsSearchOpenOrNot(true);
        setSearch(router.query.search_string as string);
      }
      getAllUsers();
    }
  }, [router.isReady, accessToken]);

  const SortMenu = () => {
    return (
      <div className={styles.sortOptions}>
        <ListItem className={styles.subTitle}>
          {" "}
          <SortIcon /> <span>Sort By</span>
        </ListItem>
        <ListItem onClick={() => sortByMethod("createdAt", "desc")}>
          <RadioButtonUncheckedIcon
            sx={{
              display: sortMethod(1) ? "none" : "flex",
              fontSize: "1.25rem",
            }}
          />
          <RadioButtonCheckedIcon
            sx={{
              display: sortMethod(1) ? "flex" : "none",
              color: "#05a155",
              fontSize: "1.25rem",
            }}
          />
          <div style={{ color: sortMethod(1) ? "#05a155" : "#333333" }}>
            {"Recent First"}
          </div>
        </ListItem>
        <ListItem onClick={() => sortByMethod("createdAt", "asc")}>
          <RadioButtonUncheckedIcon
            sx={{
              display: sortMethod(2) ? "none" : "flex",
              fontSize: "1.25rem",
            }}
          />
          <RadioButtonCheckedIcon
            sx={{
              display: sortMethod(2) ? "flex" : "none",
              color: "#05a155",
              fontSize: "1.25rem",
            }}
          />
          <div style={{ color: sortMethod(2) ? "#05a155" : "#333333" }}>
            {"Oldest First"}
          </div>
        </ListItem>
        <Divider variant="middle" className={styles.divider} />
        <ListItem onClick={() => sortByMethod("title", "asc")}>
          <RadioButtonUncheckedIcon
            sx={{
              display: sortMethod(3) ? "none" : "flex",
              fontSize: "1.25rem",
            }}
          />
          <RadioButtonCheckedIcon
            sx={{
              display: sortMethod(3) ? "flex" : "none",
              color: "#05a155",
              fontSize: "1.25rem",
            }}
          />
          <div style={{ color: sortMethod(3) ? "#05a155" : "#333333" }}>
            {"Title (A-Z)"}
          </div>
        </ListItem>
        <ListItem onClick={() => sortByMethod("title", "desc")}>
          <RadioButtonUncheckedIcon
            sx={{
              display: sortMethod(4) ? "none" : "flex",
              fontSize: "1.25rem",
            }}
          />
          <RadioButtonCheckedIcon
            sx={{
              display: sortMethod(4) ? "flex" : "none",
              color: "#05a155",
              fontSize: "1.25rem",
            }}
          />
          <div style={{ color: sortMethod(4) ? "#05a155" : "#333333" }}>
            {"Title (Z-A)"}
          </div>
        </ListItem>
        <Divider variant="middle" className={styles.divider} />
        <ListItem onClick={() => sortByMethod("deadline", "desc")}>
          <RadioButtonUncheckedIcon
            sx={{
              display: sortMethod(5) ? "none" : "flex",
              fontSize: "1.25rem",
            }}
          />
          <RadioButtonCheckedIcon
            sx={{
              display: sortMethod(5) ? "flex" : "none",
              color: "#05a155",
              fontSize: "1.25rem",
            }}
          />
          <div style={{ color: sortMethod(5) ? "#05a155" : "#333333" }}>
            {"Due Date (Recent first)"}
          </div>
        </ListItem>
        <ListItem onClick={() => sortByMethod("deadline", "asc")}>
          <RadioButtonUncheckedIcon
            sx={{
              display: sortMethod(6) ? "none" : "flex",
              fontSize: "1.25rem",
            }}
          />
          <RadioButtonCheckedIcon
            sx={{
              display: sortMethod(6) ? "flex" : "none",
              color: "#05a155",
              fontSize: "1.25rem",
            }}
          />
          <div style={{ color: sortMethod(6) ? "#05a155" : "#333333" }}>
            {"Due Date (Oldest first)"}
          </div>
        </ListItem>
      </div>
    );
  };

  return (
    <header className={styles.header}>
      <div className={styles.row}>
        {!isSearchOpenOrNot ? (
          <div className={styles.group}>
            <h1 className={styles.title}>Tasks</h1>
          </div>
        ) : (
          <ClickAwayListener onClickAway={() => setTextFieldAutoFocus(false)}>
            <TextField
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                onChangeSearch(e.target.value);
              }}
              color="primary"
              size="small"
              placeholder="Search By Title"
              sx={{
                width: "85%",
                borderRadius: "20px",
                background: "#fff !important",
                marginRight: !(router.query.is_my_task == "true")
                  ? "1rem"
                  : "0",
                "& .MuiInputBase-root": {
                  borderRadius: "20px !important",
                  height: "2.4rem",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "20px !important",
                  borderColor: "#fff !important",
                },
                "& .MuiInputBase-input": {
                  paddingBlock: "11px",
                },
              }}
              variant="outlined"
              // type="search"
              autoFocus={textFieldAutoFocus}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ArrowBackIcon
                      onClick={() => {
                        setTextFieldAutoFocus(false);
                        setIsSearchOpenOrNot((prev) => !prev);
                        if (search) {
                          setSearch("");
                          onChangeSearch("");
                        }
                      }}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="start">
                    {router.query.search_string ? (
                      <ClearIcon
                        onClick={() => {
                          setTextFieldAutoFocus(true);
                          setSearch("");
                          onChangeSearch("");
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </ClickAwayListener>
        )}
        <div className={styles.actions}>
          {!isSearchOpenOrNot ? (
            <div
              className={styles.search}
              onClick={() => {
                setIsSearchOpenOrNot((prev) => !prev);
                setTextFieldAutoFocus(true);
              }}
            >
              <img
                className={styles.magnifyingGlass1Icon}
                alt=""
                src="/magnifyingglass-1@2x.png"
              />
            </div>
          ) : (
            ""
          )}
          {!(router.query.is_my_task == "true") ? (
            <Badge
              badgeContent={
                router.query.assign_to
                  ? Array.isArray(router.query?.assign_to)
                    ? router.query.assign_to?.length
                    : 1
                  : null
              }
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  fontWeight: "600",
                  fontFamily: "'Inter', sans-serif",
                },
              }}
            >
              <div
                className={styles.filter}
                onClick={() => setUsersDrawerOpen(true)}
              >
                <img
                  className={styles.funnel1Icon}
                  alt=""
                  src="/funnel-1@2x.png"
                />
              </div>
            </Badge>
          ) : (
            ""
          )}
          <IconButton
            className={styles.sortIconBtn}
            onClick={() => toggleDrawer(true)}
          >
            <img src="/mobileIcons/crops/SortIcon.svg" alt="" width={"24px"} />
          </IconButton>
        </div>
      </div>
      {/* <div style={{ width: "80%" }}>
        {isSearchOpenOrNot ? (
          <TextField
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onChangeSearch(e.target.value);
            }}
            color="primary"
            size="small"
            placeholder="Search By Title"
            sx={{
              width: "100%",
              borderRadius: "20px",
              background: "#fff !important",
              "& .MuiInputBase-root": {
                borderRadius: "20px !important",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "20px !important",
                borderColor: "#fff !important",
              },
              "& .MuiInputBase-input": {
                paddingBlock: "11px",
              },
            }}
            variant="outlined"
            type="search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ArrowBackIcon
                    onClick={() => setIsSearchOpenOrNot((prev) => !prev)}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        ) : (
          ""
        )}
      </div> */}
      <Drawer
        anchor={"bottom"}
        open={usersDrawerOpen}
        sx={{
          zIndex: "1300 !important",
          "& .MuiPaper-root": {
            height: "400px",
            overflowY: "auto",
            padding: " 1rem 1rem",
            borderRadius: "20px 20px 0 0",
            background: "#F5F7FA",
            maxWidth: "calc(500px - 30px)",
            margin: "0 auto",
          },
        }}
      >
        <div className={styles.filterDrawerHeader}>
          <Typography className={styles.filterDrawerHeading}>
            Select Users
          </Typography>
          <IconButton
            sx={{ padding: "0" }}
            onClick={() => {
              setUsersDrawerOpen(false);
            }}
          >
            <CloseIcon sx={{ color: "#000" }} />
          </IconButton>
        </div>
        <div style={{ width: "100%" }}>
          {renderField ? (
            <Autocomplete
              sx={{
                width: "100%",
                borderRadius: "4px",
              }}
              id="size-small-outlined-multi"
              size="small"
              fullWidth
              noOptionsText={"No such User"}
              getOptionLabel={(option: any) => {
                return option.name;
              }}
              getOptionDisabled={(option) => {
                let selectedOption = usersArray?.length
                  ? usersArray?.some(
                      (item: userTaskType) =>
                        item?._id === option?._id && item?.name === option?.name
                    )
                  : false;
                return selectedOption;
              }}
              options={users}
              onChange={captureUser}
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
          ) : (
            ""
          )}
        </div>
        <div className={styles.allSelectedChipsBlock}>
          {usersArray?.map((user: any) => (
            <Chip
              sx={{
                background: "#f0fff0",
                border: "1px solid #05a155",
                borderRadius: "5px",
                fontFamily: "'Inter', sans-serif",
                "& .MuiSvgIcon-root ": {
                  color: "#05A155",
                  fontSize: "1.4rem",
                },
                "& .MuiSvgIcon-root:hover ": {
                  color: "#05A155",
                  fontSize: "1.4rem",
                },
              }}
              key={user._id}
              label={user.name}
              onDelete={() => {
                const updatedUsers = usersArray.filter(
                  (selectedUser: any) => selectedUser._id !== user._id
                );
                setUsersArray(updatedUsers);
                onUserChange(
                  updatedUsers.map((item: { _id: string }) => item._id)
                );
              }}
              style={{ marginRight: "5px", marginTop: "5px" }}
            />
          ))}
        </div>
        <div className={styles.filterDrawerBtnGrp}>
          <Button
            className={
              !usersArray?.length
                ? styles.disabledFilterDrawerCancelBtn
                : styles.filterDrawerCancelBtn
            }
            variant="outlined"
            disabled={!usersArray?.length}
            onClick={() => {
              onUserChange([]);
              setUsersArray([]);
            }}
          >
            Clear
          </Button>
          <Button
            className={
              !usersArray?.length
                ? styles.disabledFilterDrawerApplyBtn
                : styles.filterDrawerApplyBtn
            }
            variant="contained"
            disabled={!usersArray?.length}
            onClick={() => {
              setUsersDrawerOpen(false);
            }}
          >
            Apply
          </Button>
        </div>
      </Drawer>
      <React.Fragment>
        <Drawer
          onClose={() => toggleDrawer(false)}
          anchor={"bottom"}
          open={state}
        >
          <Box>
            <SortMenu />
          </Box>
        </Drawer>
      </React.Fragment>
    </header>
  );
};
export default TaskHeader;
