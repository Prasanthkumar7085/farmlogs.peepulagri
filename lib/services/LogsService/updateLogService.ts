import { useRouter } from "next/router";

const updateLogService = async (body: any, logId: string) => {

    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/log/${logId}`;
        const options = {
            method: "PATCH",
            body: JSON.stringify(body),
            headers: new Headers({
                'content-type': 'application/json'
            })
        }
        const response: any = await fetch(url, options);
        const responseData = await response.json();
        return responseData;

    } catch (err: any) {
        console.error(err);

    }
}
export default updateLogService;