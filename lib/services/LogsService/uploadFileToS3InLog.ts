
const uploadFileToS3 = async (preSignedUrl: string, body: any) => {

    try {
        const url = preSignedUrl;
        const options: any = {
            method: "PUT",
            body: body,
        }
        const response: any = await fetch(url, options);

        return response;

    } catch (err: any) {
        console.error(err);
        return err

    }
}
export default uploadFileToS3;