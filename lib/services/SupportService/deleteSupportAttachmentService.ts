

const deleteSupportAttachmentService = async (supportId: string, attachmentId: string) => {

    const url = `${process.env.NEXT_PUBLIC_API_URL}/support/${supportId}/attachments/${attachmentId}`;
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
export default deleteSupportAttachmentService;