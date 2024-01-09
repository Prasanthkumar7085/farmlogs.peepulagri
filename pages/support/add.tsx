import AddSupportPage from "@/components/Support/Add/AddSupportPage";
import { GetServerSideProps } from "next";

const AddSupport = () => {
    return (
        <div>
            <AddSupportPage />
        </div>
    )
}


export default AddSupport;


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
