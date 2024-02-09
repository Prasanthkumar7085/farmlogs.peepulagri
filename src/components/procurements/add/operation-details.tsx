import { Chip, MenuItem, Select, SelectChangeEvent, TextField, TextareaAutosize } from "@mui/material";
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
import { DatePicker } from "rsuite";
import "rsuite/dist/rsuite.css";
import { isBefore, startOfDay } from "date-fns";

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

  setPriority: Dispatch<SetStateAction<string>>;
  priority: string;

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
  setPriority,
  priority,
}) => {
  const router = useRouter();

  const deleteEditedFarms = (id: string) => {
    let data = editFarms?.length
      ? editFarms.filter((item) => item._id != id)
      : [];
    setEditFarms(data);
  };
  const [age, setAge] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };
  const [options] = useState<Array<{ value: string; title: string }>>([
    { title: "Low", value: "LOW" },
    { title: "Medium", value: "MEDIUM" },
    { title: "High", value: "HIGH" },
  ]);

  return (
    <>
      <div className={styles.operationdetails}>
        <div className={styles.row} style={{ gridTemplateColumns: "2fr 1fr" }}>
          <div className={styles.selectfarm}>
            <label className={styles.label}>
              Title Of Operation<strong style={{ color: "red" }}>*</strong>
            </label>
            <TextField
              sx={{ background: "#fff" }}
              size="small"
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
          <div className={styles.selectfarm}>
            <label className={styles.label}>
              Date of Operation<strong style={{ color: "red" }}>*</strong>
            </label>
            <div className={styles.datepicker}>
              <DatePicker
                style={{
                  background: "#fff",
                  width: "100%",
                  marginBottom: "4px",
                }}
                value={dateOfOperation}
                editable={false}
                shouldDisableDate={(date) =>
                  isBefore(date, startOfDay(new Date()))
                }
                placeholder={"Select Date"}
                format="dd/MM/yyyy"
                onChange={(newValue: any) => {
                  setDataOfOperation(newValue);
                }}
              />

              <ErrorMessages
                errorMessages={errorMessages}
                keyname={"date_of_operation"}
              />
            </div>
          </div>
        </div>
        <div className={styles.row} style={{ gridTemplateColumns: "2fr 1fr" }}>
          <div className={styles.selectfarm}>
            <label className={styles.label}>
              {`Select Farm `} <strong style={{ color: "red" }}>*</strong>
            </label>
            <FarmAutoCompleteInAddProcurement
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

            <ErrorMessages errorMessages={errorMessages} keyname={"farm_ids"} />
          </div>
          <div className={styles.selectfarm}>
            <label className={styles.label}>{`Priority`}</label>
            <Select
              size="small"
              sx={{
                marginBottom: "8px",
                width: "100%",
                background: "#fff",
                color: "#6A7185",
                fontWeight: "300",
                fontFamily: "'Inter',sans-serif",
                fontSize: "13.5px",
              }}
              placeholder="Select Priority"
              onChange={(e: any) => setPriority(e.target.value)}
              value={priority}
            >
              {options?.length &&
                options.map(
                  (item: { value: string; title: string }, index: number) => {
                    return (
                      <MenuItem key={index} value={item.value}>
                        {item.title}
                      </MenuItem>
                    );
                  }
                )}
            </Select>
            <ErrorMessages errorMessages={errorMessages} keyname={"priority"} />
          </div>
        </div>
        <div
          style={{
            display:
              router.query.procurement_id && editFarms?.length
                ? "flex"
                : "none",
            marginBottom: "10px",
            flexWrap: "wrap",
            width: "65%"
          }}
        >
          {router.query.procurement_id && editFarms?.length
            ? editFarms.map((item, index) => {
              return (
                <div key={index} style={{ display: "flex", marginRight: "5px", marginBottom: "5px" }}>
                  <Chip
                    label={item.title}
                    key={item._id}
                    clickable
                    onDelete={() => deleteEditedFarms(item._id)}
                  />
                </div>
              );
            })
            : ""}
        </div>
        <div className={styles.remarks}>
          <label className={styles.label}>Remarks</label>
          <TextArea
            sx={{ background: "#fff" }}
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
