
const getAllFarmsService = async () => {

    try {
        let response: any = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farm/1/10`);
        const responseData = await response.json();
        return responseData;


    } catch (err: any) {
        console.error(err);

    }
}


export default getAllFarmsService;