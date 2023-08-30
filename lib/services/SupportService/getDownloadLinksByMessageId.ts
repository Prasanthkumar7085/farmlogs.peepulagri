

const getDownloadLinksByMessageId = async (supportId: string, attachmentId: string) => {

    const url = `${process.env.NEXT_PUBLIC_API_URL}/support/${supportId}/conversation-messages/${attachmentId}/attachments-download`;
    console.log(supportId);
    console.log(attachmentId);



    // const url = `${process.env.NEXT_PUBLIC_API_URL}/support/${'64ddc96ed608ebb565a053c9'}/conversation-messages/${'64ddc9f0d608ebb565a053ce'}/attachments-download`;
    // support/64ddc96ed608ebb565a053c9/conversation-messages/64ddc9f0d608ebb565a053ce/attachments-download
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