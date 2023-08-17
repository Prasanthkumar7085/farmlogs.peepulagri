import { GetServerSideProps } from 'next';


const HomePage = () => {
    return (
        <div>
            HI
        </div>
    )
}

export default HomePage;

export const getServerSideProps: GetServerSideProps = async (context: any) => {


    return {
        redirect: {
            destination: "/farm/1/logs",
            permanent: false,
        },
    };

    return {
        props: {},
    };
};
