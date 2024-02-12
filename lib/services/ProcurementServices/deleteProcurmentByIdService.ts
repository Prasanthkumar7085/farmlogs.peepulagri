const deleteProcurmentByIdService = async ({
  procurmentId,
  token,
}: {
  procurmentId: string;
  token: string;
}) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/procurement-requests/${procurmentId}`;
  const options: any = {
    method: "DELETE",
    headers: new Headers({
      'Content-Type': 'application/json',
      authorization: token,
    }),
  };
  try {
    const response: any = await fetch(url, options);
    const responseData = await response.json();
    return responseData;
  } catch (err: any) {
    console.error(err);
    return;
  }
};
export default deleteProcurmentByIdService;
