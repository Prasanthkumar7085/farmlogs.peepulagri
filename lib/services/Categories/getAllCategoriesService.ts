
const getAllCategoriesService = async () => {

    try {
        let response: any = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`);
        const responseData = await response.json();
        return responseData;

    } catch (err: any) {
        console.error(err);

    }
}


export default getAllCategoriesService;