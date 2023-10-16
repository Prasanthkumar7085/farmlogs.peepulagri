const updateDescriptionService = async (scoutId: string, token: string, data: any, attachements: any, description: any) => {

    try {
        let options = {
            method: "PATCH",
            headers: new Headers({
                'content-type': 'application/json',
                'authorization': token
            }),
            body: JSON.stringify({
                "farm_id": data.farm_id._id,
                "findings": description,
                "crop_id": data.crop_id,
                "attachments": [...attachements, ...data.attachments]
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