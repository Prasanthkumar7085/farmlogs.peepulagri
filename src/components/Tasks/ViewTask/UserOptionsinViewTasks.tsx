import {
  Autocomplete,
  Chip,
  CircularProgress,
  InputAdornment,
  LinearProgress,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getAllUsersService from "../../../../lib/services/Users/getAllUsersService";

interface PropsType {
  userId: string;
  onChange: (assigned_to: any) => void;
  assignee: Array<{ _id: string; name: string }>
}

const UserOptionsinViewTasks: React.FC<PropsType> = ({ userId, onChange, assignee }) => {
  const router = useRouter();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [userData, setUserData] = useState<Array<any>>([]);
  const [selectedUsers, setSelectedUsers] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);

  const captureUser = (event: any, selectedObject: any) => {
    if (selectedObject) {
      setSelectedUsers(selectedObject);
      onChange(selectedObject);
    } else {
      setSelectedUsers([]);
      onChange([]);
    }
  };

  const getAllUsers = async (id = "") => {
    setLoading(true);

    const response = await getAllUsersService({ token: accessToken });

    if (response?.success) {
      setUserData(response?.data);

      if (id) {
        let obj = response?.data?.find((item: any) => item._id == id);

        setSelectedUsers([obj]); // Use setSelectedUsers to set the default value
        setUserLoaded(true);
        setTimeout(() => {
          setUserLoaded(false);
        }, 1);
      }
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
      {/* <div>
        {tagValue ? (
          <div >
            {tagValue?.length ? (
              <div >
                {tagValue?.map((item: string, index: number) => {
                  return (
                    <Chip
                      sx={{
                        border: "1px solid #d94841",
                        color: "#d94841",
                        marginRight: "5px",
                        marginBottom: "10px",
                        "& .MuiSvgIcon-root": {
                          color: "#d94841",
                        },
                        "& .MuiSvgIcon-root:hover": {
                          color: "#d94841 !important",
                        },
                      }}
                      // onDelete={() =>
                      //   deleteTagLoading ? () => { } : handleDeleteChip(item)
                      // }
                      key={index}
                      label={item}
                      // className={styles.tagsName}
                      variant="outlined"
                      size="medium"
                    />
                  );
                })}
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div> */}
      {!userLoaded ? (
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
          multiple
          noOptionsText={"No such User"}
          value={selectedUsers}
          isOptionEqualToValue={(option: any, value: any) =>
            option._id === value._id
          }
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
          onChange={captureUser}
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
      {loading ? <LinearProgress sx={{ height: "2px", color: "blue" }} /> : ""}
    </div>
  );
};

export default UserOptionsinViewTasks;
