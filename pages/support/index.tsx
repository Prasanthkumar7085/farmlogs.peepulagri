import SupportPage from "@/components/Support/Support";
import { GetServerSideProps } from "next";

const Support = () => {
    return (
        <div>
            <SupportPage />
        </div>
    )
}
export default Support;

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
//     }
//     return {
//         props: {},
//     };
// };
