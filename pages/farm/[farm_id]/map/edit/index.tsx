import GoogleMapEditComponent from "@/components/Scouting/Forms/GoogleMapsPolygon/GoogleMapEditComponent";

const EditMapsPage = () => {
  return <GoogleMapEditComponent />;
};
export default EditMapsPage;

// export const getServerSideProps: GetServerSideProps = async (context: any) => {

//     const { req } = context;
//     const { cookies } = req;

//     if (!(cookies.loggedIn_v2 == "true")) {
//         return {
//             redirect: {
//                 destination: `/`,
//                 permanent: false,
//             },
//         };
//     } else if (cookies.userType_v2 == "ADMIN") {
//         return {
//             redirect: {
//                 destination: `/scouts`,
//                 permanent: false,
//             },
//         };
//     }
//     return {
//         props: {},
//     };
// };
