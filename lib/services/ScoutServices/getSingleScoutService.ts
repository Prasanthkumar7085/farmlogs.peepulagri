const getSingleImageDetailsService = async (image_id: any, token: string) => {
    console.log("pobhj")
    try {
        let options = {
            method: "GET",
            headers: new Headers({
                'authorization': token
            })
        }
        let response: any = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farm-images/${image_id}`, options);
        const responseData = await response.json();
        return responseData;

    } catch (err: any) {
        console.error(err);

    }
}


export default getSingleImageDetailsService;