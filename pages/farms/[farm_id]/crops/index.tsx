import AllCropsComponent from "@/components/Scouting/Crops/AllCropsComponent"
import HeaderComponentAllCrops from "@/components/Scouting/Header/HeaderComponentAllCrops"
import { GetServerSideProps } from "next"

const AllCropsPage = () => {
    return (
        <div style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>
            {/* <HeaderComponentAllCrops name={"My Crops"} /> */}
            <AllCropsComponent />
        </div>
    )
}
export default AllCropsPage


// export const getServerSideProps: GetServerSideProps = async (context: any) => {


//     const { req } = context;
//     const { cookies } = req;

//     if (!(cookies.loggedIn_v2 == 'true')) {
//         return {
//             redirect: {
//                 destination: `/`,
//                 permanent: false,
//             },
//         };
//     } else if (cookies.userType_v2 == 'ADMIN') {
//         return {
//           redirect: {
//             destination: `/scouts`,
//             permanent: false,
//           },
//         };
//     }
//     return {
//         props: {},
//     };
// };
