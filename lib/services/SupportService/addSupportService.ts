
const addSupportService = async (body: any, accessToken: string) => {

    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/support`;
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
        if (response.ok) {
            return responseData;
        } else {
            return { message: 'Something Went Wrong', status: 500, details: responseData }
        }

    } catch (err: any) {
        console.error(err);

    }
}
export default addSupportService;