
const getFarmByIdService = async (farmId: string) => {

    const url = `${process.env.NEXT_PUBLIC_API_URL}/farm/${farmId}`
    let options = {
        method: "GET"
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