import type { NextPage } from "next";
import styles from "src/components/Tasks/MobileTasksComponents/assigned-by-container.module.css";
import { Avatar, Button, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from "react-redux";

const AssignedToContainer = ({ setUsersDrawerOpen, assignee, hasEditAccess, data, status }: any) => {

    const loggedInUserId = useSelector(
        (state: any) => state.auth.userDetails?.user_details?._id
    );

    return (
        <div className={styles.assignedbycontainer}>
            <label className={styles.assignedBy}>Assigned To</label>
            {loggedInUserId == data?.created_by?._id ||
                hasEditAccess ? (
                <Button
                    disabled={
                        status === "DONE" &&
                        !(loggedInUserId == data?.created_by?._id)
                    }
                    onClick={() => setUsersDrawerOpen(true)}
                >
                    {" "}
                    <img
                        src="/viewTaskIcons/plus-icon.svg"
                        alt=""
                        width="15px"
                        height="15px"
                    />{" "}
                    Add
                </Button>
            ) : (
                ""
            )}
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
