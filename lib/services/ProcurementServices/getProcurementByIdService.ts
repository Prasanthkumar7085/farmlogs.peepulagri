const getProcurementByIdService = async ({
  procurementId,
  accessToken,
}: {
  procurementId: string;
  accessToken: string;
}) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/procurement-requests/${procurementId}`;
    const options = {
      headers: new Headers({
        Authorization: accessToken,
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

export default getProcurementByIdService;
