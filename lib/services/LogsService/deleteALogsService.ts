

const deleteALogService = async (id: string) => {

    const url = `${process.env.NEXT_PUBLIC_API_URL}/log/${id}`;
    const options = {
        method: "DELETE"
    }
    try {
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
export default deleteALogService;