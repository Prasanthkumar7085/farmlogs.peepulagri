import SignUpVerify from "@/components/AuthModule/SignUp/SignUpVerify";
import MobileOtpScreen from "@/components/MobileComponents/MobileLogin/otp-screen";
import { GetServerSideProps } from "next";

const SignUpVerifyPage = () => {
    return (
        <div >
            <div id="webOtpVerify">
                <SignUpVerify />
            </div>
            <div id="mobileOtpVerify">
                <MobileOtpScreen />
            </div>
        </div>
    )
}

export default SignUpVerifyPage;







export const getServerSideProps: GetServerSideProps = async (context: any) => {


    const { req } = context;
    const { cookies } = req;


    if (cookies.loggedIn == 'true') {
        let id = 'log_id';
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