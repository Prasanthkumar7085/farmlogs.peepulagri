import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface PropsTypes {
  options: Array<any> | null | undefined;
  onSelectFarmFromDropDown: (value: string | any, reason: string) => void;
  farm: string;
  placeholder: string;
  defaultValue: any | null | undefined;
}
const CropAutoCompleteFoScouts: React.FC<PropsTypes> = ({
  options,
  onSelectFarmFromDropDown,
  farm,
  placeholder,
  defaultValue,
}) => {
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
    <div>
      {!autoCompleteLoading ? (
        <Autocomplete
          disabled={!farm}
          value={defaultValueSet}
          disablePortal
          size="small"
          id="grouped-demo"
          options={options?.length ? options : []}
          getOptionLabel={(option: any) => option.title}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option?._id}>
                {option?.title}
              </li>
            );
          }}
          onChange={(e: any, value: any, reason: any) => {
            if (value) {
              onSelectFarmFromDropDown(value, reason);
              setDefaultValueSet(value);
            } else {
              onSelectFarmFromDropDown("", reason);
              setDefaultValueSet(null);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={placeholder}
              sx={{ width: "100%", background: "#fff" }}
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

export default CropAutoCompleteFoScouts;
