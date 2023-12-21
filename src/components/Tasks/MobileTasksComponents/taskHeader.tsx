import type { NextPage } from "next";
import { Autocomplete, Button, Drawer, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Search } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import getAllUsersService from "../../../../lib/services/Users/getAllUsersService";
import { useSelector } from "react-redux";
import { userTaskType } from "@/types/tasksTypes";
import styles from "./taskHeader.module.css"
const TaskHeader = ({ onChangeSearch, onUserChange }: any) => {
  const router = useRouter();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<Array<userTaskType>>([]);
  const [usersDrawerOpen, setUsersDrawerOpen] = useState<any>(false);

  const [selectedUsers, setSelectedUsers] = useState<
    { name: string; _id: string }[] | null
  >();

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

  return (
    <header className={styles.header}>
      <div className={styles.row}>
        <div className={styles.group}>
          <IconButton sx={{ padding: "0" }} onClick={() => router.back()}>
            <img
              className={styles.arrowDownBold1Icon}
              alt=""
              src="/arrowdownbold-1@2x.png"
            />
          </IconButton>
          <h1 className={styles.title}>Tasks</h1>
        </div>
        <div className={styles.actions}>
          <div className={styles.search}>
            <img
              className={styles.magnifyingGlass1Icon}
              alt=""
              src="/magnifyingglass-1@2x.png"
            />
          </div>
          <div className={styles.filter} onClick={() => setUsersDrawerOpen(true)}>
            <img className={styles.funnel1Icon} alt="" src="/funnel-1@2x.png" />
          </div>
        </div>
      </div>
      <div style={{ width: "100%" }}>
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
            width: "100%", borderRadius: "20px", background: "#fff !important",
            '& .MuiInputBase-root': {
              borderRadius: "20px !important"
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderRadius: "20px !important",
              borderColor: "#fff !important"

            },
            '& .MuiInputBase-input': {
              paddingBlock: "11px"
            }
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
      </div>
      <Drawer
        anchor={"bottom"}
        open={usersDrawerOpen}
        sx={{
          zIndex: "1300 !important",
          "& .MuiPaper-root": {
            height: "400px",
            overflowY: "auto",
            padding: "0 1rem 1rem",
            borderRadius: "20px 20px 0 0",
            background: "#F5F7FA",
            maxWidth: "calc(500px - 30px)",
            margin: "0 auto",
          },
        }}
      >
        <div className={styles.updateTagDrawerHeading}>
          <Typography>Select Users</Typography>
          <IconButton
            sx={{ marginLeft: '95%' }}
            onClick={() => {
              setUsersDrawerOpen(false);
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div style={{ width: "100%" }}>
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
        <div style={{ marginLeft: '50%', marginTop: '50%' }}>

          <Button
            sx={{ marginRight: '50px' }}
            variant='outlined'
            onClick={() => {
              setSelectedUsers([]);
              onUserChange([]);
              setUsersDrawerOpen(false);
            }}
          >

            Clear
          </Button>


          <Button
            sx={{ marginLeft: '20px' }}
            variant="contained"
            onClick={() => {
              setUsersDrawerOpen(false);
            }}
          >

            Apply
          </Button>

        </div>
      </Drawer>
    </header>
  );
};

export default TaskHeader;
