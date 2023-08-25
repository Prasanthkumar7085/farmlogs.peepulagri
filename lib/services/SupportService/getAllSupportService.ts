import { SupportServiceTypes } from "@/types/supportTypes";
import { prepareURLEncodedParams } from "../../requestUtils/urlEncoder";

const getAllSupportService = async ({ page, limit, searchString, status }: SupportServiceTypes) => {

    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/support/${page}/${limit}`;
        let queryParams: any = {};
        if (searchString) {
            queryParams['search_string'] = searchString;
        }
        if (status) {
            queryParams['status'] = status
        }

        const encodedUrl = prepareURLEncodedParams(url, queryParams);
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
export default getAllSupportService;