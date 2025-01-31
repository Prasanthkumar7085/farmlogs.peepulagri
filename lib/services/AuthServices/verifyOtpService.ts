const verifyOtpService = async (body: any) => {

    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/users/signup-or-signin/verify`;

        const options = {
            method: "POST",
            body: JSON.stringify(body),
            headers: new Headers({
                'content-type': 'application/json'
            })
        }
        const response: any = await fetch(url, options);
        const responseData = await response.json();
        return responseData;

    } catch (err: any) {
        console.error(err);

    }
}
export default verifyOtpService;