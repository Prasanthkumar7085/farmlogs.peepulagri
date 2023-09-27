// Your Base64-encoded image string
const base64Image = "data:image/jpeg;base64,/9j/4AAQSk..."; // Replace with your actual Base64 data

// Function to convert Base64 to a File object
const base64ToFile = (base64: any, filename: any, mimeType: any) => {
    // Split the Base64 data into its parts
    const base64Parts = base64.split(",");
    const contentType = base64Parts[0].match(/:(.*?);/)[1];
    const rawBase64 = base64Parts[1];

    // Convert the Base64-encoded data to binary
    const binaryString = atob(rawBase64);
    const binaryData = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        binaryData[i] = binaryString.charCodeAt(i);
    }

    // Create a Blob from the binary data
    const blob = new Blob([binaryData], { type: contentType });

    // Create a File object from the Blob
    return new File([blob], filename, { type: mimeType });
}
export default base64ToFile;


