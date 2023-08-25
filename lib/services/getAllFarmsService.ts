
const getAllFarms = async () => {

    try {
        let response: any = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farm/1/10`);
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