import { Fade, IconButton, Menu, MenuItem, TextField } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./main-content.module.css";
import ErrorMessages from "@/components/Core/ErrorMessages";
import {
  LocalizationProvider,
  MobileDatePicker,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
const MainContent = ({
  title,
  onChangeStatus,
  open,
  anchorEl,
  handleClose,
  status,
  hasEditAccess,
  data,
  handleClick,
  editField,
  editFieldOrNot,
  setTitle,
  errorMessages,
  setEditField,
  setEditFieldOrNot,
  onUpdateField,
  calenderOpen,
  handleCalenderOpen,
  handleCalenderClose,
  deadlineString,
  setDeadlineString,
  onUpdateDeadlineField,
}: any) => {
  const loggedInUserId = useSelector(
    (state: any) => state.auth.userDetails?.user_details?._id
  );

  const [statusOptions] = useState<
    Array<{ value: string; title: string; color: string }>
  >([
    { value: "TO-START", title: "To-Start", color: "#57b6f0" },
    { value: "INPROGRESS", title: "In-Progress", color: "#f2a84c" },
    { value: "DONE", title: "Done", color: "#46a845" },
    { value: "OVER-DUE", title: "Over-due", color: "#d94841" },
  ]);

  return (
    <>
      <div className={styles.maincontent}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {editField == "title" && editFieldOrNot ? (
            <div style={{ width: "100%" }}>
              <TextField
                placeholder="Enter Title here"
                sx={{
                  width: "100%",
                  background: "#ffff",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#45A845 !important",
                    borderRadius: "8px !important",
                  },
                }}
                size="small"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <ErrorMessages errorMessages={errorMessages} keyname="title" />
            </div>
          ) : (
            <div className={styles.titleBlock}>
              {status !== "DONE" && loggedInUserId == data?.created_by?._id ? (
                <h6
                  className={styles.title}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setEditField("title");
                    setEditFieldOrNot(true);
                  }}
                >
                  {data?.title
                    ? data?.title.slice(0, 1).toUpperCase() +
                      data?.title.slice(1)
                    : "-"}
                </h6>
              ) : (
                <h6 className={styles.title}>
                  {data?.title
                    ? data?.title.slice(0, 1).toUpperCase() +
                      data?.title.slice(1)
                    : "-"}
                </h6>
              )}
            </div>
          )}
          {editField == "title" && editFieldOrNot ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "0.5rem",
              }}
            >
              <IconButton
                sx={{ padding: "0" }}
                onClick={() => {
                  setEditField("");
                  setEditFieldOrNot(false);
                }}
              >
                <img
                  src="/viewTaskIcons/cancel-icon.svg"
                  alt=""
                  width={"20px"}
                />
              </IconButton>

              <IconButton
                sx={{ padding: "0" }}
                onClick={() => {
                  onUpdateField({});
                }}
              >
                <img
                  src="/viewTaskIcons/confirm-icon.svg"
                  alt=""
                  width={"20px"}
                />
              </IconButton>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className={styles.container}>
          <p
            className={styles.statusSelect}
            style={{
              color: data?.status
                ? statusOptions?.find((item) => item.value == data?.status)
                    ?.color
                : "#d0d5dd",
              border: `1px solid ${
                data?.status
                  ? statusOptions?.find((item) => item.value == data?.status)
                      ?.color
                  : "#d0d5dd"
              }`,
              cursor:
                status !== "DONE" &&
                (loggedInUserId == data?.created_by?._id || hasEditAccess)
                  ? "pointer"
                  : "default",
            }}
            onClick={(e) =>
              status !== "DONE" &&
              (loggedInUserId == data?.created_by?._id || hasEditAccess)
                ? handleClick(e)
                : ""
            }
          >
            <span>
              {data?.status
                ? statusOptions?.find((item) => item.value == data?.status)
                    ?.title
                : ""}
            </span>
            {status !== "DONE" &&
            (loggedInUserId == data?.created_by?._id || hasEditAccess) ? (
              <KeyboardArrowDownIcon sx={{ fontSize: "1rem" }} />
            ) : (
              ""
            )}
          </p>
          {/* <p className={styles.dueDate}>Due Date</p> */}
          <div className={styles.datePicker} style={{ display: "flex" }}>
            <img
              onClick={() => {
                if (
                  status !== "DONE" &&
                  loggedInUserId == data?.created_by?._id
                )
                  handleCalenderOpen();
              }}
              src="/viewTaskIcons/calender-icon.svg"
              alt=""
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDateTimePicker
                open={calenderOpen}
                onOpen={handleCalenderOpen}
                onClose={handleCalenderClose}
                sx={{
                  width: "100%",
                  "& .MuiButtonBase-root": {
                    lineHeight: "0 !important",
                  },

                  "& .MuiInputBase-root::before": {
                    borderBottom: "0 !important",
                  },
                  "& .MuiInputBase-root::after": {
                    borderBottom: "0 !important",
                  },
                  "& .MuiInputBase-input": {
                    padding: "0",
                    fontSize: "12px",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: "600",
                  },
                }}
                disablePast
                value={new Date(deadlineString)}
                disabled={
                  status === "DONE" ||
                  !(loggedInUserId == data?.created_by?._id)
                }
                onAccept={(newValue: any) => {
                  let dateNow = new Date(newValue);

                 setDeadlineString(
                   new Date(dateNow?.toUTCString())?.toISOString()
                 );

                 onUpdateDeadlineField({
                   deadlineProp: new Date(
                     dateNow?.toUTCString()
                   )?.toISOString(),
                 });
                }}
                format="dd/MM/yyyy hh:mm aa"
                slotProps={{
                  textField: {
                    variant: "standard",
                    size: "medium",
                    color: "primary",
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
        <Menu
          id="fade-menu"
          MenuListProps={{
            "aria-labelledby": "fade-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
          className={styles.statusMenu}
          PaperProps={{
            style: {
              width: "15ch",
              borderRadius: "20px !important",
            },
          }}
        >
          {statusOptions?.length &&
            statusOptions.map(
              (item: { value: string; title: string }, index: number) => {
                if (item.value !== "OVER-DUE")
                  return (
                    <MenuItem
                      sx={{ minHeight: "inherit" }}
                      disabled={status == item.value}
                      className={
                        status == item.value
                          ? styles.statusMenuItemSelected
                          : styles.statusMenuItem
                      }
                      onClick={() => {
                        handleClose();
                        onChangeStatus(item.value);
                      }}
                      key={index}
                      value={item.value}
                    >
                      {item.title}
                    </MenuItem>
                  );
              }
            )}
        </Menu>
      </div>
      {/* {isStatusOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeStatus}
        >
          <Status1 onClose={closeStatus} />
        </PortalPopup>
      )} */}
    </>
  );
};

export default MainContent;
