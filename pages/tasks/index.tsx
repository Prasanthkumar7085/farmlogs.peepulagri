import TasksPageComponent from "@/components/Tasks/AllTasks/TasksPageComponent";
import { GetServerSideProps } from "next";

export const TasksPage = () => {
  return (
    <div>
      <TasksPageComponent />
    </div>
  );
};

export default TasksPage;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { req } = context;
  const { cookies } = req;

  if (!(cookies.loggedIn == "true")) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  } else if (cookies.userType == "ADMIN") {
    return {
      redirect: {
        destination: `/scouts`,
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
