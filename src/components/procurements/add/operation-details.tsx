import type { NextPage } from "next";
import {
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from "react";
import {
  TextField,
  InputAdornment,
  Icon,
  IconButton,
  Select,
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Dropdown from "./dropdown";
// import PortalPopup from "./portal-popup";
import styles from "./operation-details.module.css";
import FarmAutoCompleteInAddProcurement from "./FarmAutoCompleteInAddProcurement";
import ErrorMessages from "@/components/Core/ErrorMessages";

interface pagePropTypes {
  farmOptions: string[];
  onSelectFarmFromDropDown: (value: string | any, reason: string) => void;
  label: string;
  placeholder: string;
  defaultValue: any | null | undefined;
  optionsLoading: boolean;
  setOptionsLoading: Dispatch<SetStateAction<boolean>>;
  searchString: string;
  setSearchString: Dispatch<SetStateAction<string>>;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  dateOfOperation: string;
  setDataOfOperation: Dispatch<SetStateAction<string>>;
  remarks: string;
  setRemarks: Dispatch<SetStateAction<string>>;

  errorMessages: {
    date_of_operation?: string;
    farm_ids?: string;
    title?: string;
  };
  setErrorMessages: Dispatch<
    SetStateAction<
      Partial<{ date_of_operation?: string; farm_ids?: string; title?: string }>
    >
  >;
}
const OperationDetails: NextPage<pagePropTypes> = ({
  farmOptions,
  onSelectFarmFromDropDown,
  label,
  placeholder,
  defaultValue,
  optionsLoading,
  setOptionsLoading,
  searchString,
  setSearchString,

  title,
  setTitle,
  dateOfOperation,
  setDataOfOperation,
  remarks,
  setRemarks,

  errorMessages,
  setErrorMessages,
}) => {
  const [isDropdown1Open, setDropdown1Open] = useState(false);

  const openDropdown1 = useCallback(() => {
    setDropdown1Open(true);
  }, []);

  const closeDropdown1 = useCallback(() => {
    setDropdown1Open(false);
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <>
        <div className={styles.operationdetails}>
          <div className={styles.row}>
            <div className={styles.nameofoperation}>
              <label className={styles.nameOfOperation}>
                Name Of Operation<strong style={{ color: "red" }}>*</strong>
              </label>
              <TextField
                className={styles.inoutbox}
                color="primary"
                placeholder="Enter your title here"
                variant="outlined"
                value={title}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
                }
              />
              <ErrorMessages errorMessages={errorMessages} keyname={"title"} />
            </div>
            <div className={styles.dateofoperation}>
              <label className={styles.label}>
                Date of Operation<strong style={{ color: "red" }}>*</strong>
              </label>
              <div className={styles.datepicker}>
                <DatePicker
                  label="Select Date "
                  value={dateOfOperation}
                  onChange={(newValue: any) => {
                    setDataOfOperation(newValue);
                  }}
                  slotProps={{
                    textField: {
                      variant: "standard",
                      size: "medium",
                      color: "primary",
                    },
                  }}
                />
                <ErrorMessages
                  errorMessages={errorMessages}
                  keyname={"date_of_operation"}
                />
              </div>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.selectfarm}>
              <label className={styles.label}>
                {`Select Farm `} <strong style={{ color: "red" }}>*</strong>
              </label>
              <FarmAutoCompleteInAddProcurement
                options={farmOptions}
                onSelectFarmFromDropDown={onSelectFarmFromDropDown}
                label={"title"}
                placeholder={"Select Farm here"}
                defaultValue={defaultValue}
                optionsLoading={optionsLoading}
                setOptionsLoading={setOptionsLoading}
                searchString={searchString}
                setSearchString={setSearchString}
              />
              <ErrorMessages
                errorMessages={errorMessages}
                keyname={"farm_ids"}
              />
            </div>
            <div className={styles.remarks}>
              <label className={styles.nameOfOperation}>Remarks</label>
              <TextField
                className={styles.inputbox}
                color="primary"
                defaultValue="Enter your remarks here"
                variant="filled"
                multiline
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* {isDropdown1Open && (
          <PortalPopup
            overlayColor="rgba(113, 113, 113, 0.3)"
            placement="Centered"
            onOutsideClick={closeDropdown1}
          >
            <Dropdown onClose={closeDropdown1} />
          </PortalPopup>
        )} */}
      </>
    </LocalizationProvider>
  );
};

export default OperationDetails;
