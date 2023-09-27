import { FormControl, MenuItem, Select } from "@mui/material"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import FarmDetailsMiniCard from "../AddLogs/farm-details-mini-card";
import FarmDetailsCard from "../TimeLine/FarmDetailsCard";

const SelectComponenentForFarms = ({ loading, setDefaultValue, options, captureFarmName, defaultValue, ...rest }: any) => {

    const router = useRouter();

    const [statusOptions, setStatusOptions] = useState<any>();
    const [farmOptions, setFarmOptions] = useState<any>()

    let handleStatusChange = (event: any) => {

        let selectedOption = event.target.value;
        let selectedObject = options.find((item: any) => item.title == selectedOption);
        setStatusOptions(selectedObject);
        captureFarmName(selectedObject);

    }





    return (

        <Select
            {...rest}
            value={statusOptions?.title ? statusOptions?.title : defaultValue}
            onChange={handleStatusChange}
        >

            {options?.length && options.map((item: any, index: number) => {
                return (
                    <MenuItem value={item.title} key={index}>
                        {item.title}
                    </MenuItem>
                )
            })}

        </Select>
    )
}
export default SelectComponenentForFarms