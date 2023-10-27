import { GetServerSideProps } from 'next';
import SignUp from '@/components/AuthModule/SignUp/SignUp';
import MobileLogin from '@/components/MobileComponents/MobileLogin/login';
import SigninEmail from '@/components/AuthModule/EmailSignIn/loginForm';
const HomePage = () => {

    return (
        <div>
                <SigninEmail />
            

        </div>
    )
}

export default HomePage;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    const { req } = context;
    const { cookies } = req;

    if (cookies.loggedIn == 'true') {
        return {
            redirect: {
                destination: `/farm`,
                permanent: false,
            },
        };
    }
    return {
        props: {},
    };
};
