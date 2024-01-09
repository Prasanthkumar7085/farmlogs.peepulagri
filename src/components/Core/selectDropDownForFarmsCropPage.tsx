import { setFarmTitleTemp } from "@/Redux/Modules/Farms";
import { Autocomplete, TextField } from "@mui/material";
import { log } from "console";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const SelectAutoCompleteForFarmsCropPage = ({
  options,
  onSelectValueFromDropDown,
  label,
  placeholder,
  searchString,
  setSearchString,
  optionsLoading,
  setOptionsLoading,
  defaultValue,
}: any) => {
  const [defaultValueSet, setDefaultValueSet] = useState<any>("");
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      router.isReady &&
      router.query?.farm_id &&
      !searchString &&
      defaultValue
    ) {
      setDefaultValueSet(
        options && options.find((item: any) => item._id == router.query.farm_id)
      );
    }
  }, [router.isReady, defaultValue, router.query?.farm_id]);

  return (
    <div>
      <Autocomplete
        loading={optionsLoading}
        value={defaultValueSet ? defaultValueSet : null}
        size="small"
        id="combo-box-demo"
        options={options && options?.length ? options : []}
        getOptionLabel={(option: any) => {
          if (option._id == defaultValueSet?._id) {
            return option[label]
              ? option[label]?.toUpperCase() +
                  " (" +
                  +option["area"]?.toFixed(2) +
                  " acrs)"
              : "";
          }
          return option[label];
        }}
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
            onChange={(e) => {
              setOptionsLoading(true);
              setSearchString(e.target.value);
            }}
          />
        )}
        sx={{
          width: "100%",
          background: "#fff",
          "& .MuiInputBase-input ": {
            fontSize: "13px",
            fontWeight: "400",
            fontFamily: "'inter', sans-serif ",
            color: "#000",
          },
        }}
      />
    </div>
  );
};

export default SelectAutoCompleteForFarmsCropPage;