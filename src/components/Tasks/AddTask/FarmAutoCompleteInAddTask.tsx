import { setFarmTitleTemp } from "@/Redux/Modules/Farms";
import { FarmInTaskType } from "@/types/tasksTypes";
import { Autocomplete, CircularProgress, InputAdornment, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface PropsTypes {
  options: Array<FarmInTaskType> | null | undefined;
  onSelectValueFromDropDown: (value: string | any, reason: string) => void;
  label: string;
  placeholder: string;
  defaultValue: FarmInTaskType | null | undefined;
  loading: boolean
}
const FarmAutoCompleteInAddTask: React.FC<PropsTypes> = ({
  options,
  onSelectValueFromDropDown,
  label,
  placeholder,
  defaultValue,
  loading
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [defaultValueSet, setDefaultValueSet] = useState(defaultValue);
  const [autoCompleteLoading, setAutoCompleteLoading] = useState(false);

  useEffect(() => {
    setDefaultValueSet(defaultValue);
    setAutoCompleteLoading(true);
    setTimeout(() => {
      setAutoCompleteLoading(false);
    }, 1);
  }, [defaultValue]);

  return (
    <div style={{ width: "100%" }}>
      {!autoCompleteLoading ? (
        <Autocomplete
          value={defaultValueSet}
          disablePortal
          size="small"
          id="combo-box-demo"
          options={options && options?.length ? options : []}
          getOptionLabel={(option: any) =>
            option[label] ? option[label]?.toUpperCase() : ""
          }
          onChange={(e: any, value: any, reason: any) => {
            if (value) {
              onSelectValueFromDropDown(value, reason);
              setDefaultValueSet(value);
              dispatch(setFarmTitleTemp(value?.title));
            } else {
              onSelectValueFromDropDown("", reason);
              setDefaultValueSet(null);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={placeholder}
              sx={{ width: "100%", background: "#fff" }}
              InputProps={{
                endAdornment: <InputAdornment position="start">
                  {loading ? <CircularProgress size="1.5rem" sx={{ color: "blue" }} /> : ""}
                </InputAdornment>,
              }}
            />
          )}

        // sx={{
        //     width: '1000%',
        //     background: "#fff",
        //     "& .MuiInputBase-input ": {
        //         fontSize: "13px",
        //         fontWeight: "400",
        //         fontFamily: "'inter', sans-serif ",
        //         color: "#000",

        //     }
        // }}
        />
      ) : (
        ""
      )}

    </div>
  );
};

export default FarmAutoCompleteInAddTask;