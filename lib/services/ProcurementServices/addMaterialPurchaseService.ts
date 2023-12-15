const addMaterialParchaseService = async ({ body, token, id }: any) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/procurement-requests/materials/${id}/purchase`;
        const options = {
            method: "PATCH",
            headers: new Headers({
                authorization: token,
                "content-type": "application/json",
            }),
            body: JSON.stringify(body),
        };
        const response = await fetch(url, options);
        const responseData = await response.json();
        return responseData;
    } catch (err) {
        throw err;
        console.error(err);
    }
};

export default addMaterialParchaseService;
