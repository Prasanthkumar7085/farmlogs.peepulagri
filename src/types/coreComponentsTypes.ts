import React from "react";

export interface AlertComponentType {
    alertMessage: string;
    alertType: Boolean;
    setAlertMessage: React.Dispatch<React.SetStateAction<string>>,
}