

const getSupportByIdService = async (supportId: string) => {

    const url = `${process.env.NEXT_PUBLIC_API_URL}/support/${supportId}`

    try {
        const response: any = await fetch(url);
        const responseData = await response.json();
        return responseData;


    } catch (err: any) {
        console.error(err);

    }
}
export default getSupportByIdService;