const editProfileService = async ({ body, accessToken }: { body: any, accessToken: string }) => {

    try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/users/update-user`;
        let options = {
            method: "PATCH",
            body: JSON.stringify(body),
            headers: new Headers({
                'authorization': accessToken,
                'content-type': 'application/json'
            })
        }
        let response = await fetch(url, options);
        let responseData = await response.json();
        return responseData;
    } catch (err) {
        console.error(err);
        return
    }


}

export default editProfileService;