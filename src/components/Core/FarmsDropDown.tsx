import { setFarmTitleTemp } from "@/Redux/Modules/Farms";
import { Autocomplete, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const FarmsDropDown = ({
  options,
  onSelectValueFromFarmsDropDown,
  label,
  placeholder,
  searchString,
  getFarmsSearchString,
  optionsLoading,
  setOptionsLoading,
  farmDefaultValue
}: any) => {
  const [defaultValueSet, setDefaultValueSet] = useState<any>("");
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {

    if (farmDefaultValue) {

      setDefaultValueSet(
        options && options.find((item: any) => item._id == farmDefaultValue)
      );
    }
    else {
      setDefaultValueSet(
        options && options.find((item: any) => item._id == defaultValueSet?._id)
      );
    }

  }, [options, farmDefaultValue]);

  return (
    <div>
      <Autocomplete
        loading={optionsLoading}
        value={defaultValueSet ? defaultValueSet : null}
        size="small"
        id="combo-box-demo"
        options={options && options?.length ? options : []}
        getOptionLabel={(option: any) =>
          option[label] ? option[label]?.toUpperCase() : ""
        }
        onChange={(e: any, value: any, reason: any) => {
          if (value) {
            onSelectValueFromFarmsDropDown(value, reason);
            setDefaultValueSet(value);
          } else {
            onSelectValueFromFarmsDropDown("", reason);
            setDefaultValueSet(null);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={"Select Farm"}
            onChange={(e) => {
              // setOptionsLoading(true);
              getFarmsSearchString(e.target.value);
            }}
          />
        )}
        sx={{
          width: "100%",
          background: "#fff",
          borderRadius: "24px",


          "& .MuiInputBase-input ": {
            fontSize: "13px",
            fontWeight: "400",
            fontFamily: "'inter', sans-serif ",
            color: "#000",
          },
          "& .MuiInputBase-root": {
            background: "#fff",
            color: "#000",
            padding: "11px 14px !important",
          },
          '& .MuiOutlinedInput-notchedOutline ': {
            border: "1px solid grey !important",
          },

        }}

      />
    </div>
  );
};

export default FarmsDropDown;