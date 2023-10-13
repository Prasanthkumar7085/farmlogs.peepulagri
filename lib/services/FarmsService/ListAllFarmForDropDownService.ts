const ListAllFarmForDropDownService = async (token: string) => {
  try {
    let options = {
      method: "GET",
      headers: new Headers({
        authorization: token,
      }),
    };
    let response: any = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/farm/list?order_by=title&order_type=asc`,
      options
    );
    const responseData = await response.json();
    return responseData;
  } catch (err: any) {
    console.error(err);
    return;
  }
};

export default ListAllFarmForDropDownService;
