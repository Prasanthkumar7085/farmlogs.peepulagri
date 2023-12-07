import { GetServerSideProps } from "next";
import SigninEmail from "@/components/AuthModule/EmailSignIn/loginForm";

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
    if (cookies.userType == "farmer") {
      return {
        redirect: {
          destination: `/dashboard`,
          permanent: false,
        },
      };
    }
    return {
      redirect: {
        destination: `/dashboard`,
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
