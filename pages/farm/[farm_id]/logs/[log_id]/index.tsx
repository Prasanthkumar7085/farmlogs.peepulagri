import ViewLogsContainer from "@/components/view-logs-container";
import { GetServerSideProps } from "next";


const AddLogsPage = () => {
    return (
        <ViewLogsContainer />

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
            destination: `/scouts`,
            permanent: false,
          },
        };
    }
    return {
        props: {},
    };
};
