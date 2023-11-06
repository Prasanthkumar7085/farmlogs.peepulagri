const appendAttachmentsInTaskService = async ({
  taskId,
  body,
  token,
}: {
  taskId: string;
  body: any;
  token: string;
}) => {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/attachments`;
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

export default appendAttachmentsInTaskService;
