function processString(inputString: string) {
  //   bullets for i. a. 1. ...
  let trimmedString = inputString.trim();

  let regex = /^(?:\d+\.|\w+\.\s*)/;
  if (regex.test(trimmedString)) {
    trimmedString = trimmedString.replace(regex, "");
  }

  return trimmedString;
}

//function to formatext
export default function formatText(input: string) {
  if (input && input?.length) {
    input = input?.replace(/\/n/g, "\n");

    if (/\d+\./.test(input) || /[a-z]\./i.test(input)) {
      let lines = input.split("\n");
      let output = "";

      lines.forEach((line: any) => {
        let updatedLine = line.trim();
        let regex = /^(?:\d+\.|\w+\.\s*)/;
        if (regex.test(updatedLine)) {
          output += `\u2022 ${processString(line)}\n`;
        } else {
          output += `${line}\n`;
        }
      });
      return output;
    } else {
      return input;
    }
  } else return "";
}
