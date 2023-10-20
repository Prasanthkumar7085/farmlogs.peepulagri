import ListScouts from "@/components/ScoutingWeb/ListScoutsComponents/ListScouts";
import { GetServerSideProps } from "next";

const ScoutsPage = () => {
  return (
    <div>
      <ListScouts />
    </div>
  );
};

export default ScoutsPage;
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
