const getAllScoutsService = async(farmId:string,cropId:string,accessToken:string) => {
    let options = {
        method: "GET",

        headers: new Headers({
            'content-type': 'application/json',
            'authorization': accessToken
        })
    }
    try {
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farm/${farmId}/scouts/1/100?crop_id=${cropId}`, options)
        let responseData = await response.json()
        return responseData;
        
    }
    catch (err) {
        console.error(err)
    }
}

export default getAllScoutsService;