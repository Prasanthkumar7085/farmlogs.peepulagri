
const uploadFileToS3 = async (preSignedUrl: string, body: any) => {
    console.log(body);

    try {
        const url = preSignedUrl;
        const options = {
            method: "PUT",
            body: JSON.stringify(body),
        }
        const response: any = await fetch(url, options);

        return response;

    } catch (err: any) {
        console.error(err);
        return err

    }
}
export default uploadFileToS3;