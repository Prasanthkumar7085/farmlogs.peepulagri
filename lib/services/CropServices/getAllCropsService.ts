const getAllCropsService = async (farmId: string, queryParamsUrl: string, accessToken: any) => {
    try {

        const url = `${process.env.NEXT_PUBLIC_API_URL}/farms/${farmId}/crops/list${queryParamsUrl}`;

        const response = await fetch(url, {
            method: "GET",
            headers: new Headers({ Authorization: accessToken }),
        });
        const responseData = await response.json();
        return responseData;


    } catch (err) {
        console.error(err);
        return
    }
}

export default getAllCropsService;