import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getAllFarmsService from "../../lib/services/FarmsService/getAllFarmsService";
import ImageComponent from "@/components/Core/ImageComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";


const FarmPage = () => {

    const router = useRouter();
    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

    const [loading, setLoading] = useState(true);

    const getAllFarms = async () => {
        setLoading(true)
        const response = await getAllFarmsService(accessToken);
        if (response.success && response.data && response.data.length) {
            router.replace(`/farm/${response?.data[0]._id}/logs`);
        }
        setLoading(false);
    }
    useEffect(() => {
        if (router.isReady && accessToken) {
            getAllFarms();
        }
    }, [accessToken, router.isReady]);
    return (
        <div>
            {!loading ? <div style={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <ImageComponent
                    src={'/no-data.svg'}
                    height={600}
                    width={600}
                />
                <h1 style={{ color: "#48855d" }}>
                    No Farms Data
                </h1>
            </div> : ""}
            <LoadingComponent loading={loading} />
        </div>

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
