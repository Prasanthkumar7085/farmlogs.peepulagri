import { GetServerSideProps } from "next";
import styles from "./index.module.css";
import AllFarmsPage from "@/components/ScoutingWeb/farms/WebAllFarmsPage";

const FarmPage = () => {

    return (
        <div className={styles.dashboard}>
            <AllFarmsPage />
        </div>

    )
}

export default FarmPage;



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
