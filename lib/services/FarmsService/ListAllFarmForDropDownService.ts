import { prepareURLEncodedParams } from "../../requestUtils/urlEncoder";

const ListAllFarmForDropDownService = async (
  searchString: string,
  token: string,
  location_id: string
) => {
  try {
    let options = {
      method: "GET",
      headers: new Headers({
        authorization: token,
      }),
    };
    let queryParams: any = {};

    if (searchString) {
      queryParams["search_string"] = searchString;
    }
    if (location_id) {
      queryParams["location_id"] = location_id;

    }
    let url = prepareURLEncodedParams(
      `${process.env.NEXT_PUBLIC_API_URL}/farms/1/20`,
      queryParams
    );
    let response: any = await fetch(url, options);
    const responseData = await response.json();
    return responseData;
  } catch (err: any) {
    console.error(err);
    throw err;
  }
};

export default ListAllFarmForDropDownService;
