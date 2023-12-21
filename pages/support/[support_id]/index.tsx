import ViewSupportPage from "@/components/Support/Add/View/ViewSupportPage";
import { GetServerSideProps } from "next";

const ViewSupport = () => {
    return (
        <div>
            <ViewSupportPage />
        </div>
    )
}


export default ViewSupport;





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
    }
    return {
        props: {},
    };
};
