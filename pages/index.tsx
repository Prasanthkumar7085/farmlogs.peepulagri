import { GetServerSideProps } from 'next';
import Login from '@/components/AuthModule/Login';
import SignUp from '@/components/AuthModule/SignUp/SignUp';
import { Button } from '@mui/material';
import { useState } from 'react';

const HomePage = () => {

    const [loginMethod, setLoginMethod] = useState(false);

    return (
        <div>
            <Button onClick={() => setLoginMethod((prevState) => !prevState)}>
                {!loginMethod ? 'Login With Otp' : "Login with Password"}
            </Button>
            {!loginMethod ?
                <Login /> :
                <SignUp />}

        </div>
    )
}

export default HomePage;

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
