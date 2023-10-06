const getAllTasksService = async ({ page, limit, paramString, accessToken }: { page: number | string, limit: number | string, paramString: string, accessToken: string }) => {

    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/tasks/${page}/${limit}${paramString}`;

        const options = {
            method: "GET",
            headers: new Headers({
                'authorization': accessToken
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
export default getAllTasksService;