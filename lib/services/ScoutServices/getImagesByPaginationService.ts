interface ApiProps {
  page: number | string;
  farmId: string;
  cropId: string;
  accessToken: string;
}
const getImagesByPaginationService = async ({
  page,
  farmId = "65520cdb4a54289a080ba082",
  cropId = "65523d10c81da3777b7283c7",
  accessToken,
}: Partial<ApiProps>) => {
  try {
    let options = {
      headers: new Headers({
        authorization: accessToken as string,
      }),
    };
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/farms/${farmId}/crops/${cropId}/farm-images/${page}/10`,
      options
    );
    let responseData = await response.json();
    return responseData;
  } catch (err) {
    throw err;
  }
};
export default getImagesByPaginationService;
