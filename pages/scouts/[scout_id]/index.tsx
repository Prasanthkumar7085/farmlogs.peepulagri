import SingleScoutView from "@/components/ScoutingWeb/CropScouts/SingleScoutView";
import { GetServerSideProps } from "next";

const ViewSingleScoutPage = () => {
  return (
    <div>
      <SingleScoutView />
    </div>
  );
};

export default ViewSingleScoutPage;
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
