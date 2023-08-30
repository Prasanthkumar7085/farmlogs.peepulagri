

const getLogAttachmentsService = async (logId: any) => {

    const url = `${process.env.NEXT_PUBLIC_API_URL}/log/${logId}/attachments/download`;

    try {
        const options = {
            method: "POST",
        }
        const response: any = await fetch(url, options);
        const responseData = await response.json();
        return responseData;

    } catch (err: any) {
        console.error(err);

    }
}
export default getLogAttachmentsService;