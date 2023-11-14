import DashboardPage from "@/components/Scouting/Dashboad/DashboardPage";
import { GetServerSideProps } from "next";

const Dashboard = () => {
    return (
        <div id="mobileDashboard">
            <DashboardPage />
        </div>
    );
}

export default Dashboard;






// export const getServerSideProps: GetServerSideProps = async (context: any) => {


//     const { req } = context;
//     const { cookies } = req;

//     if (!(cookies.loggedIn == 'true')) {
//         return {
//             redirect: {
//                 destination: `/`,
//                 permanent: false,
//             },
//         };
//     } else if (cookies.userType == 'ADMIN') {
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
