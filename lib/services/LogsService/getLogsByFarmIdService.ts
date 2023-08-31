import { GetLogsByFarmIdPropsType, QueryParamForFarmLogs } from '../../../src/types/farmCardTypes';
import { prepareURLEncodedParams } from '../../requestUtils/urlEncoder';

const getLogsByFarmIdService = async ({ farmId, page, limit, paramString = '' }: Partial<GetLogsByFarmIdPropsType>) => {

    const url = `${process.env.NEXT_PUBLIC_API_URL}/farm/${farmId}/logs/${page}/${limit}${paramString}`

    try {
        const response: any = await fetch(url);
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
export default getLogsByFarmIdService;