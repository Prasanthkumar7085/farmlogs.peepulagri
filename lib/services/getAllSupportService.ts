
const getAllSupportService = async () => {

    try {
        const response: any = await fetch(`http://localhost:3000/v1.0/support/1/10`);
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
export default getAllSupportService;