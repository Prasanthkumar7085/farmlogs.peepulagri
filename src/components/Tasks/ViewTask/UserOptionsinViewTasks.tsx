import {
  Autocomplete,
  Chip,
  CircularProgress,
  Fade,
  InputAdornment,
  LinearProgress,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getAllUsersService from "../../../../lib/services/Users/getAllUsersService";
import styles from "./userOptions.module.css"
interface PropsType {
  userId: string;
  onChange: (assigned_to: any) => void;
  assignee: Array<{ _id: string; name: string }>,
}

const UserOptionsinViewTasks: React.FC<PropsType> = ({ userId, onChange, assignee }) => {
  const router = useRouter();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [userData, setUserData] = useState<Array<any>>([]);
  const [selectedUsers, setSelectedUsers] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [usersArray, setUsersArray] = useState<any>([])
  const [renderField, setRenderField] = useState(true);
  const captureUser = (event: any, selectedObject: any) => {
    if (selectedObject) {
      setSelectedUsers(selectedObject);
      setUsersArray([...usersArray, selectedObject])
      onChange([...usersArray, selectedObject]);
      setRenderField(false);
      setTimeout(() => {
        setRenderField(true);
      }, 0.1);
      setSelectedUsers(null);

    } else {
      setSelectedUsers(null);
      onChange([...usersArray, selectedObject]);
    }
  };

  const getAllUsers = async (id = "") => {
    setLoading(true);

    const response = await getAllUsersService({ token: accessToken });

    if (response?.success) {
      setUserData(response?.data);


      // if (id) {
      //   let obj = response?.data?.find((item: any) => item._id == id);

      //   setSelectedUsers([obj]); // Use setSelectedUsers to set the default value
      //   setUserLoaded(true);
      //   setTimeout(() => {
      //     setUserLoaded(false);
      //   }, 1);
      // }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (accessToken) {
      getAllUsers(userId);
    }
  }, [accessToken]);



  return (
    <div>
      {!userLoaded && renderField ? (
        <Autocomplete
          sx={{
            width: "100%",
            borderRadius: "4px",
            border: "1px solid lightgrey",
            "& .MuiInputBase-root": {
              paddingBlock: "5px !important",
              background: "#fff",
              maxHeight: "200px", overflowY: "auto"

            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: "#fff !important"
            }

          }}
          id="size-small-outlined-multi"
          size="small"
          fullWidth
          noOptionsText={"No such User"}
          isOptionEqualToValue={(option: any, value: any) =>
            option._id === value._id
          }
          value={selectedUsers}
          onChange={captureUser}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option._id}>
                {option.name}
              </li>
            );
          }}
          getOptionDisabled={(option) =>
            assignee?.length
              ? assignee?.some(
                (item) =>
                  item?._id === option?._id && item?.name === option?.name
              )
              : false
          }
          getOptionLabel={(option: any) => option.name}
          options={userData ? userData : []}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select users"
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
      <div className={styles.allSelectedUsersBlock
      }>

        {usersArray?.map((user: any) => (
          <Chip className={styles.selectedUser}
            key={user._id}
            label={user.name}
            onDelete={() => {
              const updatedUsers = usersArray.filter(
                (selectedUser: any) => selectedUser._id !== user._id
              );
              setUsersArray(updatedUsers);
            }}
            style={{ marginRight: '5px' }}
          />
        ))}
      </div>
      {loading ? <LinearProgress sx={{ height: "2px", color: "blue" }} /> : ""}
    </div>
  );
};

export default UserOptionsinViewTasks;
