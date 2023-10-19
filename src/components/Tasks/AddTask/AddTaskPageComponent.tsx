import TaskForm from "./TaskForm";
import styles from "./TaskForm.module.css";

const AddTaskPageComponent = () => {
    return (
        <div className={styles.addTaskPage}>
            <TaskForm />
        </div>
    )
}

export default AddTaskPageComponent;