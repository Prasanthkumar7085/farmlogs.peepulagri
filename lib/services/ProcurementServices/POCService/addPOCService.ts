const addPOCService = async ({
  token,
  procurementId,
  body,
}: {
  token: string;
  procurementId: string;
  body: { point_of_contact: string };
}) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/procurement-requests/${procurementId}/poc`;
    const options = {
      method: "POST",
      body: JSON.stringify(body),
      headers: new Headers({
        Authorization: token,
        "content-type": "application/json",
      }),
    };

    const response = await fetch(url, options);
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default addPOCService;
