import type { NextPage } from "next";
import styles from "./assigned-by-container.module.css";
import { Avatar } from "@mui/material";

const AssignedByContainer = ({ assignedBy }: any) => {
  return (
    <div className={styles.assignedbycontainer}>
      <label className={styles.assignedBy}>Created by</label>
      <div className={styles.persondetails}>
        <div className={styles.profile}>
          <h1 className={styles.jd}>
            <Avatar
              sx={{
                fontSize: "6px",
                width: "18px",
                height: "18px",
                background: "#45a845",
              }}
            >
              {assignedBy.split(" ")?.length > 1
                ? `${assignedBy.split(" ")[0][0]}${assignedBy.split(" ")[1][0]
                  }`.toUpperCase()
                : assignedBy.slice(0, 2)?.toUpperCase()}
            </Avatar>
          </h1>
        </div>
        <p className={styles.johnDukes}>{assignedBy}</p>
      </div>
    </div>
  );
};

export default AssignedByContainer;
