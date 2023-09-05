import { useState } from "react";

const ErrorMessagesComponent = ({ errorMessage }: { errorMessage: string }) => {

    return (
        <p style={{ color: "red", fontSize: "12px" }}>
            {errorMessage}
        </p>
    )
}


export default ErrorMessagesComponent;