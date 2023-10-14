const ListAllCropsForDropDownServices = async (queryParamsUrl: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/farm/crops/list${queryParamsUrl}`;

    const response = await fetch(url, { method: "GET" });
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.error(err);
    return;
  }
};

export default ListAllCropsForDropDownServices;
