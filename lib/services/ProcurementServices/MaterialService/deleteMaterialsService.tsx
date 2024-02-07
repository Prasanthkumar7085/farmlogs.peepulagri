const deleteMaterialsService = async ({ accessToken, materials_ids, }: { accessToken: string, materials_ids: any }) => {

    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/procurement-requests/delete/materials/all`;

        const options = {
            method: "DELETE",
            body: JSON.stringify({
                "material_ids": materials_ids
            }),
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
export default deleteMaterialsService;