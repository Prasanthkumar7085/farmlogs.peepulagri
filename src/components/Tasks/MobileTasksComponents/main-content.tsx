import { Fade, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./main-content.module.css";

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
}: any) => {
  const loggedInUserId = useSelector(
    (state: any) => state.auth.userDetails?.user_details?._id
  );

  const [statusOptions] = useState<Array<{ value: string; title: string }>>([
    { value: "TO-START", title: "To-Start" },
    { value: "INPROGRESS", title: "In-Progress" },
    { value: "PENDING", title: "Pending" },
    { value: "DONE", title: "Done" },
    { value: "OVER-DUE", title: "Over-due" },
  ]);

  return (
    <>
      <div className={styles.maincontent}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.container}>
          <div>
            <p
              style={{
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
              {data?.status
                ? statusOptions?.find((item) => item.value == data?.status)
                    ?.title
                : ""}
            </p>
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
          {/* <p className={styles.farmname}>SpiceVine Gardens</p> */}
        </div>
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
