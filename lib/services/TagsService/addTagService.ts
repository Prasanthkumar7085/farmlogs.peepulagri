const addTagService = async ({
  body,
  token,
}: {
  body: { farm_image_ids: string[]; tags: string[] };
  token: string;
}) => {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/farm-images/tag`;
    let options = {
      method: "POST",
      body: JSON.stringify(body),
      headers: new Headers({
        authorization: token,
        "content-type": "application/json",
      }),
    };
    let response = await fetch(url, options);
    let responseData = await response.json();
    return responseData;
  } catch (err) {
    console.error(err);
    return;
  }
};

export default addTagService;
