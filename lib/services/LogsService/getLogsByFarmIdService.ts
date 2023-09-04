import { GetLogsByFarmIdPropsType } from '../../../src/types/farmCardTypes';

const getLogsByFarmIdService = async ({ farmId, page, limit, paramString = '' }: Partial<GetLogsByFarmIdPropsType>) => {

    const url = `${process.env.NEXT_PUBLIC_API_URL}/farm/${farmId}/logs/${page}/${limit}${paramString}`
    let options = {
        method: "GET",
    }
    try {
        const response: any = await fetch(url, options);
        const responseData = await response.json();
        return responseData;

    } catch (err: any) {
        console.error(err);

    }
}
export default getLogsByFarmIdService;