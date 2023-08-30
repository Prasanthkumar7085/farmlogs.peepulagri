import FarmsEditLogs from "@/components/AddLogs/EditLogs/EditLogs";
import { GetServerSideProps } from "next";


const EditLogsPage = () => {
    return (
        <FarmsEditLogs />
    )
}


export default EditLogsPage;




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
