const updateMaterialStatusService = async ({ accessToken, material_id, status }: { accessToken: string, material_id: string, status: string }) => {

    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/procurement-requests/materials/${material_id}/${status}`;

        const options = {
            method: "PATCH",
            headers: new Headers({
                'content-type': 'application/json',
                'authorization': accessToken
            }),
        }
        const response: any = await fetch(url, options);
        const responseData = await response.json();
        if (response.ok) {
            return responseData;
        } else {
            return { message: 'Something Went Wrong', status: 500, details: responseData }
        }

    } catch (err: any) {
        console.error(err);
        return
    }
}
export default updateMaterialStatusService;