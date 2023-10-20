const postrecomendationsService = async (
  scoutId: any,
  token: string,
  data: any
) => {
  try {
    let options = {
      method: "PATCH",
      headers: new Headers({
        "content-type": "application/json",
        authorization: token,
      }),
      body: JSON.stringify(data),
    };
    let response: any = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/scouts/${scoutId}`,
      options
    );
    const responseData = await response.json();
    return responseData;
  } catch (err: any) {
    console.error(err);
    return err;
  }
};

export default postrecomendationsService;
