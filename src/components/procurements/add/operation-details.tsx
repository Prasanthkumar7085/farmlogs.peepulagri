import { Chip, TextField, TextareaAutosize } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import type { NextPage } from "next";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
} from "react";
// import PortalPopup from "./portal-popup";
import ErrorMessages from "@/components/Core/ErrorMessages";
import FarmAutoCompleteInAddProcurement from "./FarmAutoCompleteInAddProcurement";
import styles from "./operation-details.module.css";
import { useRouter } from "next/router";
import TextArea from '@mui/material/TextField';

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
  dateOfOperation: Date | null;
  setDataOfOperation: Dispatch<SetStateAction<Date | null>>;
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
  editFarms?: { title: string; _id: string }[] | [];
  setEditFarms: Dispatch<SetStateAction<{ title: string; _id: string }[] | []>>;

  isDisabled: boolean;
  setIsDisabled: Dispatch<SetStateAction<boolean>>;
}
const OperationDetails: NextPage<pagePropTypes> = ({
  farmOptions,
  onSelectFarmFromDropDown,
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
  editFarms,
  setEditFarms,
  isDisabled,
}) => {
  const router = useRouter();

  const deleteEditedFarms = (id: string) => {
    let data = editFarms?.length
      ? editFarms.filter((item) => item._id != id)
      : [];
    setEditFarms(data);
  };

  return (
    <>
      <div className={styles.operationdetails}>
        <div className={styles.row}>
          <div className={styles.nameofoperation}>
            <label className={styles.nameOfOperation}>
              Name Of Operation<strong style={{ color: "red" }}>*</strong>
            </label>
            <TextField
              disabled={isDisabled}
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>

                <DatePicker
                  disablePast
                  disabled={isDisabled}
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
              </LocalizationProvider>

              <ErrorMessages
                errorMessages={errorMessages}
                keyname={"date_of_operation"}
              />
            </div>
          </div>
        </div>
        <div className={styles.selectfarm}>
          <label className={styles.label}>
            {`Select Farm `} <strong style={{ color: "red" }}>*</strong>
          </label>
          <FarmAutoCompleteInAddProcurement
            isDisabled={isDisabled}
            options={farmOptions}
            onSelectFarmFromDropDown={onSelectFarmFromDropDown}
            label={"title"}
            placeholder={"Select Farms here"}
            defaultValue={defaultValue}
            optionsLoading={optionsLoading}
            setOptionsLoading={setOptionsLoading}
            searchString={searchString}
            setSearchString={setSearchString}
            editFarms={editFarms}
          />
          <ErrorMessages
            errorMessages={errorMessages}
            keyname={"farm_ids"}
          />
          <div style={{ display: "flex", }}>

            {router.query.procurement_id && editFarms?.length
              ? editFarms.map((item, index) => {
                return (
                  <div key={index} style={{ display: "flex", }}>

                    <Chip
                      label={item.title}
                      key={item._id}
                      clickable
                      disabled={isDisabled}
                      onDelete={() => deleteEditedFarms(item._id)}
                    />
                  </div>
                );
              })
              : ""}
          </div>
        </div>
        <div className={styles.remarks}>
          <label className={styles.label}>Remarks</label>
          <TextArea
            disabled={isDisabled}
            className={styles.inputbox}
            color="primary"
            multiline
            minRows={5}
            placeholder="Enter your remarks here"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
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
  );
};

export default OperationDetails;
