import DashboardStats from "@/components/DashBoard/MobileDashBoard/DashboardStats";
import { GetServerSideProps } from "next";

const DashBoardPage = () => {
  return <DashboardStats />;
};
export default DashBoardPage;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { req } = context;
  const { cookies } = req;

  if (!(cookies.loggedIn_v2 == "true")) {
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
