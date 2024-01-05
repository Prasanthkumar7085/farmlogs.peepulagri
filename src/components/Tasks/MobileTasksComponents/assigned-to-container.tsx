import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  Avatar,
  Button,
  CircularProgress,
  ClickAwayListener,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import styles from "src/components/Tasks/MobileTasksComponents/assigned-by-container.module.css";
import deleteAssigneeInTaskService from "../../../../lib/services/TasksService/deleteAssigneeInTaskService";
const AssignedToContainer = ({
  setUsersDrawerOpen,
  assignee,
  hasEditAccess,
  data,
  status,
  getTaskById,
}: any) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const loggedInUserId = useSelector(
    (state: any) => state.auth.userDetails?.user_details?._id
  );

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [checkBoxOpen, setCheckBoxOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [, , removeCookie] = useCookies(["userType_v2"]);
  const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);
  const [assigneeId, setAssigneeId] = useState("");
  const [viewPersonId, setViewPersonId] = useState("");
  const [showAllAssignee, setShowAllAssignees] = useState(false);

  const logout = async () => {
    try {
      removeCookie("userType_v2");
      loggedIn_v2("loggedIn_v2");
      router.push("/");
      await dispatch(removeUserDetails());
      await dispatch(deleteAllMessages());
    } catch (err: any) {
      console.error(err);
    }
  };

  const deleteAssignee = async (id: string) => {
    setDeleteLoading(true);
    try {
      let body = {
        assign_to: [id],
      };
      const response = await deleteAssigneeInTaskService({
        id: router.query.task_id as string,
        token: accessToken,
        body: body,
      });
      if (response?.success) {
        toast.success(response?.message);
        setCheckBoxOpen(false);
        getTaskById();
      } else if (response?.status == 422) {
        toast.error(response?.message);
      }
      //  else if (response?.status == 401) {
      //   logout();
      // }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className={styles.assignedTocontainer}>
      <div className={styles.assignToHeader}>
        <p className={styles.assignedToHeading}>Assigned To</p>

        {loggedInUserId == data?.created_by?._id || hasEditAccess ? (
          <Button
            className={styles.addAssigneeBtn}
            disabled={status === "DONE"}
            onClick={() => setUsersDrawerOpen(true)}
          >
            <Image
              src="/viewTaskIcons/plus-icon-green.svg"
              alt=""
              width={12}
              height={12}
            />
            Add
          </Button>
        ) : (
          ""
        )}
      </div>
      <ClickAwayListener
        onClickAway={() => {
          setViewPersonId("");
        }}
      >
        <div className={styles.allAssignysList}>
          {assignee?.length ? (
            assignee
              ?.slice(0, showAllAssignee ? assignee?.length : 6)
              .map((item: { _id: string; name: string }, index: number) => {
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      className={styles.noselect}
                      id={styles.persondetails}
                      key={index}
                    >
                      <Avatar
                        sx={{
                          fontSize: "9px",
                          width: "20px",
                          height: "20px",
                          background: "red",
                        }}
                      >
                        {item.name.split(" ")?.length > 1
                          ? `${item.name.split(" ")[0][0]}${
                              item.name.split(" ")[1][0]
                            }`.toUpperCase()
                          : item.name.slice(0, 2)?.toUpperCase()}
                      </Avatar>

                      <p
                        className={styles.assigneeName}
                        onClick={() => {
                          setViewPersonId(item._id);
                        }}
                      >
                        {viewPersonId == item._id
                          ? item.name
                          : item?.name.length > 15
                          ? item?.name.slice(0, 1).toUpperCase() +
                            item?.name.slice(1, 13) +
                            "..."
                          : item?.name.slice(0, 1).toUpperCase() +
                            item?.name.slice(1)}
                      </p>
                    </div>
                    {loggedInUserId == data?.created_by?._id ? (
                      <IconButton
                        sx={{ padding: "0" }}
                        disabled={status === "DONE"}
                        onClick={() => {
                          setAssigneeId(item._id);
                          deleteAssignee(item._id);
                        }}
                      >
                        {deleteLoading && assigneeId == item._id ? (
                          <CircularProgress
                            size="1rem"
                            sx={{ color: "black" }}
                          />
                        ) : (
                          <HighlightOffIcon sx={{ fontSize: "1.2rem" }} />
                        )}
                      </IconButton>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })
          ) : (
            <div
              style={{
                color: "#828282",
                fontFamily: "Inter",
                fontSize: "12px",
              }}
            >
              Not at assigned
            </div>
          )}
        </div>
      </ClickAwayListener>
      {assignee?.length > 6 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "1.5rem",
          }}
        >
          <div
            onClick={() => setShowAllAssignees((prev) => !prev)}
            style={{
              border: "2px solid #46a845",
              width: "7em",
              height: "1.7rem",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              borderRadius: "3rem",
              cursor: "pointer",
            }}
          >
            {showAllAssignee ? "Show Less" : "Show More"}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default AssignedToContainer;
