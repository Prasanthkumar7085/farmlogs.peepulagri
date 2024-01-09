import FileUploadComponent from "@/components/Scouting/AddItem/FileUpload";
import { GetServerSideProps } from "next";

const FileUploadPage = () => {
    return (
        <div style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>

            <FileUploadComponent />
        </div>
    )
}
export default FileUploadPage

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
