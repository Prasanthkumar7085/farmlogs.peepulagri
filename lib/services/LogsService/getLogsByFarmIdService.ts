import { GetLogsByFarmIdPropsType, QueryParamForFarmLogs } from '../../../src/types/farmCardTypes';
import { prepareURLEncodedParams } from '../../requestUtils/urlEncoder';

const getLogsByFarmIdService = async ({ farmId, page, limit, search = '' }: GetLogsByFarmIdPropsType) => {

    const url = `http://localhost:3000/v1.0/farm/${farmId}/logs/${page}/${limit}`
    let queryParams: Partial<QueryParamForFarmLogs> = {};
    if (search) {
        queryParams['search_string'] = search;
    }
    let encodedUrl = prepareURLEncodedParams(url, queryParams);
    try {
        const response: any = await fetch(encodedUrl);
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