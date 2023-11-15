
const getFarmByIdService = async (farmId: string, accessToken: string) => {

    const url = `${process.env.NEXT_PUBLIC_API_URL}/farms/${farmId}`
    let options = {
        method: "GET",
        headers: new Headers({
            'authorization': accessToken
        })
    }
    try {
        const response: any = await fetch(url, options);
        const responseData = await response.json();
        return responseData;

    } catch (err: any) {
        console.error(err);

    }
}
export default getFarmByIdService;