import { GetLogsByFarmIdPropsType } from '../../../src/types/farmCardTypes';

const getLogsByFarmId = async ({ farmId, page, limit }: GetLogsByFarmIdPropsType) => {

    try {
        const response: any = await fetch(`http://localhost:3000/v1.0/farm/${farmId}/logs/${page}/${limit}`);
        const responseData = await response.json();
        if (response.ok) {
            return responseData;
        } else {
            return { message: 'Something Went Wrong', status: 500, details: responseData }
        }

    } catch (err: any) {
        console.error(err);

    }
}
export default getLogsByFarmId;