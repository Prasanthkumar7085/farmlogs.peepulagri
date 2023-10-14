const getAllExixtedScoutsService = async ({
  url,
  token,
}: {
  url: string;
  token: string;
}) => {
  try {
    let options = {
      headers: new Headers({
        Authorization: token,
      }),
      method: "GET",
    };
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${url}`,
      options
    );
    let responseData = await response.json();
    return responseData;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export default getAllExixtedScoutsService;
