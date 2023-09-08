import { useState } from "react";

const ErrorMessagesComponent = ({ errorMessage }: { errorMessage: string }) => {

    return (
        <div style={{ color: "red", fontSize: "12px", marginBottom: "0.5rem" }}>
            {errorMessage}
        </div>
    )
}


export default ErrorMessagesComponent;