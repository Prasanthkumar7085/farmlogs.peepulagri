import AllCropsComponent from "@/components/Scouting/Crops/AllCropsComponent"
import HeaderComponentAllCrops from "@/components/Scouting/Header/HeaderComponentAllCrops"
import { GetServerSideProps } from "next"

const AllCropsPage = () => {
    return (
        <div>
            <HeaderComponentAllCrops name={"My Crops"} />

            <AllCropsComponent />
        </div>
    )
}
export default AllCropsPage


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
