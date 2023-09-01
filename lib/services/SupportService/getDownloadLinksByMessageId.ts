

const getDownloadLinksByMessageId = async (supportId: string, messageId: string) => {

    const url = `${process.env.NEXT_PUBLIC_API_URL}/support/${supportId}/conversation-messages/${messageId}/attachments-download`;

    const options = {
        method: "POST",
        headers: new Headers({
            'content-type': 'application/json'
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
export default getDownloadLinksByMessageId;