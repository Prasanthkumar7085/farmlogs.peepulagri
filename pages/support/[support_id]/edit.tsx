import AddSupportHeader from "@/components/Support/Add/AddSupportHeader";
import EditSupportForm from "@/components/Support/Add/EditSupportForm";
import { GetServerSideProps } from "next";

const EditSupport = () => {
    return (
        <div>
            <AddSupportHeader />
            <EditSupportForm />
        </div>
    )
}


export default EditSupport;


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
