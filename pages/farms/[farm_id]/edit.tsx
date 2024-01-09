import AddFarmForm from "@/components/Scouting/Forms/AddForm";
import Header1 from "@/components/Scouting/Header/HeaderComponent";
import { GetServerSideProps } from "next";

const AddFormPage = () => {
    return (
        <div style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>
            <AddFarmForm />
        </div>
    )
}
export default AddFormPage;


export const getServerSideProps: GetServerSideProps = async (context: any) => {


    const { req } = context;
    const { cookies } = req;

    if (!(cookies.loggedIn_v2 == "true")) {
      return {
        redirect: {
          destination: `/`,
          permanent: false,
        },
      };
    } else if (cookies.userType_v2 == "ADMIN") {
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
