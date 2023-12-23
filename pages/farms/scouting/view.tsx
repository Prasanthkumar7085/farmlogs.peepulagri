import SingleScoutingView from "@/components/Scouting/AllScouting/viewScouting";
import ViewHeader from "@/components/Scouting/Header/ViewHeader";
import { GetServerSideProps } from "next";

const ViewScouting = () => {
    return (
        <div>
            <ViewHeader name={'View'} />
            <SingleScoutingView />
        </div>
    );
}

export default ViewScouting;


// export const getServerSideProps: GetServerSideProps = async (context: any) => {


//     const { req } = context;
//     const { cookies } = req;

//     if (!(cookies.loggedIn_v2 == "true")) {
//       return {
//         redirect: {
//           destination: `/`,
//           permanent: false,
//         },
//       };
//     } else if (cookies.userType_v2 == "ADMIN") {
//       return {
//         redirect: {
//           destination: `/scouts`,
//           permanent: false,
//         },
//       };
//     }
//     return {
//         props: {},
//     };
// };
