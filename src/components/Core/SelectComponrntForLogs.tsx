import { FormControl, MenuItem, Select } from "@mui/material"
import { useEffect, useState } from "react";
import getAllFarmsService from "../../../lib/services/FarmsService/getAllFarmsService";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const SelectComponenentForLogs = ({ setDefaultValue, options, captureFarmName, defaultValue, ...rest }: any) => {

    const router = useRouter();

    const [statusOptions, setStatusOptions] = useState<any>();
    const [farmOptions, setFarmOptions] = useState<any>()
    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

    let handleStatusChange = (event: any) => {

        let selectedOption = event.target.value;
        let selectedObject = farmOptions.find((item: any) => item.title == selectedOption);
        router.push({ pathname: "/timeline", query: { farm_id: selectedObject?._id } });
        setStatusOptions(selectedObject);
        captureFarmName(selectedObject);

    }
    useEffect(() => {
        getFormDetails()
    }, [accessToken, router?.query?.farm_id]);


    const getFormDetails = async () => {

        setFarmOptions(options);
        if (options && options?.length) {
            if (router.query?.farm_id) {
                const array = options.find((item: any) => item?._id == router.query?.farm_id)
                setDefaultValue(array?.title)

            } else {
                setDefaultValue(options[0].title);
            }


        }

        // let response = await getAllFarmsService(accessToken)
        // if (response?.success) {
        //     setFarmOptions(response?.data);
        // }
    }


    return (
        <FormControl
            size="small"
            sx={{
                width: "100%",

                '& .MuiInputBase-root': {
                    fontSize: "clamp(.875rem, 1vw, 1.125rem)",
                    fontFamily: "'IBM plex sans', sans-serif",
                    backgroundColor: "brown",
                    border: "none",
                    width: "15%",
                },

                '& .MuiSelect-nativeInput': {
                    opacity: "1",
                    bottom: "inherit",
                    padding: "8px 3px 8px 8px",
                    border: "1px solid rgba(0, 0, 0, 0.231372549) !important",
                    borderRadius: "5px",
                    fontSize: "clamp(.875rem, 1vw, 1.125rem)",
                    minHeight: "40px",
                    maxHeight: "40px",
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    border: "none !important"
                }
            }}

        >

            <Select
                {...rest}
                value={statusOptions ? statusOptions : defaultValue}
                onChange={handleStatusChange}
                sx={{ width: "150px" }}
            >

                {farmOptions?.length && farmOptions.map((item: any, index: number) => {
                    return (
                        <MenuItem value={item.title} key={index}>
                            {item.title}
                        </MenuItem>
                    )
                })}

            </Select>
        </FormControl>
    )
}
export default SelectComponenentForLogs