import SingleViewScoutComponent from "@/components/Scouting/Crops/SingleView";
import Header1 from "@/components/Scouting/Header/HeaderComponent";
import { Button } from "@mui/material";
import { GetServerSideProps } from "next";

const SingleScoutViewPage = () => {

  return (
    <div>
      {/* <Header1 name={"Scouting"} /> */}
      <SingleViewScoutComponent />
    </div>
  )
}
export default SingleScoutViewPage;




// export const getServerSideProps: GetServerSideProps = async (context: any) => {
//   const { req } = context;
//   const { cookies } = req;

//   if (!(cookies.loggedIn == "true")) {
//     return {
//       redirect: {
//         destination: `/`,
//         permanent: false,
//       },
//     };
//   } else if (cookies.userType == "ADMIN") {
//     return {
//       redirect: {
//         destination: `/scouts`,
//         permanent: false,
//       },
//     };
//   }
//   return {
//     props: {},
//   };
// };
