import React from "react";

export interface AlertComponentType {
    alertMessage: string;
    alertType: Boolean;
    setAlertMessage: React.Dispatch<React.SetStateAction<string>>
}

export interface AlertComponentMobileType {
    alertMessage: string;
    alertType: Boolean;
    setAlertMessage: React.Dispatch<React.SetStateAction<string>>,
    mobile: boolean|undefined;
}