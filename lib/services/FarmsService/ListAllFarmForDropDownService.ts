import { prepareURLEncodedParams } from "../../requestUtils/urlEncoder";

const ListAllFarmForDropDownService = async (
  queryString: string,
  token: string
) => {
  try {
    let options = {
      method: "GET",
      headers: new Headers({
        authorization: token,
      }),
    };
    let queryParams: any = {};

    if (queryString) {
      queryParams["search_string"] = queryString;
    }
    let url = prepareURLEncodedParams(
      `${process.env.NEXT_PUBLIC_API_URL}/farms/1/20`,
      queryParams
    );
    let response: any = await fetch(
      url,
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
