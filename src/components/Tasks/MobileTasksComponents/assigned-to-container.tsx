import { Avatar, Button } from "@mui/material";
import Image from "next/image";
import { useSelector } from "react-redux";
import styles from "src/components/Tasks/MobileTasksComponents/assigned-by-container.module.css";

const AssignedToContainer = ({
  setUsersDrawerOpen,
  assignee,
  hasEditAccess,
  data,
  status,
}: any) => {
  const loggedInUserId = useSelector(
    (state: any) => state.auth.userDetails?.user_details?._id
  );

  return (
    <div className={styles.assignedTocontainer}>
      <div className={styles.assignToHeader}>
        <p className={styles.assignedToHeading}>Assigned To</p>
        {loggedInUserId == data?.created_by?._id || hasEditAccess ? (
          <Button
            className={styles.addAssigneeBtn}
            disabled={
              status === "DONE" && !(loggedInUserId == data?.created_by?._id)
            }
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
      <div className={styles.allAssignysList}>
        {assignee
          ? assignee.map(
              (item: { _id: string; name: string }, index: number) => {
                return (
                  <div className={styles.persondetails} key={index}>
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
                    <p className={styles.assigneeName}>{item?.name}</p>
                  </div>
                );
              }
            )
          : "-"}
      </div>
    </div>
  );
};

export default AssignedToContainer;
