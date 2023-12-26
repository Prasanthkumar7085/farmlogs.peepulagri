import type { NextPage } from "next";
import {
  Autocomplete,
  Badge,
  Button,
  Chip,
  ClickAwayListener,
  Drawer,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Search } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import getAllUsersService from "../../../../lib/services/Users/getAllUsersService";
import { useSelector } from "react-redux";
import { userTaskType } from "@/types/tasksTypes";
import styles from "./taskHeader.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ClearIcon } from "@mui/x-date-pickers";
const TaskHeader = ({ onChangeSearch, searchString, onUserChange, getAllTasks }: any) => {
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
  const [user, setUser] = useState<userTaskType[] | null>([]);
  const [selectedUsers, setSelectedUsers] = useState<
    { name: string; _id: string }[] | null
  >();
  const [textFieldAutoFocus, setTextFieldAutoFocus] = useState(false);
  const [usersArray, setUsersArray] = useState<userTaskType[]>([]);
  const [renderField, setRenderField] = useState(true);
  const getAllUsers = async () => {
    const response = await getAllUsersService({ token: accessToken });
    if (response?.success) {
      setUsers(response?.data);
      setSelectedValue(response?.data);
    }
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
  const captureUser = (event: any, selectedObject: any) => {
    if (selectedObject) {
      setUsersArray([...usersArray, selectedObject]);
      setRenderField(false);
      setTimeout(() => {
        setRenderField(true);
      }, 0.1);
      setSelectedUsers(null);
    } else {
      setSelectedUsers(null);
    }
  };
  console.log(usersArray, 'plpl');
  console.log(selectedUsers, 'plpl');
  return (
    <header className={styles.header}>
      <div className={styles.row}>
        {!isSearchOpenOrNot ? (
          <div className={styles.group}>
            {/* <IconButton sx={{ padding: "0" }} onClick={() => router.back()}>
              <img
                className={styles.arrowDownBold1Icon}
                alt=""
                src="/arrowdownbold-1@2x.png"
              />
            </IconButton> */}
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
                width: "90%",
                borderRadius: "20px",
                background: "#fff !important",
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
              badgeContent={usersArray?.length}
              color="success"
              sx={{
                "& .MuiBadge-badge": {
                  fontWeight: "600",
                  fontFamily: "'Inter', sans-serif"
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
            ''
          )}
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
        <div className={styles.filterDrawerHeader} >
          <Typography className={styles.filterDrawerHeading} >Select Users</Typography>
          <IconButton sx={{ padding: "0" }}
            onClick={() => {
              setUsersDrawerOpen(false);
            }}
          >
            <CloseIcon sx={{ color: "#000" }} />
          </IconButton>
        </div>
        <div style={{ width: "100%" }}>
          {renderField ? <Autocomplete
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
          /> : ""}
        </div>
        <div className={styles.allSelectedChipsBlock}>
          {usersArray?.map((user: any) => (
            <Chip
              className={styles.selectedUser}
              key={user._id}
              label={user.name}
              onDelete={() => {
                const updatedUsers = usersArray.filter(
                  (selectedUser: any) => selectedUser._id !== user._id
                );
                setUsersArray(updatedUsers);
              }}
              style={{ marginRight: "5px", marginTop: "5px" }}
            />
          ))}
        </div>
        <div className={styles.filterDrawerBtnGrp} >
          <Button
            sx={{}}
            variant="outlined"
            disabled={!usersArray?.length}
            onClick={() => {
              setSelectedUsers([]);
              onUserChange([]);
              setUsersArray([]);
            }}
          >
            Clear
          </Button>
          <Button
            sx={{}}
            variant="contained"
            disabled={!usersArray?.length}
            onClick={() => {
              onUserChange(usersArray.map((item: { _id: string }) => item._id))
              setUsersDrawerOpen(false);
            }}
          >
            Apply
          </Button>
        </div>
      </Drawer>
    </header >
  );
};
export default TaskHeader;
