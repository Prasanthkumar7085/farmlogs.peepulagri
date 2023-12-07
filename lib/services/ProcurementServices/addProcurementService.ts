const addProcurementService = async ({
  body,
  token,
}: {
  body: {
    title: string;
    date_of_operation: string;
    farm_ids: string[];
    remarks: string;
  };
  token: string;
}) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/procurement-requests`;
    const options = {
      method: "POST",
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

export default addProcurementService;
