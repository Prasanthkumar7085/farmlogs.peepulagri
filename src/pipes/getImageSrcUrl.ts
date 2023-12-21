const getImageSrcUrl = (item: any) => {
  if (item?.metadata?.type.includes("pdf")) {
    return "/pdf-icon.png";
  } else if (item?.metadata?.type.includes("csv")) {
    return "/csv-icon.png";
  } else if (
    item?.metadata?.type ==
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    return "/google-sheets-icon.webp";
  } else if (
    item?.metadata?.type.includes("doc") ||
    item?.metadata?.type.includes("docx")
  ) {
    return "/doc-icon.webp";
  } else if (item?.metadata?.type.includes("video")) {
    return "/video-icon.png";
  } else if (item?.metadata?.type?.includes("image")) {
    return item?.url;
  } else {
    return "/other_icon.png";
  }
};

export default getImageSrcUrl;
