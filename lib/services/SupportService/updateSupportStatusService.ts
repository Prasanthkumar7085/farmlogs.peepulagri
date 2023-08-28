
const updateSupportStatusService = async (body: { status: string }, id: string) => {

    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/support/update-status/${id}`;
        const options = {
            method: "PATCH",
            body: JSON.stringify(body),
            headers: new Headers({
                'content-type': 'application/json'
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

    }
}
export default updateSupportStatusService;