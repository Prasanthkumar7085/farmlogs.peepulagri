import ProfilePage from "@/components/Profile/ProfilePage";
import { GetServerSideProps } from "next";

const Profile = () => {
  return (
    <div style={{ paddingTop: "4.5rem" }}>
      <ProfilePage />
    </div>
  );
};

export default Profile;

// export const getServerSideProps: GetServerSideProps = async (context: any) => {
//   const { req } = context;
//   const { cookies } = req;

//   if (!(cookies.loggedIn_v2 == "true")) {
//     return {
//       redirect: {
//         destination: `/`,
//         permanent: false,
//       },
//     };
//   }
//   return {
//     props: {},
//   };
// };
