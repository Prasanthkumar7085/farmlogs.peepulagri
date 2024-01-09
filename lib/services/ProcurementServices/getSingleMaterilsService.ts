const getSingleMaterilsService = async ({ procurementId, token }: any) => {


    try {
        let url: any = ""
        if (procurementId) {
            url = `${process.env.NEXT_PUBLIC_API_URL}/procurement-requests/materials/view/${procurementId}`;
        }

        const options = {
            method: "GET",
            headers: new Headers({
                'authorization': token
            })
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
export default getSingleMaterilsService;