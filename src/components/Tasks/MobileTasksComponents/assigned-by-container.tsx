import type { NextPage } from "next";
import styles from "./assigned-by-container.module.css";
import { Avatar } from "@mui/material";

const AssignedByContainer = ({ assignedBy }: any) => {
  return (
    <div className={styles.assignedbycontainer}>
      <p className={styles.assignedBy}>Created by</p>
      <div className={styles.persondetails}>
        <Avatar
          sx={{
            fontSize: "9px",
            width: "20px",
            height: "20px",
            background: "#45a845",
          }}
        >
          {assignedBy.split(" ")?.length > 1
            ? `${assignedBy.split(" ")[0][0]}${assignedBy.split(" ")[1][0]
              }`.toUpperCase()
            : assignedBy.slice(0, 2)?.toUpperCase()}
        </Avatar>
        <p className={styles.assignedByName}>{assignedBy}</p>
      </div>
    </div>
  );
};

export default AssignedByContainer;
