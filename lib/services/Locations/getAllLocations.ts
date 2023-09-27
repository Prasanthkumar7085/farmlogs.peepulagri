
const getAllLocationsService = async (token: string) => {

    try {
        let options = {
            method: "GET",
            headers: new Headers({
                'authorization': token
            })
        }
        let response: any = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farm/unique-locations`, options);
        const responseData = await response.json();
        return responseData;


    } catch (err: any) {
        console.error(err);

    }
}


export default getAllLocationsService;