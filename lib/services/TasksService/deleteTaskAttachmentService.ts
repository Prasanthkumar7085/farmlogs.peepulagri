const deleteTaskAttachmentService = async ({
  token,
  taskId,
  body,
}: {
  token: string;
  taskId: string;
  body: { attachment_ids: Array<string> };
}) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/attachments`;
    let options = {
      method: "DELETE",
      body: JSON.stringify(body),
      headers: new Headers({
        authorization: token,
        "content-type": "application/json",
      }),
    };
    let response = await fetch(url, options);
    let responseData = await response.json();
    return responseData;
  } catch (err: any) {
    console.error(err);
    return err;
  }
};

export default deleteTaskAttachmentService;
