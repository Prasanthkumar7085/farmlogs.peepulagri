import SignUp from "@/components/AuthModule/SignUp/SignUp";
import { GetServerSideProps } from "next";


const SignUpPage = () => {
    return (
        <div>
            <SignUp />
        </div>
    )
}

export default SignUpPage;








export const getServerSideProps: GetServerSideProps = async (context: any) => {


    const { req } = context;
    const { cookies } = req;


    if (cookies.loggedIn_v2 == "true") {
      let id = "log_id";

      return {
        redirect: {
          destination: `/farm/${id}/logs`,
          permanent: false,
        },
      };
    }
    return {
        props: {},
    };
};