interface ApiProps {
  page: number;
  id: string;
  accessToken: string;
}
const getImagesByPaginationService = async ({
  page,
  id,
  accessToken,
}: Partial<ApiProps>) => {
  try {
    let options = {
      headers: new Headers({
        authorization: accessToken as string,
      }),
    };
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/scouts/${id}`,
      options
    );
    let responseData = await response.json();
    return responseData;
  } catch (err) {
    throw err;
  }
};
export default getImagesByPaginationService;
