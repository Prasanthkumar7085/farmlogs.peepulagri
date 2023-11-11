import { GetServerSideProps } from "next";
import styles from "./../index.module.css";
import ViewFarmPage from "@/components/Scouting/Forms/view-farm";
import CardDetails from "@/components/ScoutingWeb/farms/CardDetails";

const FarmPage = () => {

    return (
        <div className={styles.dashboard}>
            {/* <ViewFarmPage/> */}
            <CardDetails/>
        </div>

    )
}

export default FarmPage;



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