
const postAMessageInSupportService = async (supportId: string, body: any, accessToken: string) => {

    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/support/${supportId}/conversation-message`;



        const options = {
            method: "POST",
            body: JSON.stringify(body),
            headers: new Headers({
                'content-type': 'application/json',
                'authorization': accessToken
            })
        }
        const response: any = await fetch(url, options);
        const responseData = await response.json();
        return responseData;


    } catch (err: any) {
        console.error(err);

    }
}
export default postAMessageInSupportService;