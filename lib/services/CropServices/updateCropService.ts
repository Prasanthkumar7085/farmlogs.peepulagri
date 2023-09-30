const updateCropService =async (farmId:string,cropId:string,body:any,accessToken:string) => {
    let options = {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: new Headers({
            'content-type': 'application/json',
            'authorization': accessToken
        })
    }
    try {
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farm/${farmId}/crops/${cropId}`, options)
        let responseData = await response.json()
        return responseData
    }
    catch (err) {
        console.log(err)
    }
}

export default updateCropService;