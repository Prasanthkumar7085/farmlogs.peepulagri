import { useState } from "react";

const ErrorMessagesComponent = ({ errorMessage }: { errorMessage: string }) => {

    return (
        <div style={{ color: "red", fontSize: "12px", marginBlock: errorMessage ? "4px" : "0px", display: errorMessage ? "block" : "none" }}>
            {errorMessage}
        </div>
    )
}


export default ErrorMessagesComponent;