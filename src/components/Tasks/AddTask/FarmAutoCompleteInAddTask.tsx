import { setFarmTitleTemp } from "@/Redux/Modules/Farms";
import { Autocomplete, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const FarmAutoCompleteInAddTask = ({ options, value, onSelectValueFromDropDown, label, placeholder, defaultValue }: any) => {

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
      <div>
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
                sx={{ width: "500px" }}
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
}

export default FarmAutoCompleteInAddTask;