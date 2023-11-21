const ListAllCropsForDropDownServices = async (
  farmId: string,
  accessToken: string
) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/farms/${farmId}/crops/list`;
    const options = {
      method: "GET",
      headers: new Headers({ Authorization: accessToken }),
    };
    const response = await fetch(url, options);
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.error(err);
    return;
  }
};

export default ListAllCropsForDropDownServices;
