import TimeLineComponent from "@/components/TimeLine/TimeLineComponent";
import { GetServerSideProps } from "next";


const TimeLinePage = () => {
    return (
        <div>
            <TimeLineComponent />
        </div>
    )
}


export default TimeLinePage;




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
