const deletePOCService = async ({
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
      method: "DELETE",
      headers: new Headers({
        Authorization: token,
        "content-type": "application/json",
      }),

      body: JSON.stringify(body),
    };
    const response = await fetch(url, options);
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
export default deletePOCService;
