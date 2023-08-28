import { GetServerSideProps } from 'next';
import getAllFarmsService from '../lib/services/getAllFarmsService';

const HomePage = () => {
    return (
        <div>
            HI
        </div>
    )
}

export default HomePage;

export const getServerSideProps: GetServerSideProps = async (context: any) => {

    let response = await getAllFarmsService();
    const id = response.data[0]._id;

    return {
        redirect: {
            destination: `/farm/${id}/logs`,
            permanent: false,
        },
    };

    return {
        props: {},
    };
};
