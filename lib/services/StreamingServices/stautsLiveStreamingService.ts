
const stautsLiveStreamingService = async () => {

    try {
        let options = {
            method: "GET",
        }
        let response: any = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ros-bot/status`, options);
        const responseData = await response.json();
        return responseData;


    } catch (err: any) {
        console.error(err);
        return
    }
}


export default stautsLiveStreamingService;