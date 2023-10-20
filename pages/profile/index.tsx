import ProfilePage from "@/components/Profile/ProfilePage";
import { GetServerSideProps } from "next";

const Profile = () => {
  return (
    <div>
      <ProfilePage />
    </div>
  );
};

export default Profile;

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
