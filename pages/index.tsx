import SigninEmail from "@/components/AuthModule/EmailSignIn/loginForm";
import { GetServerSideProps } from "next";
const HomePage = () => {
  return (
    <div>
      <SigninEmail />
    </div>
  );
};

export default HomePage;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { req } = context;
  const { cookies } = req;

  if (cookies.loggedIn == "true") {
    if (cookies.userType == "USER") {
      return {
        redirect: {
          destination: `/farms`,
          permanent: false,
        },
      };
    } else {
      return {
        redirect: {
          destination: `/scouts`,
          permanent: false,
        },
      };
    }
  }
  return {
    props: {},
  };
};
