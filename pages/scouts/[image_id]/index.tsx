import SingleScoutViewDetails from "@/components/ScoutingWeb/Scouting/ViewScouting";
import { GetServerSideProps } from "next";

const ViewSingleScoutsPage = () => {
    return (
        <div>
            <SingleScoutViewDetails />
        </div>
    );
};

export default ViewSingleScoutsPage;
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
