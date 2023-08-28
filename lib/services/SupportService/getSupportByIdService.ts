import { GetLogsByFarmIdPropsType, QueryParamForFarmLogs } from '../../../src/types/farmCardTypes';
import { prepareURLEncodedParams } from '../../requestUtils/urlEncoder';

const getSupportByIdService = async (logId: string) => {

    const url = `${process.env.NEXT_PUBLIC_API_URL}/support/${logId}`

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
export default getSupportByIdService;