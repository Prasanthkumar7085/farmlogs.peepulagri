import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import getAllFarmsService from "../../lib/services/FarmsService/getAllFarmsService";


const FarmPage = () => {

    const router = useRouter();
    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);


    const getAllFarms = async () => {
        const response = await getAllFarmsService(accessToken);
        if (response.success) {
            router.push(`/farm/${response?.data[0]._id}/logs`)

        }
    }
    useEffect(() => {
        if (router.isReady && accessToken) {
            getAllFarms();
        }
    }, [accessToken, router.isReady]);
    return (
        <div></div>

    )
}

export default FarmPage;



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
    }
    return {
        props: {},
    };
};
