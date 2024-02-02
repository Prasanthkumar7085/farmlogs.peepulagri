const getProfileService = async (accessToken: string) => {

    try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/users/profile`;
        let options = {
            method: "GET",
            headers: new Headers({
                'authorization': accessToken,
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

export default getProfileService;