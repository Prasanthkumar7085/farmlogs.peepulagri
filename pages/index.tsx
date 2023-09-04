import { GetServerSideProps } from 'next';
import SignUp from '@/components/AuthModule/SignUp/SignUp';

const HomePage = () => {



    return (
        <div>
            {/* <Login /> */}
            <SignUp />

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
