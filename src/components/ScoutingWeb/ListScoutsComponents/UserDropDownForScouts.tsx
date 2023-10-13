import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface pageProps {
  user: any;
  onChangeUser: (e: any, value: any) => void;
  usersOptions: any;
}
const UserDropDownForScouts = ({
  user,
  onChangeUser,
  usersOptions,
}: pageProps) => {
  const [defaultValueSet, setDefaultValueSet] = useState(user);
  const [autoCompleteLoading, setAutoCompleteLoading] = useState(false);
  useEffect(() => {
    if (user) {
      setDefaultValueSet(user);
    } else {
      setDefaultValueSet(null);
    }
    setAutoCompleteLoading(true);
    setTimeout(() => {
      setAutoCompleteLoading(false);
    }, 1);
  }, [user]);

  return (
    <div>
      {!autoCompleteLoading ? (
        <Autocomplete
          sx={{
            width: "250px",
            maxWidth: "250px",
            borderRadius: "4px",
          }}
          id="size-small-outlined-multi"
          size="small"
          fullWidth
          noOptionsText={"No such User"}
          value={defaultValueSet}
          isOptionEqualToValue={(option: any, value: any) =>
            option.phone === value.phone
          }
          renderOption={(props, option) => {
            return (
              <li {...props} key={option?._id}>
                {option?.phone}
              </li>
            );
          }}
          getOptionLabel={(option: any) => option.phone}
          options={usersOptions}
          onChange={onChangeUser}
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
    </div>
  );
};

export default UserDropDownForScouts;
