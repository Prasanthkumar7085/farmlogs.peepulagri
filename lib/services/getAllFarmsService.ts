
const getAllFarms = async () => {

    try {
        let response: any = await fetch('http://localhost:3000/v1.0/farm/1/10');
        console.log(response);
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


export default getAllFarms;