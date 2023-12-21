import TimeLineComponent from "@/components/TimeLine/TimeLineComponent";
import { GetServerSideProps } from "next";
import styles from './timeline.module.css';

const TimeLinePage = () => {
    return (
        <div className={styles.timeLineContainer}>
            <TimeLineComponent />
        </div>
    )
}

export default TimeLinePage;




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
