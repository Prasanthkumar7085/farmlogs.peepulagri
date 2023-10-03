const updateDescriptionService = async (scoutId: string, token: string, description: any) => {

    try {
        let options = {
            method: "PATCH",
            headers: new Headers({
                'content-type': 'application/json',
                'authorization': token
            }),
            body: JSON.stringify({
                "description": description
            })
        }
        let response: any = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouts/${scoutId}`, options);
        const responseData = await response.json();
        return responseData;

    } catch (err: any) {
        console.error(err);

    }
}


export default updateDescriptionService;