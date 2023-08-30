import DashBoard from "@/components/DashBoard/DashBorad";
import { GetServerSideProps } from "next";


const Logs = () => {

    return (
        <DashBoard />
    )
}

export default Logs;




export const getServerSideProps: GetServerSideProps = async (context: any) => {

    const { req } = context;
    const { cookies } = req;

    console.log(context);
    console.log(req);
    console.log(cookies);


    return {
        props: {},
    };
};
