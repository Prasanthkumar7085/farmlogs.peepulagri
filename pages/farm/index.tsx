import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getAllFarmsService from "../../lib/services/FarmsService/getAllFarmsService";
import ImageComponent from "@/components/Core/ImageComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { useDispatch } from 'react-redux';
import { setAllFarms } from "@/Redux/Modules/Farms";
import { Typography, Button } from "@mui/material";
import styles from "./index.module.css";
import AddIcon from '@mui/icons-material/Add';
import AllFarmsPage from "@/components/ScoutingWeb/farms/WebAllFarmsPage";

const FarmPage = () => {

    const router = useRouter();
    const dispatch = useDispatch();

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

    const [loading, setLoading] = useState(false);

    const getAllFarms = async () => {
        setLoading(true)
        const response = await getAllFarmsService(accessToken);
        if (response.success && response.data && response.data.length) {
            dispatch(setAllFarms(response?.data))
            router.push(`/farm/${response?.data[0]._id}/logs`);
        } else {
            setLoading(false);
        }

    }
    useEffect(() => {
        if (router.isReady && accessToken) {
            getAllFarms();
        }
    }, [accessToken, router.isReady]);
    return (
        <div className={styles.dashboard}>
            <AllFarmsPage />
            {/* {!loading ?
                <div className={styles.noDataScreen}>
                    <ImageComponent
                        src={'../no-logs.svg'}
                        height={300}
                        width={300}
                    />
                    <div className={styles.content}>
                        <Typography className={styles.subTitle} variant="h4">
                            No Farms Found!
                        </Typography>
                        <Typography className={styles.description}>
                            {"Looks like you havn't added any Farm yet."} <br />
                            {"Add Farms to Get Started"}
                        </Typography>
                    </div>
                    <Button className={styles.ctaButton} variant="contained" color="success" size="large" startIcon={<AddIcon />}> Add Farms </Button>
                </div>
                : ""} */}
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
    } else if (cookies.userType == 'ADMIN') {
        return {
            redirect: {
                destination: `/support`,
                permanent: false,
            },
        };
    }
    return {
        props: {},
    };
};
