import FarmsaddLogs from "@/components/AddLogs/index";
import { GetServerSideProps } from "next";


const AddLogsPage = () => {
    return (
        <FarmsaddLogs />
        // <ViewLogsContainer />

    )
}


export default AddLogsPage;




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
    } else if (cookies.userType == 'ADMIN') {
        return {
            redirect: {
                destination: `/support`,
                permanent: false,
            },
        };
    }
    return {
        props: {},
    };
};
