const checkIfAttachmentHasPreviewOrNot = (item: {
  metadata: { type: string };
},classNameOrNot=false) => {
  if (item?.metadata?.type.includes("pdf")) {
    return false;
  } else if (item?.metadata?.type.includes("csv")) {
    return false;
  } else if (
    item?.metadata?.type ==
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    return false;
  } else if (
    item?.metadata?.type.includes("doc") ||
    item?.metadata?.type.includes("docx")
  ) {
    return false;
  } else if (item?.metadata?.type.includes("video") ) {
    if(classNameOrNot){
      return false
    }
    return true;
  } else if (item?.metadata?.type?.includes("image")) {
    return true;
  } else {
    return false;
  }
};

export default checkIfAttachmentHasPreviewOrNot;
