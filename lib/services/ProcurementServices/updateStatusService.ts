const updateStatusService = async ({ accessToken, procurement_id, status }: { accessToken: string, procurement_id: string, status: string }) => {

    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/procurement-requests/${procurement_id}/status`;

        const options = {
            method: "PATCH",
            headers: new Headers({
                'content-type': 'application/json',
                'authorization': accessToken
            }),
            body: JSON.stringify({
                status: status
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
export default updateStatusService;