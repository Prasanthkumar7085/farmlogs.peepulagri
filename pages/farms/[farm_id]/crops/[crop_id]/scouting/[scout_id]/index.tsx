
import ViewScoutHeader from "@/components/Scouting/Header/ViewScoutHeader";
import ViewScoutThreads from "@/components/Scouting/ViewScouting/view-scout-threads";
import { GetServerSideProps } from "next";

const SingleScoutViewPage = () => {
    return (
        <div>
            <ViewScoutHeader name={'View'} />
            <ViewScoutThreads/>
       </div>
    )
}
export default SingleScoutViewPage;





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
