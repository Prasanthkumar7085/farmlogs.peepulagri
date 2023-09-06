import AddSupportPage from "@/components/Support/Add/AddSupportPage";
import { GetServerSideProps } from "next";

const AddSupport = () => {
    return (
        <div>
            <AddSupportPage />
        </div>
    )
}


export default AddSupport;







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
