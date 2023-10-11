import ResetPasswordPage from "@/components/AuthModule/EmailSignIn/Reset-password";
import { GetServerSideProps } from "next";

const VerifyOTP = () => {
    return (
        <div>
            <ResetPasswordPage />
        </div>
    );
}

export default VerifyOTP;


export const getServerSideProps: GetServerSideProps = async (context: any) => {
    const { query } = context;

    if (query.isVerify !== 'true') {
        return {
            redirect: {
                destination: `/forgot-password`,
                permanent: false,
            },
        };
    }
    return {
        props: {},
    };
};
