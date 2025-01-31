import { FormControl, MenuItem, Select } from "@mui/material"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import FarmDetailsMiniCard from "../AddLogs/farm-details-mini-card";
import FarmDetailsCard from "../TimeLine/FarmDetailsCard";

const SelectComponenentForLogs = ({ loading, setDefaultValue, options, captureFarmName, defaultValue, ...rest }: any) => {

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
                position: "sticky",
                top: "0px",
                width: "100%",
                zIndex: "150",
                textAlign: "center",
                '& .MuiInputBase-root': {
                    fontSize: "clamp(.875rem, 1vw, 1.125rem)",
                    fontFamily: "'IBM plex sans', sans-serif",
                    backgroundColor: "brown",
                    border: "none",
                    width: "200px",
                    margin: "20px 20px 0",
                },

                '& .MuiSelect-nativeInput': {
                    opacity: "1",
                    bottom: "inherit",
                    padding: "8px 3px 8px 8px",
                    border: "1px solid rgba(0, 0, 0, 0.231372549) !important",
                    borderRadius: "5px",
                    fontSize: "clamp(.875rem, 1vw, 1.125rem)",
                    height: "40px",
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    border: "none !important"
                }
            }}

        >

            {!loading ? <Select
                {...rest}
                value={statusOptions?.title ? statusOptions?.title : defaultValue}
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

            </Select> : ""}
            {/* <FarmDetailsCard /> */}
        </FormControl>
    )
}
export default SelectComponenentForLogs