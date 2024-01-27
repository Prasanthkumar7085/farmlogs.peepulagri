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
  const { headers, cookies } = req;

  const userAgent = headers['user-agent'];

  if (!(cookies.loggedIn_v2 == "true")) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  } else if (cookies.userType_v2 == "agronomist" || cookies.userType_v2 == "admin") {
    return {
      redirect: {
        destination: `/scouts`,
        permanent: false,
      },
    };
  } else if (userAgent.includes("Mobile")) {
    return {
      redirect: {
        destination: `/dashboard`,
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

  return {
    props: {},
  };
};
