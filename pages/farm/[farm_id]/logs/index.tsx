import DashBoard from "@/components/DashBoard/DashBorad";
import { GetServerSideProps } from "next";


const Logs = () => {

    return (
        <DashBoard />
    )
}

export default Logs;



export const getServerSideProps: GetServerSideProps = async (context: any) => {


    const { req } = context;
    const { cookies } = req;

    if (!(cookies.loggedIn == 'true')) {
        return {
            redirect: {
                destination: `/`,
                permanent: false,
            },
        };
    }
    return {
        props: {},
    };
};
