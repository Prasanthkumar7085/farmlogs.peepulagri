import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getAllUsersService from "../../../../lib/services/Users/getAllUsersService";

interface PropsType {
  userId: string;
  onChange: (assigned_to: any) => void;
}
const UserOptionsinViewTasks: React.FC<PropsType> = ({ userId, onChange }) => {
  const router = useRouter();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [userData, setUserData] = useState<Array<any>>([]);
  const [defaultValue, setDefaultValue] = useState<any | null>();
  const [loading, setLoading] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);

  const captureUser = (event: any, selectedObject: any) => {
    if (selectedObject && Object.keys(selectedObject).length) {
      setDefaultValue(selectedObject);
      onChange(selectedObject);
    } else {
      setDefaultValue(null);
      onChange("");
    }
  };

  const getAllUsers = async (id = "") => {
    setLoading(true);

    const response = await getAllUsersService({ token: accessToken });

    if (response?.success) {
      setUserData(response?.data);

      if (id) {
        let obj = response?.data?.find((item: any) => item._id == id);

        setDefaultValue(obj);
        setUserLoaded(true);
        setTimeout(() => {
          setUserLoaded(false);
        }, 1);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (router.isReady && accessToken) {
      if (router.query.task_id) {
        getAllUsers(userId);
      }
    }
  }, [router.isReady, accessToken]);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {!userLoaded ? (
        <Autocomplete
          sx={{
            width: "100%",
            borderRadius: "4px",
          }}
          id="size-small-outlined-multi"
          size="small"
          fullWidth
          noOptionsText={"No such User"}
          value={defaultValue}
          isOptionEqualToValue={(option: any, value: any) =>
            option._id === value._id
          }
          renderOption={(props, option) => {
            return (
              <li {...props} key={option._id}>
                {option.phone}
              </li>
            );
          }}
          getOptionLabel={(option: any) => option.phone}
          options={userData}
          onChange={captureUser}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search by User Mobile"
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
      {loading ? <CircularProgress size="1.5rem" sx={{ color: "blue" }} /> : ""}
    </div>
  );
};
export default UserOptionsinViewTasks;
