import TaskViewComponent from "@/components/Tasks/AllTasks/TaskViewNew/TaskViewComponent";
import ViewTaskComponent from "@/components/Tasks/ViewTask/ViewTaskComponent";
import { GetServerSideProps } from "next";

const ViewTask = () => {
  return (
    <div>
      {/* <ViewTaskComponent /> */}
      <TaskViewComponent />
    </div>
  );
};

export default ViewTask;
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
  }
  return {
    props: {},
  };
};
