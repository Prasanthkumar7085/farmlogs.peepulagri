import type { NextPage } from "next";
import styles from "src/components/Tasks/MobileTasksComponents/assigned-by-container.module.css";
import { Avatar, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

const AssignedToContainer = ({ setUsersDrawerOpen, assignee }: any) => {
    console.log(assignee);

    return (
        <div className={styles.assignedbycontainer}>
            <label className={styles.assignedBy}>Assigned To</label>
            <IconButton
                onClick={() => setUsersDrawerOpen(true)}
            >
                <AddIcon />Add</IconButton>
            {assignee
                ? assignee.map(
                    (
                        item: { _id: string; name: string },
                        index: number
                    ) => {
                        console.log(item);

                        return (
                            <div className={styles.persondetails} key={index}>
                                <div className={styles.profile}>
                                    <h1 className={styles.jd}>
                                        <Avatar
                                            sx={{
                                                fontSize: "6px",
                                                width: "18px",
                                                height: "18px",
                                                background: 'red',
                                            }}
                                        >
                                            {item.name.split(" ")?.length > 1
                                                ? `${item.name.split(" ")[0][0]}${item.name.split(" ")[1][0]
                                                    }`.toUpperCase()
                                                : item.name.slice(0, 2)?.toUpperCase()}
                                        </Avatar>
                                    </h1>
                                </div>
                                <p className={styles.johnDukes}>
                                    {item?.name}
                                </p>

                            </div>
                        );
                    }
                )
                : "-"}

        </div>
    );
};

export default AssignedToContainer;
