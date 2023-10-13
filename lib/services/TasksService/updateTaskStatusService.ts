interface pageProps {
  token: string;
  taskId: string;
  body: { status: string };
}
const updateTaskStatusService = async ({ token, taskId, body }: pageProps) => {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/status`;
    let options = {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: new Headers({
        authorization: token,
        "content-type": "application/json",
      }),
    };
    let response = await fetch(url, options);
    let responseData = await response.json();
    return responseData;
  } catch (err) {
    console.error(err);
    return;
  }
};

export default updateTaskStatusService;
