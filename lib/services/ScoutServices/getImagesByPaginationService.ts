interface ApiProps {
  page: number | string;
  farmId: string;
  cropId: string;
  accessToken: string;
}
const getImagesByPaginationService = async ({
  page,
  farmId,
  cropId,
  accessToken,
}: Partial<ApiProps>) => {

  try {
    let options = {
      headers: new Headers({
        authorization: accessToken as string,
      }),
    };
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/crops/${cropId}/images/${page}/10`,
      options
    );
    let responseData = await response.json();
    return responseData;
  } catch (err) {
    throw err;
  }
};
export default getImagesByPaginationService;
