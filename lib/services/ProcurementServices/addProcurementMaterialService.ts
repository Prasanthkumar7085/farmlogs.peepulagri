const addProcurementMaterialService = async ({
  body,
  token,
}: {
  body: {
    procurement_req_id: string;
    name: string;
    required_qty: number | null;
    required_units: string;
    available_qty?: number | null;
    available_units?: string;
  };
  token: string;
}) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/procurement-requests/materials`;
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

export default addProcurementMaterialService;
