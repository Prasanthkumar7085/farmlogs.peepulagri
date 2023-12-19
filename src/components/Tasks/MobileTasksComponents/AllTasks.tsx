import { IconButton } from "@mui/material";
import { useRouter } from "next/router";


const AllTasks = () => {
    const router = useRouter();

    return (
        <div>
            <div className="addFormPositionIcon">
                <IconButton

                    onClick={() => {

                        router.push("/users-tasks/add");
                    }
                    }
                >
                    <img src="/mobileIcons/navTabs/Add Task.svg" alt="" width={"25px"} />
                    <span>Add Task</span>
                </IconButton>
            </div>
        </div>
    );
}
export default AllTasks;