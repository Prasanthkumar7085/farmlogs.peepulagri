import ViewFarmPage from "@/components/Scouting/Forms/view-farm";
import ViewHeader from "@/components/Scouting/Header/ViewHeader";
import { GetServerSideProps } from "next";

const FormView = () => {
    return (
        <div style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>
            {/* <ViewHeader name={'View Farm'} /> */}
            <ViewFarmPage />
        </div>
    );
}

export default FormView;


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
