

const getTaskByIdService = async ({taskId,token}:{taskId:string,token:string}) => {

    const url = `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`
    const options = {
        method:"GET",
        headers: new Headers({
            'authorization': token
        })
    }
    try {
        const response: any = await fetch(url,options);
        const responseData = await response.json();
        return responseData;


    } catch (err: any) {
        console.error(err);

    }
}
export default getTaskByIdService;