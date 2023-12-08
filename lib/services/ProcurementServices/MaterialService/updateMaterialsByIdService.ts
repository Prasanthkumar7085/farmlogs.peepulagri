const updateMaterialsByIdService = async ({
  body,
  token,
  materialId,
}: {
  body: {
    procurement_req_id: string;
    name: string;
    required_qty: number | null;
    required_units: string;
    available_qty?: number | null;
    available_units?: string;
  };
  materialId: string;
  token: string;
}) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/procurement-requests/materials/${materialId}`;
    const options = {
      method: "PATCH",
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

export default updateMaterialsByIdService;
