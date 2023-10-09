const getAllUsersService = async({ token }:{ token:string }) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/users/list`;
        const options = {
            method: "GET",
            headers: new Headers({
                'authorization':token
            })
        }
        const response = await fetch(url,options);
        const responseData = await response.json();
        return responseData;
    } catch (err) {
        console.error(err);
        return
    }
}

export default getAllUsersService;