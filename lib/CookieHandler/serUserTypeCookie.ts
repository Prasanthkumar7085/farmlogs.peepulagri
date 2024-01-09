const serUserTypeCookie = async (userType_v2: any) => {
  let options = {
    method: "POST",
    body: JSON.stringify({
      cookie_name: "userType_v2",
      cookie_value: userType_v2,
    }),
  };
  let response = await fetch("/api/set-cookie", options);
  let responseData = await response.json();
  return {
    data: responseData,
    message: "Successfully set User Type Cookie",
    success: true,
    status: 200,
  };
};

export default serUserTypeCookie;
