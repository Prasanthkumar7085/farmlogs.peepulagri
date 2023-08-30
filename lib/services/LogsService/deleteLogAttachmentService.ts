

const deleteLogAttachmentService = async (logId: string, attachmentId: string) => {

    const url = `${process.env.NEXT_PUBLIC_API_URL}/log/${logId}/attachments/${attachmentId}`;
    const options = {
        method: "DELETE"
    }
    try {
        const response: any = await fetch(url, options);
        const responseData = await response.json();
        return responseData;


    } catch (err: any) {
        console.error(err);

    }
}
export default deleteLogAttachmentService;