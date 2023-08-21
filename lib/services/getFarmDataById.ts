
const getFarmDataById = async (id: string) => {

    try {
        let response: any = await fetch(`http://localhost:3000/v1.0/log/1/10`);
        const responseData = await response.json();
        if (response.ok) {
            return responseData;
        } else {
            return { message: 'Something Went Wrong', status: 500, details: response }
        }

    } catch (err: any) {
        console.error(err);

    }
}


export default getFarmDataById;