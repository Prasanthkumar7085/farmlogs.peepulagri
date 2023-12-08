const getMaterialsByProcurementIdService = async ({
  procurementId,
  token,
}: {
  procurementId: string;
  token: string;
}) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/procurement-requests/${procurementId}/materials/list`;
    const options = {
      headers: new Headers({
        Authorization: token,
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

export default getMaterialsByProcurementIdService;
