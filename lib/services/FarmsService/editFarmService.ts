
const editFarmService = async (body: any,token:string) => {

    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/farm`;
        const options = {
            method: "POST",
            body: JSON.stringify(body),
            headers: new Headers({
                'content-type': 'application/json',
                'authorization': token
            })
        }
        const response: any = await fetch(url, options);
        const responseData = await response.json();
        return responseData;

    } catch (err: any) {
        console.error(err);

    }
}
export default editFarmService;