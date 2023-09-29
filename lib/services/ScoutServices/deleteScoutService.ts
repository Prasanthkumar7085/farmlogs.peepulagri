const deleteScoutService = async (scoutId: string,token:string) => {

    const url = `${process.env.NEXT_PUBLIC_API_URL}/scouts/${scoutId}`;
    const options = {
        method: "DELETE",
        headers: new Headers({
            'authorization':token
        })
    }
    try {
        const response: any = await fetch(url, options);
        const responseData = await response.json();
        return responseData;

    } catch (err: any) {
        console.error(err);

    }
}
export default deleteScoutService;