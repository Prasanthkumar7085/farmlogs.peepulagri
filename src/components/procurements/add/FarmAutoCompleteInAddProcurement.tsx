import { setFarmTitleTemp } from "@/Redux/Modules/Farms";
import { Autocomplete, ClickAwayListener, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface PropsTypes {
  options: Array<any> | null | undefined;
  onSelectFarmFromDropDown: (value: string | any, reason: string) => void;
  label: string;
  placeholder: string;
  defaultValue: any | null | undefined;
  optionsLoading: boolean;
  setOptionsLoading: Dispatch<SetStateAction<boolean>>;
  searchString: string;
  setSearchString: Dispatch<SetStateAction<string>>;
  editFarms?: { title: string; _id: string }[] | [];
}
const FarmAutoCompleteInAddProcurement: React.FC<PropsTypes> = ({
  options,
  onSelectFarmFromDropDown,
  label,
  placeholder,
  defaultValue,
  optionsLoading,
  setOptionsLoading,
  setSearchString,
  editFarms,
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
    <div>
      {!autoCompleteLoading ? (
        <ClickAwayListener onClickAway={() => setSearchString("")}>

          <Autocomplete
            multiple
            limitTags={router.pathname.includes("/users-procurements") ? 2 : 3}
            // groupBy={(option) => option?.user_id?.full_name}
            value={defaultValueSet}
            disablePortal
            size="small"
            id="combo-box-demo"
            sx={{ width: "100%", background: "#fff" }}
            options={options && options?.length ? options : []}
            loading={optionsLoading}
            getOptionLabel={(option: any) =>
              option[label] ? option[label]?.toUpperCase() : ""
            }
            getOptionDisabled={(option) =>
              Boolean(editFarms?.some((item) => item._id == option._id))
            }
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
                onChange={(e) => {
                  setOptionsLoading(true);
                  setSearchString(e.target.value);
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
        </ClickAwayListener>
      ) : (
        ""
      )}
    </div>
  );
};

export default FarmAutoCompleteInAddProcurement;
