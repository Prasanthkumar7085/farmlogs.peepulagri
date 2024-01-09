import AllTasks from "@/components/Tasks/MobileTasksComponents/AllTasks";
import TaskCard from "@/components/Tasks/MobileTasksComponents/task-card";


const TaskPage = () => {

    return (
        <div style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>
            <AllTasks />
        </div>
    );
}
export default TaskPage;