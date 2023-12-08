const updateAttachmentsService = async ({
  scoutId,
  accessToken,
  body,
}: {
  scoutId: string;
  accessToken: string;
  body: any;
}) => {
  try {
    let options = {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: new Headers({
        "Content-type": "application/json",
        authorization: accessToken,
      }),
    };
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/scouts/${scoutId}/update-attachments`,
      options
    );
    let responseData = response.json();
    return responseData;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default updateAttachmentsService;
