import FileUploadComponent from "@/components/Scouting/AddItem/FileUpload";
import { GetServerSideProps } from "next";

const FileUploadPage = () => {
    return (
        <FileUploadComponent />
    )
}
export default FileUploadPage

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
            destination: `/scouts`,
            permanent: false,
          },
        };
    }
    return {
        props: {},
    };
};
