import AddFarmForm from "@/components/Scouting/Forms/AddForm";
import Header1 from "@/components/Scouting/Header/HeaderComponent";
import { GetServerSideProps } from "next";

const AddFormPage = () => {
    return (
        <>
            <Header1 name={'Add Farm'} />
            <AddFarmForm />
        </>
    )
}
export default AddFormPage;


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
