const getAllLogsService = async ({
  taskId,
  token,
}: {
  taskId: string;
  token: string;
}) => {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/logs/all`;
    let options = {
      method: "GET",
      headers: new Headers({
        authorization: token,
      }),
    };
    let response = await fetch(url, options);
    let responseData = await response.json();
    return responseData;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default getAllLogsService;
